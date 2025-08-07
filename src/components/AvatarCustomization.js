import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { avatarOptions, isItemUnlocked } from '../data/avatarOptions';

export default function AvatarCustomization({ onClose }) {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.profile);
  const stats = useSelector(state => state.stats);
  const level = useSelector(state => state.level);
  const achievements = useSelector(state => state.achievements);
  const quests = useSelector(state => state.quests);
  
  const [activeTab, setActiveTab] = useState('face');
  const [tempAvatar, setTempAvatar] = useState(profile.avatar || {
    face: 'face1',
    hair: 'hair1',
    hairColor: 'brown',
    outfit: 'casual',
    accessories: 'none',
    background: 'castle'
  });

  const totalQuests = quests.daily?.length + quests.weekly?.length || 0;

  const handleOptionSelect = (category, optionId) => {
    setTempAvatar(prev => ({
      ...prev,
      [category]: optionId
    }));
  };

  const handleSave = () => {
    dispatch({ 
      type: 'UPDATE_PROFILE', 
      payload: { avatar: tempAvatar }
    });
    onClose();
  };

  const tabs = [
    { id: 'face', name: 'Face', icon: '👤' },
    { id: 'hair', name: 'Hair', icon: '💇' },
    { id: 'outfit', name: 'Outfit', icon: '👕' },
    { id: 'accessories', name: 'Accessories', icon: '👑' },
    { id: 'background', name: 'Background', icon: '🏰' }
  ];

  const renderOptions = (category) => {
    const options = avatarOptions[category] || [];
    
    return (
      <div style={styles.optionsGrid}>
        {options.map(option => {
          const unlocked = isItemUnlocked(option, stats, level, achievements, totalQuests);
          const isSelected = tempAvatar[category] === option.id;
          
          return (
            <div
              key={option.id}
              style={{
                ...styles.optionCard,
                opacity: unlocked ? 1 : 0.5,
                border: isSelected ? '3px solid #7b2ff2' : '2px solid transparent',
                cursor: unlocked ? 'pointer' : 'not-allowed'
              }}
              onClick={() => unlocked && handleOptionSelect(category, option.id)}
            >
              {category === 'face' && (
                <img 
                  src={option.url} 
                  alt={option.name}
                  style={styles.facePreview}
                />
              )}
              {category === 'hair' && (
                <div style={{
                  ...styles.colorPreview,
                  backgroundColor: option.color || '#f0f0f0'
                }} />
              )}
              {category === 'hairColor' && (
                <div style={{
                  ...styles.colorPreview,
                  backgroundColor: option.value
                }} />
              )}
              {(category === 'outfit' || category === 'accessories' || category === 'background') && (
                <div style={styles.iconPreview}>
                  {category === 'outfit' && '👕'}
                  {category === 'accessories' && (option.id === 'glasses' ? '👓' : option.id === 'crown' ? '👑' : option.id === 'cape' ? '🦸' : option.id === 'medal' ? '🏅' : '❌')}
                  {category === 'background' && (option.id === 'castle' ? '🏰' : option.id === 'forest' ? '🌲' : option.id === 'mountains' ? '🏔️' : option.id === 'library' ? '📚' : '🌌')}
                </div>
              )}
              <p style={styles.optionName}>{option.name}</p>
              {!unlocked && (
                <p style={styles.requirement}>
                  🔒 {option.requirement}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Customize Your Avatar</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        
        <div style={styles.content}>
          {/* Preview */}
          <div style={styles.preview}>
            <div style={styles.avatarPreview}>
              {/* Background */}
              <div style={{
                ...styles.backgroundPreview,
                backgroundImage: `url(${getBackgroundImage(tempAvatar.background)})`
              }}>
                {/* Character */}
                <img 
                  src={avatarOptions.face.find(f => f.id === tempAvatar.face)?.url}
                  alt="Avatar"
                  style={styles.characterPreview}
                />
                {/* Accessories */}
                {tempAvatar.accessories !== 'none' && (
                  <div style={styles.accessoryOverlay}>
                    {getAccessoryEmoji(tempAvatar.accessories)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={styles.tabs}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                style={{
                  ...styles.tab,
                  background: activeTab === tab.id ? '#7b2ff2' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#7b2ff2'
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                <span style={{ fontSize: 18 }}>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Options */}
          <div style={styles.optionsContainer}>
            {renderOptions(activeTab)}
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button style={styles.saveBtn} onClick={handleSave}>
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions
const getBackgroundImage = (backgroundId) => {
  const backgrounds = {
    castle: 'https://images.unsplash.com/photo-1520637836862-4d197d17c46a?w=400',
    forest: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    mountains: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    library: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    space: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400'
  };
  return backgrounds[backgroundId] || backgrounds.castle;
};

const getAccessoryEmoji = (accessoryId) => {
  const emojis = {
    glasses: '👓',
    crown: '👑',
    cape: '🦸',
    medal: '🏅'
  };
  return emojis[accessoryId] || '';
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)',
    borderRadius: 20,
    width: '90%',
    maxWidth: 800,
    maxHeight: '90vh',
    overflow: 'hidden',
    color: '#fff',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 24,
    cursor: 'pointer',
    padding: 8,
  },
  content: {
    padding: 24,
    maxHeight: 'calc(90vh - 140px)',
    overflowY: 'auto',
  },
  preview: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 24,
  },
  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: '50%',
    overflow: 'hidden',
    border: '4px solid rgba(255,255,255,0.3)',
    position: 'relative',
  },
  backgroundPreview: {
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  characterPreview: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  accessoryOverlay: {
    position: 'absolute',
    top: -10,
    right: -10,
    fontSize: 24,
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  tab: {
    background: 'transparent',
    border: '2px solid #7b2ff2',
    borderRadius: 12,
    padding: '8px 16px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    fontWeight: 600,
    transition: 'all 0.2s',
  },
  optionsContainer: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: 12,
  },
  optionCard: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  facePreview: {
    width: 40,
    height: 40,
    objectFit: 'contain',
    marginBottom: 8,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    margin: '0 auto 8px',
    border: '2px solid rgba(255,255,255,0.3)',
  },
  iconPreview: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionName: {
    margin: 0,
    fontSize: 12,
    fontWeight: 600,
  },
  requirement: {
    margin: '4px 0 0 0',
    fontSize: 10,
    color: '#ffcccc',
    fontStyle: 'italic',
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid rgba(255,255,255,0.2)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelBtn: {
    background: 'transparent',
    border: '2px solid #fff',
    color: '#fff',
    borderRadius: 8,
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  saveBtn: {
    background: '#fff',
    border: 'none',
    color: '#7b2ff2',
    borderRadius: 8,
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 600,
  },
};
