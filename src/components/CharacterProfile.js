import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AvatarCustomization from './AvatarCustomization';
import { avatarOptions } from '../data/avatarOptions';
import { useNavigate } from 'react-router-dom';

export default function CharacterProfile({ user, onEdit }) {
  const navigate = useNavigate();
  const [showAvatarCustomization, setShowAvatarCustomization] = useState(false);
  const level = useSelector(state => state.level);
  const experience = useSelector(state => state.experience);
  const expToLevel = useSelector(state => state.expToLevel);
  const profile = useSelector(state => state.profile);
  const stats = useSelector(state => state.stats);
  const achievements = useSelector(state => state.achievements);

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

      <div style={styles.container}>
        {/* Back Button */}
        <div style={styles.backButtonContainer}>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={styles.backButton}
          >
            <span style={styles.backIcon}>←</span>
            <span>Back to Dashboard</span>
          </button>
        </div>

        <h1 style={styles.title}>🏆 Character Profile</h1>
        
        <div style={styles.profileCard}>
          <div style={styles.avatarSection}>
            {renderAvatar()}
          </div>
          
          <div style={styles.infoSection}>
            <h2 style={styles.characterName}>{profile.name || 'Unnamed Hero'}</h2>
            <p style={styles.bio}>{profile.bio || 'No bio yet...'}</p>
            
            <div style={styles.levelInfo}>
              <h3 style={styles.levelTitle}>Level {level}</h3>
              <div style={styles.expBar}>
                <div 
                  style={{
                    ...styles.expFill,
                    width: `${(experience / expToLevel) * 100}%`
                  }}
                ></div>
              </div>
              <p style={styles.expText}>{experience} / {expToLevel} XP</p>
            </div>
          </div>
        </div>

        <div style={styles.statsCard}>
          <h3 style={styles.sectionTitle}>📊 Character Stats</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <span style={styles.statIcon}>💪</span>
              <span style={styles.statName}>Strength</span>
              <span style={styles.statValue}>{stats.strength || 0}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statIcon}>🧠</span>
              <span style={styles.statName}>Intelligence</span>
              <span style={styles.statValue}>{stats.intelligence || 0}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statIcon}>✨</span>
              <span style={styles.statName}>Charisma</span>
              <span style={styles.statValue}>{stats.charisma || 0}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statIcon}>🔄</span>
              <span style={styles.statName}>Adaptability</span>
              <span style={styles.statValue}>{stats.adaptability || 0}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statIcon}>🎯</span>
              <span style={styles.statName}>Willpower</span>
              <span style={styles.statValue}>{stats.willpower || 0}</span>
            </div>
          </div>
        </div>

        <div style={styles.achievementsCard}>
          <h3 style={styles.sectionTitle}>🏅 Recent Achievements</h3>
          <div style={styles.achievementsList}>
            {achievements && achievements.length > 0 ? (
              achievements.slice(-5).reverse().map((achievement, index) => (
                <div key={index} style={styles.achievementItem}>
                  <span style={styles.achievementIcon}>🏆</span>
                  <span style={styles.achievementText}>{achievement}</span>
                </div>
              ))
            ) : (
              <p style={styles.noAchievements}>No achievements yet. Complete some quests to earn your first achievement!</p>
            )}
          </div>
        </div>
      </div>
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
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: 'Poppins, sans-serif',
    paddingBottom: '120px', // Extra space for the dock
  },
  backButtonContainer: {
    marginBottom: '20px',
    position: 'sticky',
    top: '20px',
    zIndex: 100,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'Poppins, sans-serif',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
  },
  backIcon: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '30px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  profileCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    display: 'flex',
    gap: '30px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  avatarSection: {
    flex: '0 0 auto',
  },
  avatarContainer: {
    width: '200px',
    height: '200px',
    borderRadius: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  },
  avatar: {
    width: '120px',
    height: '120px',
    position: 'relative',
  },
  face: {
    width: '60px',
    height: '60px',
    position: 'absolute',
    top: '30px',
    left: '30px',
  },
  hair: {
    width: '70px',
    height: '40px',
    position: 'absolute',
    top: '20px',
    left: '25px',
  },
  outfit: {
    width: '50px',
    height: '40px',
    position: 'absolute',
    top: '70px',
    left: '35px',
  },
  accessories: {
    width: '40px',
    height: '20px',
    position: 'absolute',
    left: '40px',
  },
  infoSection: {
    flex: '1 1 300px',
  },
  characterName: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  bio: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '20px',
    fontStyle: 'italic',
  },
  levelInfo: {
    marginTop: '20px',
  },
  levelTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  expBar: {
    width: '100%',
    height: '20px',
    background: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '5px',
  },
  expFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
    transition: 'width 0.3s ease',
  },
  expText: {
    fontSize: '0.9rem',
    color: '#666',
    textAlign: 'center',
  },
  statsCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  achievementsCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    borderBottom: '2px solid #667eea',
    paddingBottom: '10px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px',
    background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
    borderRadius: '10px',
    border: '1px solid #dee2e6',
  },
  statIcon: {
    fontSize: '1.5rem',
  },
  statName: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
  },
  statValue: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#667eea',
  },
  achievementsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  achievementItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
    borderRadius: '10px',
    border: '1px solid #ffeaa7',
  },
  achievementIcon: {
    fontSize: '1.5rem',
  },
  achievementText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
  },
  noAchievements: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: '20px',
  },
};
