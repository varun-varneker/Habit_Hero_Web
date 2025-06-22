import React from 'react';
import { useSelector } from 'react-redux';

export default function AnalyticsPanel() {
  const stats = useSelector(state => state.stats);
  const quests = useSelector(state => state.quests);
  const achievements = useSelector(state => state.achievements);

  // Example: Calculate completed quests
  const dailyCompleted = quests.daily.filter(q => q.completed).length;
  const weeklyCompleted = quests.weekly.filter(q => q.completed).length;
  const totalCompleted = dailyCompleted + weeklyCompleted;

  // Example: Calculate stat progress (could be expanded with more logic)
  const statEntries = Object.entries(stats);

  return (
    <div style={styles.panel}>
      <h3 style={styles.title}>Analytics & Insights</h3>
      <div style={styles.section}>
        <strong style={styles.label}>Total Quests Completed:</strong> {totalCompleted}
      </div>
      <div style={styles.section}>
        <strong style={styles.label}>Daily Quests Completed:</strong> {dailyCompleted}
      </div>
      <div style={styles.section}>
        <strong style={styles.label}>Weekly Challenges Completed:</strong> {weeklyCompleted}
      </div>
      <div style={{ marginTop: 18 }}>
        <strong style={styles.label}>Stat Progress:</strong>
        <ul style={styles.list}>
          {statEntries.map(([key, value]) => (
            <li key={key} style={styles.statItem}>
              <span style={{ textTransform: 'capitalize' }}>{key}:</span> <span style={{ fontWeight: 700 }}>{value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: 18 }}>
        <strong style={styles.label}>Achievements Unlocked:</strong> {achievements.length}
      </div>
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
    color: '#fff',
  },
  title: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 8,
  },
  section: {
    marginBottom: 8,
    fontSize: 15,
  },
  label: {
    color: '#f3e9ff',
    fontWeight: 600,
    marginRight: 6,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  statItem: {
    marginBottom: 4,
  },
};
