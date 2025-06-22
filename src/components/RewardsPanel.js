import React from 'react';

export default function RewardsPanel({ achievements = [] }) {
  return (
    <div style={styles.panel}>
      <h3 style={styles.title}>Achievements & Rewards</h3>
      <ul style={styles.list}>
        {achievements.length === 0 && <li style={styles.empty}>No achievements yet. Complete quests to earn rewards!</li>}
        {achievements.map((a, i) => (
          <li key={i} style={styles.achievement}>
            <span role="img" aria-label="medal" style={{ marginRight: 8 }}>🏅</span>
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  panel: {
    background: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0 2px 8px #7b2ff2aa',
  },
  title: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 8,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  achievement: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 6,
    display: 'flex',
    alignItems: 'center',
  },
  empty: {
    color: '#f3e9ff',
    fontStyle: 'italic',
  },
};
