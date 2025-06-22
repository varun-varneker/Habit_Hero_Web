import React from 'react';

const stats = [
  { key: 'charisma', label: 'Charisma', color: '#e040fb' },
  { key: 'intelligence', label: 'Intelligence', color: '#40c4ff' },
  { key: 'strength', label: 'Strength', color: '#ff7043' },
  { key: 'adaptability', label: 'Adaptability', color: '#ffd740' },
  { key: 'willpower', label: 'Willpower', color: '#69f0ae' },
];

export default function StatsPanel({ statValues }) {
  return (
    <div style={styles.panel}>
      {stats.map(stat => (
        <div key={stat.key} style={styles.statRow}>
          <span style={{ ...styles.label, color: stat.color }}>{stat.label}</span>
          <div style={styles.barBg}>
            <div style={{ ...styles.bar, width: `${statValues?.[stat.key] || 0}%`, background: stat.color }} />
          </div>
          <span style={styles.value}>{statValues?.[stat.key] || 0}</span>
        </div>
      ))}
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
  statRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    minWidth: 110,
    fontWeight: 600,
    fontSize: 15,
  },
  barBg: {
    flex: 1,
    height: 12,
    background: '#eee',
    borderRadius: 8,
    margin: '0 12px',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 8,
    transition: 'width 0.4s',
  },
  value: {
    minWidth: 32,
    textAlign: 'right',
    color: '#fff',
    fontWeight: 700,
  },
};
