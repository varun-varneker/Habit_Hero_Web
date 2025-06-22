import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signup } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    try {
      const userCredential = await signup({ email, password });
      if (userCredential && userCredential.user) {
        dispatch({ type: 'LOGIN', payload: { email: userCredential.user.email, uid: userCredential.user.uid } });
        setError('');
        navigate('/character-creation');
      } else {
        setError('Signup failed.');
      }
    } catch (err) {
      // Show the actual Firebase error message if available
      if (err && err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('Email is already in use.');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address.');
            break;
          case 'auth/weak-password':
            setError('Password should be at least 6 characters.');
            break;
          default:
            setError(err.message || 'Signup failed.');
        }
      } else {
        setError('Signup failed.');
      }
    }
  };

  return (
    <form onSubmit={handleSignup} style={styles.container}>
      <input
        style={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoComplete="username"
        required
      />
      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        autoComplete="new-password"
        required
      />
      {error && <div style={styles.error}>{error}</div>}
      <button type="submit" style={styles.button}>Sign Up</button>
    </form>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
    maxWidth: '320px',
    margin: '0 auto',
    padding: '24px',
    border: '1px solid #eee',
    borderRadius: '8px',
    background: '#fafafa',
  },
  input: {
    border: '1px solid #ccc',
    borderRadius: '6px',
    padding: '8px',
    backgroundColor: '#fff',
    marginBottom: '8px',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    marginBottom: '8px',
    fontSize: '14px',
  },
  button: {
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    background: '#388e3c',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
  },
};
