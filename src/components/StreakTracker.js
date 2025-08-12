import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function StreakTracker() {
  const loginStreak = useSelector(state => state.loginStreak);
  const achievements = useSelector(state => state.achievements);

  const { current, milestoneDays } = loginStreak || { current: 0, milestoneDays: 3 };
  const progress = Math.min(100, Math.round((current / (milestoneDays || 1)) * 100));

  const currentMilestoneLabel = useMemo(() => {
    if (!loginStreak) return '3-day streak';
    return `${milestoneDays}-day streak`;
  }, [loginStreak, milestoneDays]);

  return (
    <div style={styles.panel}>
      <h3 style={styles.title}>🔥 Login Streak</h3>

      <div style={styles.progressWrap}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <div style={styles.progressMeta}>
          <span style={styles.progressText}>{current}/{milestoneDays} days</span>
          <span style={styles.milestoneText}>Next goal: {currentMilestoneLabel}</span>
        </div>
      </div>

      <div style={styles.helperRow}>
        <span>Tip: Login daily to grow your streak. Missing a day resets progress.</span>
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
  },
  title: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  progressWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  progressBar: {
    background: 'rgba(255,255,255,0.25)',
    height: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    background: 'linear-gradient(90deg, #7b2ff2, #f357a8)',
    height: '100%',
    borderRadius: 8,
    transition: 'width 0.4s ease',
  },
  progressMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#e6dcff',
    fontSize: 12,
  },
  progressText: {
    fontWeight: 700,
  },
  milestoneText: {
    opacity: 0.9,
  },
  helperRow: {
    marginTop: 10,
    color: '#cdbcf9',
    fontSize: 12,
  },
};
