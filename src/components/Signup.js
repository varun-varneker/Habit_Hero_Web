import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';

export default function SignupForm({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    setIsLoading(true);
    
    try {
      const userCredential = await signup(email, password);
      const user = { uid: userCredential.user.uid, email: userCredential.user.email };
      
      dispatch({ type: 'SET_USER', payload: user });
      navigate('/character-creation');
      
    } catch (error) {
      console.error('Signup failed:', error);
      
      // Handle specific Firebase errors
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please try logging in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
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
        <h2 style={styles.title}>Join the Adventure!</h2>
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
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p style={styles.switchText}>
          Already have an account?{' '}
          <button onClick={onSwitch} style={styles.switchButton}>
            Login here
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
