import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function AnalyticsPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const stats = useSelector(state => state.stats);
  const quests = useSelector(state => state.quests);
  const achievements = useSelector(state => state.achievements);
  const streaks = useSelector(state => state.streaks);
  const level = useSelector(state => state.level);
  const experience = useSelector(state => state.experience);

  // Calculate analytics data
  const dailyCompleted = quests.daily?.filter(q => q.completed).length || 0;
  const dailyTotal = quests.daily?.length || 0;
  const weeklyCompleted = quests.weekly?.filter(q => q.completed).length || 0;
  const totalCompleted = dailyCompleted + weeklyCompleted;

  const completionRate = dailyTotal > 0 ? ((dailyCompleted / dailyTotal) * 100).toFixed(1) : 0;
  const totalStats = Object.values(stats).reduce((sum, stat) => sum + stat, 0);
  const avgStat = totalStats / Object.keys(stats).length;

  // Streak analytics
  const totalStreaks = Object.keys(streaks).length;
  const activeStreaks = Object.values(streaks).filter(s => s.current > 0).length;
  const longestStreak = Math.max(...Object.values(streaks).map(s => s.longest || 0), 0);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'progress', name: 'Progress', icon: '📈' },
    { id: 'habits', name: 'Habits', icon: '🎯' },
  ];

  const renderOverview = () => (
    <div style={styles.tabContent}>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{level}</div>
          <div style={styles.statLabel}>Current Level</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{experience}</div>
          <div style={styles.statLabel}>Total XP</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{totalCompleted}</div>
          <div style={styles.statLabel}>Quests Done</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{achievements.length}</div>
          <div style={styles.statLabel}>Achievements</div>
        </div>
      </div>

      <div style={styles.progressSection}>
        <h4 style={styles.sectionTitle}>Today's Progress</h4>
        <div style={styles.progressBar}>
          <div style={styles.progressLabel}>
            Daily Quests: {dailyCompleted}/{dailyTotal}
          </div>
          <div style={styles.barContainer}>
            <div style={{ ...styles.bar, width: `${completionRate}%` }} />
          </div>
          <div style={styles.progressPercentage}>{completionRate}%</div>
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div style={styles.tabContent}>
      <div style={styles.chartSection}>
        <h4 style={styles.sectionTitle}>Stat Distribution</h4>
        <div style={styles.statBars}>
          {Object.entries(stats).map(([statName, value]) => {
            const percentage = totalStats > 0 ? (value / totalStats) * 100 : 0;
            return (
              <div key={statName} style={styles.statBarItem}>
                <div style={styles.statBarLabel}>
                  <span style={{ textTransform: 'capitalize' }}>{statName}</span>
                  <span>{value}</span>
                </div>
                <div style={styles.barContainer}>
                  <div style={{ 
                    ...styles.bar, 
                    width: `${percentage}%`,
                    background: getStatColor(statName)
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.progressSection}>
        <h4 style={styles.sectionTitle}>Performance Metrics</h4>
        <div style={styles.metricsGrid}>
          <div style={styles.metric}>
            <div style={styles.metricValue}>{avgStat.toFixed(1)}</div>
            <div style={styles.metricLabel}>Avg Stat</div>
          </div>
          <div style={styles.metric}>
            <div style={styles.metricValue}>{completionRate}%</div>
            <div style={styles.metricLabel}>Completion Rate</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHabits = () => (
    <div style={styles.tabContent}>
      <div style={styles.streakSection}>
        <h4 style={styles.sectionTitle}>Streak Analytics</h4>
        <div style={styles.streakStats}>
          <div style={styles.streakStat}>
            <div style={styles.streakValue}>{activeStreaks}</div>
            <div style={styles.streakLabel}>Active Streaks</div>
          </div>
          <div style={styles.streakStat}>
            <div style={styles.streakValue}>{longestStreak}</div>
            <div style={styles.streakLabel}>Longest Streak</div>
          </div>
          <div style={styles.streakStat}>
            <div style={styles.streakValue}>{totalStreaks}</div>
            <div style={styles.streakLabel}>Total Habits</div>
          </div>
        </div>
      </div>

      <div style={styles.habitsBreakdown}>
        <h4 style={styles.sectionTitle}>Habit Categories</h4>
        <div style={styles.categoryList}>
          {[
            { name: 'Health & Fitness', count: 3, color: '#4caf50' },
            { name: 'Learning', count: 2, color: '#2196f3' },
            { name: 'Productivity', count: 4, color: '#ff9800' },
            { name: 'Social', count: 1, color: '#e91e63' },
          ].map(category => (
            <div key={category.name} style={styles.categoryItem}>
              <div style={{ ...styles.categoryColor, background: category.color }} />
              <span style={styles.categoryName}>{category.name}</span>
              <span style={styles.categoryCount}>{category.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.panel}>
      <h3 style={styles.title}>📊 Analytics & Insights</h3>
      
      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={{
              ...styles.tab,
              background: activeTab === tab.id ? '#7b2ff2' : 'transparent',
              color: activeTab === tab.id ? '#fff' : '#b39ddb'
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={{ marginRight: 6 }}>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      <div style={styles.tabContainer}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'progress' && renderProgress()}
        {activeTab === 'habits' && renderHabits()}
      </div>
    </div>
  );
}

const getStatColor = (statName) => {
  const colors = {
    charisma: '#e040fb',
    intelligence: '#40c4ff',
    strength: '#ff7043',
    adaptability: '#ffd740',
    willpower: '#69f0ae',
  };
  return colors[statName] || '#7b2ff2';
};

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
    marginBottom: 16,
  },
  tabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: 12,
  },
  tab: {
    background: 'transparent',
    border: 'none',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s',
  },
  tabContainer: {
    minHeight: 200,
  },
  tabContent: {
    animation: 'fadeIn 0.3s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 700,
    color: '#7b2ff2',
  },
  statLabel: {
    fontSize: 10,
    color: '#b39ddb',
    marginTop: 4,
  },
  progressSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
  },
  progressBar: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: '#b39ddb',
    marginBottom: 8,
  },
  barContainer: {
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    height: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  bar: {
    height: '100%',
    background: 'linear-gradient(90deg, #7b2ff2, #f357a8)',
    borderRadius: 6,
    transition: 'width 0.3s ease',
  },
  progressPercentage: {
    fontSize: 12,
    color: '#7b2ff2',
    fontWeight: 600,
    textAlign: 'right',
  },
  chartSection: {
    marginBottom: 20,
  },
  statBars: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  statBarItem: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 6,
    padding: 8,
  },
  statBarLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    color: '#b39ddb',
    marginBottom: 4,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: 12,
  },
  metric: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 700,
    color: '#7b2ff2',
  },
  metricLabel: {
    fontSize: 10,
    color: '#b39ddb',
    marginTop: 4,
  },
  streakSection: {
    marginBottom: 20,
  },
  streakStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
  },
  streakStat: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    textAlign: 'center',
  },
  streakValue: {
    fontSize: 16,
    fontWeight: 700,
    color: '#ff6b35',
  },
  streakLabel: {
    fontSize: 10,
    color: '#b39ddb',
    marginTop: 4,
  },
  habitsBreakdown: {
    marginBottom: 20,
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 6,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: '50%',
  },
  categoryName: {
    flex: 1,
    fontSize: 12,
    color: '#fff',
  },
  categoryCount: {
    fontSize: 12,
    color: '#b39ddb',
    fontWeight: 600,
  },
};
