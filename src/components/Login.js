import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { loadUserData } from '../api/userData';

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userCredential = await login(email, password);
      const user = { uid: userCredential.user.uid, email: userCredential.user.email };
      
      // Set user in Redux
      dispatch({ type: 'SET_USER', payload: user });
      
      // Load user data from Firebase BEFORE navigation
      const userData = await loadUserData(user.uid);
      
      if (userData) {
        // Load all user data into Redux
        if (userData.profile) dispatch({ type: 'UPDATE_PROFILE', payload: userData.profile });
        if (userData.stats) dispatch({ type: 'UPDATE_STATS', payload: userData.stats });
        if (userData.quests) dispatch({ type: 'SET_QUESTS', payload: userData.quests });
        if (userData.achievements) dispatch({ type: 'SET_ACHIEVEMENTS', payload: userData.achievements });
        if (userData.inventory) dispatch({ type: 'SET_INVENTORY', payload: userData.inventory });
        if (userData.streaks) dispatch({ type: 'SET_STREAKS', payload: userData.streaks });
        if (userData.friends) dispatch({ type: 'SET_FRIENDS', payload: userData.friends });
        if (userData.friendRequests) dispatch({ type: 'SET_FRIEND_REQUESTS', payload: userData.friendRequests });
        
        // Check if user has completed character creation
        if (userData.profile && userData.profile.name && userData.profile.name.trim() !== '') {
          // User has a character, go to dashboard
          navigate('/dashboard');
        } else {
          // User exists but no character, go to character creation
          navigate('/character-creation');
        }
      } else {
        // No user data found, this is a new user - go to character creation
        navigate('/character-creation');
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      
      // Handle specific Firebase errors
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={styles.title}>Welcome Back, Hero!</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
              disabled={isLoading}
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.switchText}>
          Don't have an account?{' '}
          <button onClick={onSwitch} style={styles.switchButton}>
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins, sans-serif',
  },
  form: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: '30px',
  },
  inputGroup: {
    marginBottom: '20px',
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
  button: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #7b2ff2, #f357a8)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'Poppins, sans-serif',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
  },
  switchButton: {
    background: 'none',
    border: 'none',
    color: '#7b2ff2',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontFamily: 'Poppins, sans-serif',
  },
};
