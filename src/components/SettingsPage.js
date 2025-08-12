import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import { saveUserData } from '../api/userData';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const profile = useSelector(state => state.profile);
  const stats = useSelector(state => state.stats);
  const loginStreak = useSelector(state => state.loginStreak);
  
  const [profileData, setProfileData] = useState({
    name: profile.name || '',
    bio: profile.bio || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize login streak data if it doesn't exist
  useEffect(() => {
    if (!loginStreak) {
      const today = new Date().toDateString();
      dispatch({
        type: 'INITIALIZE_LOGIN_STREAK',
        payload: {
          currentStreak: 1,
          longestStreak: 1,
          lastLoginDate: today,
          totalLogins: 1
        }
      });
    } else {
      // Check if user logged in today
      checkDailyLogin();
    }
  }, []);

  const checkDailyLogin = () => {
    const today = new Date().toDateString();
    const lastLogin = loginStreak?.lastLoginDate;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    if (lastLogin !== today) {
      if (lastLogin === yesterdayString) {
        // Consecutive day login
        const newStreak = (loginStreak?.currentStreak || 0) + 1;
        const newLongest = Math.max(newStreak, loginStreak?.longestStreak || 0);
        
        dispatch({
          type: 'UPDATE_LOGIN_STREAK',
          payload: {
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastLoginDate: today,
            totalLogins: (loginStreak?.totalLogins || 0) + 1
          }
        });

        // Check for achievements
        checkLoginAchievements(newStreak);
      } else {
        // Streak broken
        dispatch({
          type: 'UPDATE_LOGIN_STREAK',
          payload: {
            currentStreak: 1,
            longestStreak: loginStreak?.longestStreak || 1,
            lastLoginDate: today,
            totalLogins: (loginStreak?.totalLogins || 0) + 1
          }
        });
      }
    }
  };

  const checkLoginAchievements = (streakDays) => {
    const loginMilestones = [
      { days: 3, title: "🔥 Early Bird", description: "Logged in for 3 consecutive days!" },
      { days: 5, title: "⭐ Consistent Hero", description: "Logged in for 5 consecutive days!" },
      { days: 7, title: "🏆 Week Warrior", description: "Logged in for 7 consecutive days!" },
      { days: 14, title: "💪 Fortnight Fighter", description: "Logged in for 14 consecutive days!" },
      { days: 21, title: "🌟 Habit Master", description: "Logged in for 21 consecutive days!" },
      { days: 30, title: "👑 Monthly Champion", description: "Logged in for 30 consecutive days!" },
      { days: 50, title: "🚀 Dedication Legend", description: "Logged in for 50 consecutive days!" },
      { days: 100, title: "💎 Century Hero", description: "Logged in for 100 consecutive days!" },
    ];

    const currentAchievements = achievements || [];
    
    loginMilestones.forEach(milestone => {
      if (streakDays >= milestone.days) {
        const alreadyHas = currentAchievements.some(achievement => 
          achievement.includes(milestone.title)
        );
        
        if (!alreadyHas) {
          dispatch({
            type: 'ADD_ACHIEVEMENT',
            payload: `${milestone.title} - ${milestone.description}`
          });
        }
      }
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      dispatch({ type: 'UPDATE_PROFILE', payload: profileData });
      
      if (user) {
        await saveUserData(user.uid, {
          profile: { ...profile, ...profileData },
          stats,
          lastUpdated: new Date().toISOString()
        });
      }
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      dispatch({ type: 'LOGOUT' });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  const getStreakColor = (days) => {
    if (days >= 30) return '#FFD700'; // Gold
    if (days >= 14) return '#C0C0C0'; // Silver
    if (days >= 7) return '#CD7F32';  // Bronze
    if (days >= 3) return '#4CAF50';  // Green
    return '#2196F3'; // Blue
  };

  const getStreakEmoji = (days) => {
    if (days >= 100) return '💎';
    if (days >= 50) return '🚀';
    if (days >= 30) return '👑';
    if (days >= 21) return '🌟';
    if (days >= 14) return '💪';
    if (days >= 7) return '🏆';
    if (days >= 5) return '⭐';
    if (days >= 3) return '🔥';
    return '✨';
  };

  const currentStreak = loginStreak?.currentStreak || 0;
  const longestStreak = loginStreak?.longestStreak || 0;
  const totalLogins = loginStreak?.totalLogins || 0;

  // Get next milestone
  const milestones = [3, 5, 7, 14, 21, 30, 50, 100];
  const nextMilestone = milestones.find(milestone => milestone > currentStreak) || 100;
  const progressToNext = currentStreak / nextMilestone;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚙️ Settings</h1>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Profile Settings</h2>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Character Name</label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            style={styles.input}
            placeholder="Enter your character name"
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            style={styles.textarea}
            placeholder="Tell us about your character..."
            rows={4}
          />
        </div>
        
        <button 
          onClick={handleSave} 
          style={{...styles.button, ...styles.saveButton}}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Account</h2>
        <p style={styles.text}>Email: {user?.email}</p>
        
        <button 
          onClick={handleLogout}
          style={{...styles.button, ...styles.logoutButton}}
        >
          🚪 Logout
        </button>
      </div>

      <div style={styles.backButtonContainer}>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{...styles.button, ...styles.backButton}}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div style={styles.streakTracker}>
        <div style={styles.header}>
          <h2 style={styles.title}>🔥 Login Streak</h2>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{profile?.name || 'Hero'}</span>
          </div>
        </div>

        <div style={styles.mainStreak}>
          <div style={styles.streakDisplay}>
            <span style={styles.streakEmoji}>{getStreakEmoji(currentStreak)}</span>
            <div style={styles.streakInfo}>
              <span style={styles.streakNumber}>{currentStreak}</span>
              <span style={styles.streakLabel}>Day{currentStreak !== 1 ? 's' : ''}</span>
            </div>
          </div>
          
          <div style={styles.streakDescription}>
            <p style={styles.motivationText}>
              {currentStreak === 0 && "Start your journey today!"}
              {currentStreak === 1 && "Great start! Keep going!"}
              {currentStreak >= 2 && currentStreak < 7 && "Building momentum! 💪"}
              {currentStreak >= 7 && currentStreak < 14 && "You're on fire! 🔥"}
              {currentStreak >= 14 && currentStreak < 30 && "Incredible dedication! ⭐"}
              {currentStreak >= 30 && "You're a legend! 👑"}
            </p>
          </div>
        </div>

        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Next milestone: {nextMilestone} days</span>
            <span style={styles.progressCount}>{currentStreak}/{nextMilestone}</span>
          </div>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${Math.min(progressToNext * 100, 100)}%`,
                background: `linear-gradient(90deg, ${getStreakColor(currentStreak)}, ${getStreakColor(nextMilestone)})`
              }}
            />
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>🏆</span>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{longestStreak}</span>
              <span style={styles.statLabel}>Longest Streak</span>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <span style={styles.statIcon}>📅</span>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{totalLogins}</span>
              <span style={styles.statLabel}>Total Logins</span>
            </div>
          </div>
        </div>

        <div style={styles.milestonesPreview}>
          <h3 style={styles.milestonesTitle}>🎯 Upcoming Rewards</h3>
          <div style={styles.milestonesList}>
            {[3, 5, 7, 14, 21, 30].filter(days => days > currentStreak).slice(0, 3).map(days => (
              <div key={days} style={styles.milestoneItem}>
                <span style={styles.milestoneEmoji}>{getStreakEmoji(days)}</span>
                <span style={styles.milestoneText}>{days} days</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
    fontFamily: 'Poppins, sans-serif',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '40px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  section: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    maxWidth: '600px',
    margin: '0 auto 30px auto',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    borderBottom: '2px solid #667eea',
    paddingBottom: '10px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'Poppins, sans-serif',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'Poppins, sans-serif',
    transition: 'border-color 0.3s ease',
    resize: 'vertical',
    minHeight: '100px',
    boxSizing: 'border-box',
  },
  text: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '20px',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'Poppins, sans-serif',
  },
  saveButton: {
    background: 'linear-gradient(135deg, #4CAF50, #45a049)',
    color: '#fff',
  },
  logoutButton: {
    background: 'linear-gradient(135deg, #f44336, #d32f2f)',
    color: '#fff',
    marginTop: '10px',
  },
  backButton: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
  },
  backButtonContainer: {
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
  streakTracker: {
    marginTop: '40px',
    padding: '25px',
    borderRadius: '15px',
    background: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  userName: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500',
  },
  mainStreak: {
    textAlign: 'center',
    marginBottom: '25px',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '12px',
    color: 'white',
  },
  streakDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '10px',
  },
  streakEmoji: {
    fontSize: '3rem',
  },
  streakInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: '3rem',
    fontWeight: 'bold',
    lineHeight: '1',
  },
  streakLabel: {
    fontSize: '1rem',
    opacity: 0.9,
    fontWeight: '500',
  },
  streakDescription: {
    marginTop: '10px',
  },
  motivationText: {
    fontSize: '1rem',
    margin: 0,
    opacity: 0.9,
    fontWeight: '500',
  },
  progressSection: {
    marginBottom: '20px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  progressLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500',
  },
  progressCount: {
    fontSize: '0.9rem',
    color: '#667eea',
    fontWeight: 'bold',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease',
    borderRadius: '4px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '20px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px',
    background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
  },
  statIcon: {
    fontSize: '1.5rem',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    lineHeight: '1',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#666',
    fontWeight: '500',
  },
  milestonesPreview: {
    borderTop: '1px solid #eee',
    paddingTop: '15px',
  },
  milestonesTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  milestonesList: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  milestoneItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '8px 12px',
    background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
    borderRadius: '20px',
    border: '1px solid #ffeaa7',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  milestoneEmoji: {
    fontSize: '1rem',
  },
  milestoneText: {
    color: '#333',
  },
};