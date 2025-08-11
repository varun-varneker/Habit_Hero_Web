import React from 'react';
import { useSelector } from 'react-redux';

export default function DashboardCharacterProfile({ onEdit }) {
  const profile = useSelector(state => state.profile);
  const stats = useSelector(state => state.stats);
  const level = useSelector(state => state.level);
  const experience = useSelector(state => state.experience);
  const expToLevel = useSelector(state => state.expToLevel);

  const renderAvatar = () => {
    const { face, hair, hairColor, outfit, accessories, background } = profile.avatar;
    
    return (
      <div style={{
        ...styles.avatarContainer,
        background: getBackgroundStyle(background)
      }}>
        <div style={styles.avatar}>
          <div style={{...styles.face, ...getFaceStyle(face)}}></div>
          <div style={{...styles.hair, ...getHairStyle(hair, hairColor)}}></div>
          <div style={{...styles.outfit, ...getOutfitStyle(outfit)}}></div>
          {accessories !== 'none' && (
            <div style={{...styles.accessories, ...getAccessoryStyle(accessories)}}></div>
          )}
        </div>
      </div>
    );
  };

  const getBackgroundStyle = (bg) => {
    const backgrounds = {
      castle: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
      forest: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
      desert: 'linear-gradient(135deg, #F4A460 0%, #DEB887 100%)',
      ocean: 'linear-gradient(135deg, #4169E1 0%, #87CEEB 100%)',
      mountain: 'linear-gradient(135deg, #696969 0%, #A9A9A9 100%)'
    };
    return { background: backgrounds[bg] || backgrounds.castle };
  };

  const getFaceStyle = (face) => {
    const faces = {
      face1: { background: '#FDBCB4', borderRadius: '50%' },
      face2: { background: '#F1C27D', borderRadius: '50%' },
      face3: { background: '#E0AC69', borderRadius: '50%' },
      face4: { background: '#C68642', borderRadius: '50%' }
    };
    return faces[face] || faces.face1;
  };

  const getHairStyle = (hair, color) => {
    const colors = {
      brown: '#8B4513',
      blonde: '#FFD700',
      black: '#000000',
      red: '#DC143C',
      blue: '#4169E1'
    };
    
    const hairStyles = {
      hair1: { 
        background: colors[color],
        clipPath: 'ellipse(80% 60% at 50% 40%)',
        borderRadius: '50% 50% 0 0'
      },
      hair2: {
        background: colors[color],
        clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
      },
      hair3: {
        background: colors[color],
        borderRadius: '0 0 50% 50%'
      }
    };
    return hairStyles[hair] || hairStyles.hair1;
  };

  const getOutfitStyle = (outfit) => {
    const outfits = {
      casual: { background: '#4169E1', borderRadius: '0 0 20px 20px' },
      formal: { background: '#000000', borderRadius: '0 0 20px 20px' },
      armor: { background: '#C0C0C0', borderRadius: '0 0 10px 10px' },
      robe: { background: '#800080', borderRadius: '0 0 30px 30px' }
    };
    return outfits[outfit] || outfits.casual;
  };

  const getAccessoryStyle = (accessory) => {
    const accessories = {
      glasses: { 
        background: 'transparent',
        border: '2px solid #000',
        borderRadius: '50%',
        width: '60%',
        height: '20%',
        top: '40%'
      },
      hat: {
        background: '#8B4513',
        borderRadius: '50% 50% 0 0',
        top: '-20%'
      },
      crown: {
        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
        clipPath: 'polygon(0% 100%, 20% 0%, 40% 100%, 60% 0%, 80% 100%, 100% 0%, 100% 100%)',
        top: '-15%'
      }
    };
    return accessories[accessory] || {};
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>👤 Character</h2>
        <button onClick={onEdit} style={styles.editButton}>
          ⚙️
        </button>
      </div>
      
      <div style={styles.content}>
        <div style={styles.avatarSection}>
          {renderAvatar()}
        </div>
        
        <div style={styles.infoSection}>
          <h3 style={styles.characterName}>{profile.name || 'Unnamed Hero'}</h3>
          <p style={styles.bio}>{profile.bio || 'A brave hero on an epic journey!'}</p>
          
          <div style={styles.levelInfo}>
            <div style={styles.levelHeader}>
              <span style={styles.levelText}>Level {level}</span>
              <span style={styles.expText}>{experience}/{expToLevel} XP</span>
            </div>
            <div style={styles.expBar}>
              <div 
                style={{
                  ...styles.expFill,
                  width: `${(experience / expToLevel) * 100}%`
                }}
              ></div>
            </div>
          </div>
          
          <div style={styles.quickStats}>
            <div style={styles.quickStat}>
              <span style={styles.quickStatIcon}>💪</span>
              <span style={styles.quickStatValue}>{stats.strength || 0}</span>
            </div>
            <div style={styles.quickStat}>
              <span style={styles.quickStatIcon}>🧠</span>
              <span style={styles.quickStatValue}>{stats.intelligence || 0}</span>
            </div>
            <div style={styles.quickStat}>
              <span style={styles.quickStatIcon}>✨</span>
              <span style={styles.quickStatValue}>{stats.charisma || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    marginBottom: '20px',
    fontFamily: 'Poppins, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  editButton: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  content: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  avatarSection: {
    flex: '0 0 auto',
  },
  avatarContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  },
  avatar: {
    width: '60px',
    height: '60px',
    position: 'relative',
  },
  face: {
    width: '30px',
    height: '30px',
    position: 'absolute',
    top: '15px',
    left: '15px',
  },
  hair: {
    width: '35px',
    height: '20px',
    position: 'absolute',
    top: '10px',
    left: '12.5px',
  },
  outfit: {
    width: '25px',
    height: '20px',
    position: 'absolute',
    top: '35px',
    left: '17.5px',
  },
  accessories: {
    width: '20px',
    height: '10px',
    position: 'absolute',
    left: '20px',
  },
  infoSection: {
    flex: '1 1 200px',
  },
  characterName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  bio: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 15px 0',
    fontStyle: 'italic',
    lineHeight: '1.3',
  },
  levelInfo: {
    marginBottom: '15px',
  },
  levelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
  },
  levelText: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#333',
  },
  expText: {
    fontSize: '0.8rem',
    color: '#666',
  },
  expBar: {
    width: '100%',
    height: '8px',
    background: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  expFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
    transition: 'width 0.3s ease',
  },
  quickStats: {
    display: 'flex',
    gap: '10px',
  },
  quickStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '5px',
    background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
    borderRadius: '6px',
    minWidth: '40px',
  },
  quickStatIcon: {
    fontSize: '1rem',
    marginBottom: '2px',
  },
  quickStatValue: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#667eea',
  },
};