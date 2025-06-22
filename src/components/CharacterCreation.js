import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveUserData } from '../api/userData';

export default function CharacterCreation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('default');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Save to Firestore and Redux
      await saveUserData(user.uid, { name, bio, avatar });
      dispatch({ type: 'UPDATE_PROFILE', payload: { name, bio, avatar } });
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save character.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Your Hero</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Name
          <input style={styles.input} value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label style={styles.label}>Bio
          <textarea style={styles.input} value={bio} onChange={e => setBio(e.target.value)} />
        </label>
        <label style={styles.label}>Avatar
          <select style={styles.input} value={avatar} onChange={e => setAvatar(e.target.value)}>
            <option value="default">Default</option>
            <option value="warrior">Warrior</option>
            <option value="mage">Mage</option>
            <option value="rogue">Rogue</option>
          </select>
        </label>
        {error && <div style={styles.error}>{error}</div>}
        <button style={styles.button} type="submit" disabled={loading}>{loading ? 'Saving...' : 'Start Adventure'}</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: '40px auto',
    background: 'rgba(123,47,242,0.15)',
    borderRadius: 16,
    padding: 32,
    boxShadow: '0 2px 8px #7b2ff2aa',
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 24,
    color: '#fff',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  label: {
    fontWeight: 600,
    color: '#f3e9ff',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    padding: 8,
    borderRadius: 8,
    border: 'none',
    marginTop: 4,
    marginBottom: 8,
    fontSize: 16,
  },
  button: {
    background: 'linear-gradient(90deg,#7b2ff2,#f357a8)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 0',
    fontWeight: 700,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 12,
  },
  error: {
    color: '#ffb3b3',
    marginBottom: 8,
    textAlign: 'center',
  },
};
