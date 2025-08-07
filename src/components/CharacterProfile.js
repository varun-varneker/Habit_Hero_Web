import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AvatarCustomization from './AvatarCustomization';
import { avatarOptions } from '../data/avatarOptions';

export default function CharacterProfile({ user, onEdit }) {
  const [showAvatarCustomization, setShowAvatarCustomization] = useState(false);
  const level = useSelector(state => state.level);
  const experience = useSelector(state => state.experience);
  const expToLevel = useSelector(state => state.expToLevel);

  // Get avatar image from user's avatar configuration
  const getAvatarImage = () => {
    if (user?.avatar?.face) {
      const faceOption = avatarOptions.face.find(f => f.id === user.avatar.face);
      return faceOption?.url || "https://img.icons8.com/color/96/000000/person-male.png";
    }
    return "https://img.icons8.com/color/96/000000/person-male.png";
  };

  const getBackgroundImage = () => {
    if (user?.avatar?.background) {
      const backgrounds = {
        castle: 'https://images.unsplash.com/photo-1520637836862-4d197d17c46a?w=400',
        forest: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
        mountains: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        library: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        space: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400'
      };
      return backgrounds[user.avatar.background] || backgrounds.castle;
    }
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  const progressPercentage = expToLevel > 0 ? (experience / expToLevel) * 100 : 0;

  return (
    <>
      <div style={{
        ...styles.card,
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div style={styles.overlay}>
          <div style={styles.avatarContainer}>
            <img src={getAvatarImage()} alt="Avatar" style={styles.avatar} />
            {user?.avatar?.accessories && user.avatar.accessories !== 'none' && (
              <div style={styles.accessory}>
                {user.avatar.accessories === 'crown' && '👑'}
                {user.avatar.accessories === 'glasses' && '👓'}
                {user.avatar.accessories === 'cape' && '🦸'}
                {user.avatar.accessories === 'medal' && '🏅'}
              </div>
            )}
            <button 
              style={styles.customizeBtn}
              onClick={() => setShowAvatarCustomization(true)}
              title="Customize Avatar"
            >
              ✨
            </button>
          </div>
          
          <h2 style={styles.name}>{user?.name || 'Your Hero Name'}</h2>
          <div style={styles.levelBadge}>Level {level}</div>
          
          {/* Experience Bar */}
          <div style={styles.expContainer}>
            <div style={styles.expBar}>
              <div 
                style={{
                  ...styles.expFill,
                  width: `${progressPercentage}%`
                }}
              />
            </div>
            <span style={styles.expText}>{experience} / {expToLevel} XP</span>
          </div>
          
          <p style={styles.bio}>{user?.bio || 'Write your mission or backstory here.'}</p>
          <button style={styles.editBtn} onClick={onEdit}>Edit Profile</button>
        </div>
      </div>
      
      {showAvatarCustomization && (
        <AvatarCustomization onClose={() => setShowAvatarCustomization(false)} />
      )}
    </>
  );
}

const styles = {
  card: {
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 24,
    textAlign: 'center',
    boxShadow: '0 2px 8px #7b2ff2aa',
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    background: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 20,
    position: 'relative',
    zIndex: 1,
  },
  avatarContainer: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    border: '3px solid #7b2ff2',
    background: '#fff',
  },
  accessory: {
    position: 'absolute',
    top: -8,
    right: -8,
    fontSize: 20,
    background: 'rgba(255,255,255,0.9)',
    borderRadius: '50%',
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customizeBtn: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    background: '#7b2ff2',
    border: 'none',
    borderRadius: '50%',
    width: 28,
    height: 28,
    color: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  name: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 22,
    margin: 0,
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  levelBadge: {
    background: '#7b2ff2',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    display: 'inline-block',
    margin: '8px 0',
  },
  expContainer: {
    margin: '12px 0',
  },
  expBar: {
    background: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    height: 8,
    overflow: 'hidden',
    marginBottom: 4,
  },
  expFill: {
    background: 'linear-gradient(90deg, #7b2ff2, #f357a8)',
    height: '100%',
    borderRadius: 10,
    transition: 'width 0.3s ease',
  },
  expText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  },
  bio: {
    color: '#f3e9ff',
    fontSize: 15,
    margin: '12px 0 16px 0',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  },
  editBtn: {
    background: '#fff',
    color: '#7b2ff2',
    border: 'none',
    borderRadius: 8,
    padding: '8px 20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
};
