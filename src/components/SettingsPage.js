import React, { useState } from 'react';
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
  
  const [profileData, setProfileData] = useState({
    name: profile.name || '',
    bio: profile.bio || ''
  });
  const [isLoading, setIsLoading] = useState(false);

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
};