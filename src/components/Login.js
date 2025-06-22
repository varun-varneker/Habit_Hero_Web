import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../api/auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    try {
      const userCredential = await login({ email, password });
      if (userCredential && userCredential.user) {
        dispatch({ type: 'LOGIN', payload: { email: userCredential.user.email, uid: userCredential.user.uid } });
        setError('');
      } else {
        setError('Login failed.');
      }
    } catch (err) {
      setError('Invalid credentials or network error');
    }
  };

  return (
    <form onSubmit={handleLogin} style={styles.container}>
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
        autoComplete="current-password"
        required
      />
      {error && <div style={styles.error}>{error}</div>}
      <button type="submit" style={styles.button}>Login</button>
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
    background: '#1976d2',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
  },
};
