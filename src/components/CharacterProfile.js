import React from 'react';

export default function CharacterProfile({ user, onEdit }) {
  return (
    <div style={styles.card}>
      <img src="https://img.icons8.com/color/96/000000/person-male.png" alt="Avatar" style={styles.avatar} />
      <h2 style={styles.name}>{user?.name || 'Your Hero Name'}</h2>
      <p style={styles.bio}>{user?.bio || 'Write your mission or backstory here.'}</p>
      <button style={styles.editBtn} onClick={onEdit}>Edit Profile</button>
    </div>
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
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    marginBottom: 12,
    border: '3px solid #7b2ff2',
  },
  name: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 22,
    margin: 0,
  },
  bio: {
    color: '#f3e9ff',
    fontSize: 15,
    margin: '8px 0 16px 0',
  },
  editBtn: {
    background: '#7b2ff2',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 20px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
