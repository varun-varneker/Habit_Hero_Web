import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AchievementsPage() {
  const navigate = useNavigate();
  const achievements = useSelector(state => state.achievements);
  const level = useSelector(state => state.level);
  const experience = useSelector(state => state.experience);
  const stats = useSelector(state => state.stats);
  const profile = useSelector(state => state.profile);

  // Calculate total achievements by category
  const getCategorizedAchievements = () => {
    const categorized = {
      level: [],
      quest: [],
      streak: [],
      stat: [],
      special: []
    };

    if (achievements && achievements.length > 0) {
      achievements.forEach(achievement => {
        if (achievement.includes('Level Up')) {
          categorized.level.push(achievement);
        } else if (achievement.includes('Quest') || achievement.includes('quest')) {
          categorized.quest.push(achievement);
        } else if (achievement.includes('streak') || achievement.includes('Streak')) {
          categorized.streak.push(achievement);
        } else if (achievement.includes('stat') || achievement.includes('Stat')) {
          categorized.stat.push(achievement);
        } else {
          categorized.special.push(achievement);
        }
      });
    }

    return categorized;
  };

  const categorizedAchievements = getCategorizedAchievements();
  const totalAchievements = achievements ? achievements.length : 0;

  // Achievement milestones
  const achievementMilestones = [
    { count: 1, title: "First Steps", icon: "🥉", unlocked: totalAchievements >= 1 },
    { count: 5, title: "Getting Started", icon: "🥈", unlocked: totalAchievements >= 5 },
    { count: 10, title: "Achievement Hunter", icon: "🥇", unlocked: totalAchievements >= 10 },
    { count: 25, title: "Dedicated Hero", icon: "🏆", unlocked: totalAchievements >= 25 },
    { count: 50, title: "Achievement Master", icon: "👑", unlocked: totalAchievements >= 50 },
  ];

  const renderAchievementCategory = (categoryName, categoryAchievements, icon) => {
    if (categoryAchievements.length === 0) return null;

    return (
      <div style={styles.categoryCard} key={categoryName}>
        <h3 style={styles.categoryTitle}>
          <span style={styles.categoryIcon}>{icon}</span>
          {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Achievements
          <span style={styles.categoryCount}>({categoryAchievements.length})</span>
        </h3>
        <div style={styles.achievementsList}>
          {categoryAchievements.map((achievement, index) => (
            <div key={index} style={styles.achievementItem}>
              <span style={styles.achievementIcon}>🏆</span>
              <span style={styles.achievementText}>{achievement}</span>
              <span style={styles.achievementDate}>
                {new Date().toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <div style={styles.backButtonContainer}>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={styles.backButton}
        >
          <span style={styles.backIcon}>←</span>
          <span>Back to Dashboard</span>
        </button>
      </div>

      <h1 style={styles.title}>🏆 Achievements</h1>

      {/* Achievement Overview */}
      <div style={styles.overviewCard}>
        <div style={styles.overviewHeader}>
          <h2 style={styles.overviewTitle}>Your Hero's Journey</h2>
          <div style={styles.totalCount}>
            <span style={styles.totalNumber}>{totalAchievements}</span>
            <span style={styles.totalLabel}>Total Achievements</span>
          </div>
        </div>
        
        <div style={styles.statsOverview}>
          <div style={styles.statOverviewItem}>
            <span style={styles.statOverviewIcon}>⭐</span>
            <span style={styles.statOverviewLabel}>Level</span>
            <span style={styles.statOverviewValue}>{level}</span>
          </div>
          <div style={styles.statOverviewItem}>
            <span style={styles.statOverviewIcon}>💪</span>
            <span style={styles.statOverviewLabel}>Strength</span>
            <span style={styles.statOverviewValue}>{stats.strength || 0}</span>
          </div>
          <div style={styles.statOverviewItem}>
            <span style={styles.statOverviewIcon}>🧠</span>
            <span style={styles.statOverviewLabel}>Intelligence</span>
            <span style={styles.statOverviewValue}>{stats.intelligence || 0}</span>
          </div>
          <div style={styles.statOverviewItem}>
            <span style={styles.statOverviewIcon}>✨</span>
            <span style={styles.statOverviewLabel}>Charisma</span>
            <span style={styles.statOverviewValue}>{stats.charisma || 0}</span>
          </div>
        </div>
      </div>

      {/* Achievement Milestones */}
      <div style={styles.milestonesCard}>
        <h3 style={styles.sectionTitle}>🎯 Achievement Milestones</h3>
        <div style={styles.milestonesList}>
          {achievementMilestones.map((milestone, index) => (
            <div 
              key={index} 
              style={{
                ...styles.milestoneItem,
                opacity: milestone.unlocked ? 1 : 0.5,
                background: milestone.unlocked 
                  ? 'linear-gradient(135deg, #ffd700, #ffed4e)' 
                  : 'linear-gradient(135deg, #f0f0f0, #e0e0e0)'
              }}
            >
              <span style={styles.milestoneIcon}>{milestone.icon}</span>
              <div style={styles.milestoneInfo}>
                <span style={styles.milestoneTitle}>{milestone.title}</span>
                <span style={styles.milestoneCount}>{milestone.count} achievements</span>
              </div>
              <span style={styles.milestoneStatus}>
                {milestone.unlocked ? '✅' : '🔒'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Categories */}
      <div style={styles.categoriesContainer}>
        {renderAchievementCategory('level', categorizedAchievements.level, '⭐')}
        {renderAchievementCategory('quest', categorizedAchievements.quest, '⚔️')}
        {renderAchievementCategory('streak', categorizedAchievements.streak, '🔥')}
        {renderAchievementCategory('stat', categorizedAchievements.stat, '📈')}
        {renderAchievementCategory('special', categorizedAchievements.special, '🌟')}
      </div>

      {/* No Achievements Message */}
      {totalAchievements === 0 && (
        <div style={styles.noAchievementsCard}>
          <div style={styles.noAchievementsIcon}>🎯</div>
          <h3 style={styles.noAchievementsTitle}>Start Your Journey!</h3>
          <p style={styles.noAchievementsText}>
            Complete quests, level up, and build streaks to earn your first achievements!
          </p>
          <button 
            onClick={() => navigate('/quests')} 
            style={styles.startQuestsButton}
          >
            View Quests
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: 'Poppins, sans-serif',
    paddingBottom: '120px',
  },
  backButtonContainer: {
    marginBottom: '20px',
    position: 'sticky',
    top: '20px',
    zIndex: 100,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'Poppins, sans-serif',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
  },
  backIcon: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '30px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  overviewCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  overviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  overviewTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  totalCount: {
    textAlign: 'center',
  },
  totalNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#667eea',
    display: 'block',
  },
  totalLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: 'bold',
  },
  statsOverview: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '15px',
  },
  statOverviewItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px',
    background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
    borderRadius: '10px',
    border: '1px solid #dee2e6',
  },
  statOverviewIcon: {
    fontSize: '1.5rem',
    marginBottom: '5px',
  },
  statOverviewLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  statOverviewValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#667eea',
  },
  milestonesCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    borderBottom: '2px solid #667eea',
    paddingBottom: '10px',
  },
  milestonesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  milestoneItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid #dee2e6',
    transition: 'all 0.3s ease',
  },
  milestoneIcon: {
    fontSize: '1.5rem',
  },
  milestoneInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  milestoneTitle: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '1rem',
  },
  milestoneCount: {
    fontSize: '0.8rem',
    color: '#666',
  },
  milestoneStatus: {
    fontSize: '1.2rem',
  },
  categoriesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  categoryCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  categoryTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  categoryIcon: {
    fontSize: '1.5rem',
  },
  categoryCount: {
    fontSize: '0.9rem',
    color: '#667eea',
    fontWeight: 'normal',
  },
  achievementsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  achievementItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '12px',
    background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
    borderRadius: '8px',
    border: '1px solid #ffeaa7',
  },
  achievementIcon: {
    fontSize: '1.2rem',
  },
  achievementText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
    fontSize: '0.95rem',
  },
  achievementDate: {
    fontSize: '0.8rem',
    color: '#666',
    fontStyle: 'italic',
  },
  noAchievementsCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    padding: '50px 30px',
    textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  noAchievementsIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  noAchievementsTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  noAchievementsText: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '25px',
    lineHeight: '1.5',
  },
  startQuestsButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'Poppins, sans-serif',
  },
};