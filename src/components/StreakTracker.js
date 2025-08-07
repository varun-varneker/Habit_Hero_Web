import React from 'react';

export default function StreakTracker({ streaks = {} }) {
  const getStreakIcon = (streakCount) => {
    if (streakCount >= 100) return '🔥';
    if (streakCount >= 50) return '💎';
    if (streakCount >= 30) return '⭐';
    if (streakCount >= 14) return '🎯';
    if (streakCount >= 7) return '✨';
    if (streakCount >= 3) return '🌟';
    return '💪';
  };

  const getStreakColor = (streakCount) => {
    if (streakCount >= 100) return '#ff4444';
    if (streakCount >= 50) return '#44ff44';
    if (streakCount >= 30) return '#4444ff';
    if (streakCount >= 14) return '#ff44ff';
    if (streakCount >= 7) return '#ffff44';
    if (streakCount >= 3) return '#ff8844';
    return '#888';
  };

  const getStreakTitle = (streakCount) => {
    if (streakCount >= 100) return 'Legendary Master';
    if (streakCount >= 50) return 'Diamond Champion';
    if (streakCount >= 30) return 'Star Achiever';
    if (streakCount >= 14) return 'Goal Crusher';
    if (streakCount >= 7) return 'Week Warrior';
    if (streakCount >= 3) return 'Rising Star';
    return 'Getting Started';
  };

  const formatLastCompleted = (date) => {
    if (!date) return 'Never';
    const today = new Date().toDateString();
    const lastDate = new Date(date).toDateString();
    if (today === lastDate) return 'Today';
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.toDateString() === lastDate) return 'Yesterday';
    
    return new Date(date).toLocaleDateString();
  };

  const streakEntries = Object.entries(streaks).filter(([_, data]) => data.current > 0);

  if (streakEntries.length === 0) {
    return (
      <div style={styles.panel}>
        <h3 style={styles.title}>🔥 Habit Streaks</h3>
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Complete habits daily to build streaks!</p>
          <p style={styles.emptySubtext}>Streaks help you build lasting habits and unlock rewards</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.panel}>
      <h3 style={styles.title}>🔥 Habit Streaks</h3>
      <div style={styles.streakList}>
        {streakEntries.map(([habitName, streakData]) => (
          <div key={habitName} style={styles.streakItem}>
            <div style={styles.streakHeader}>
              <span 
                style={{
                  ...styles.streakIcon,
                  color: getStreakColor(streakData.current)
                }}
              >
                {getStreakIcon(streakData.current)}
              </span>
              <div style={styles.streakInfo}>
                <h4 style={styles.habitName}>{habitName}</h4>
                <p style={styles.streakTitle}>{getStreakTitle(streakData.current)}</p>
              </div>
              <div style={styles.streakCount}>
                <span style={styles.currentStreak}>{streakData.current}</span>
                <span style={styles.streakLabel}>days</span>
              </div>
            </div>
            
            <div style={styles.streakDetails}>
              <div style={styles.streakStat}>
                <span style={styles.statLabel}>Best:</span>
                <span style={styles.statValue}>{streakData.longest || streakData.current}</span>
              </div>
              <div style={styles.streakStat}>
                <span style={styles.statLabel}>Last:</span>
                <span style={styles.statValue}>{formatLastCompleted(streakData.lastCompleted)}</span>
              </div>
            </div>

            {/* Progress bar for next milestone */}
            <div style={styles.milestoneProgress}>
              {renderMilestoneProgress(streakData.current)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const renderMilestoneProgress = (currentStreak) => {
  const milestones = [3, 7, 14, 30, 50, 100];
  const nextMilestone = milestones.find(m => m > currentStreak);
  
  if (!nextMilestone) {
    return (
      <div style={styles.milestoneComplete}>
        <span>🏆 All milestones completed!</span>
      </div>
    );
  }

  const progress = (currentStreak / nextMilestone) * 100;
  const daysToGo = nextMilestone - currentStreak;

  return (
    <div style={styles.milestone}>
      <div style={styles.milestoneBar}>
        <div 
          style={{
            ...styles.milestoneProgress,
            width: `${progress}%`
          }}
        />
      </div>
      <span style={styles.milestoneText}>
        {daysToGo} days to {nextMilestone}-day milestone
      </span>
    </div>
  );
};

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
  emptyState: {
    textAlign: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#fff',
    margin: 0,
    fontSize: 16,
  },
  emptySubtext: {
    color: '#b39ddb',
    margin: '8px 0 0 0',
    fontSize: 14,
  },
  streakList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  streakItem: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    border: '1px solid rgba(255,255,255,0.1)',
  },
  streakHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  streakIcon: {
    fontSize: 32,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
  },
  streakInfo: {
    flex: 1,
  },
  habitName: {
    color: '#fff',
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
  },
  streakTitle: {
    color: '#b39ddb',
    margin: '2px 0 0 0',
    fontSize: 12,
    fontWeight: 500,
  },
  streakCount: {
    textAlign: 'center',
  },
  currentStreak: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 700,
    display: 'block',
  },
  streakLabel: {
    color: '#b39ddb',
    fontSize: 12,
  },
  streakDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  streakStat: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    color: '#b39ddb',
    fontSize: 12,
  },
  statValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
  },
  milestone: {
    marginTop: 12,
  },
  milestoneBar: {
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    height: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  milestoneProgress: {
    background: 'linear-gradient(90deg, #7b2ff2, #f357a8)',
    height: '100%',
    borderRadius: 6,
    transition: 'width 0.3s ease',
  },
  milestoneText: {
    color: '#b39ddb',
    fontSize: 10,
    fontWeight: 500,
  },
  milestoneComplete: {
    textAlign: 'center',
    color: '#ffd700',
    fontSize: 14,
    fontWeight: 600,
  },
};
