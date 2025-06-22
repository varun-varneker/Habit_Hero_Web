import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CharacterProfile from './CharacterProfile';
import StatsPanel from './StatsPanel';
import QuestBoard from './QuestBoard';
import RewardsPanel from './RewardsPanel';
import AnalyticsPanel from './AnalyticsPanel';
import { loadUserData, saveUserData } from '../api/userData';

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const profile = useSelector(state => state.profile);
  const stats = useSelector(state => state.stats);
  const quests = useSelector(state => state.quests);
  const achievements = useSelector(state => state.achievements);

  // Load user data from Firestore on mount
  useEffect(() => {
    if (user?.uid) {
      loadUserData(user.uid).then(data => {
        if (data) {
          if (data.profile) dispatch({ type: 'UPDATE_PROFILE', payload: data.profile });
          if (data.stats) dispatch({ type: 'UPDATE_STATS', payload: data.stats });
          if (data.quests) dispatch({ type: 'SET_QUESTS', payload: data.quests });
          if (data.achievements) data.achievements.forEach(a => dispatch({ type: 'ADD_ACHIEVEMENT', payload: a }));
        }
      });
    }
    // eslint-disable-next-line
  }, [user?.uid]);

  // Save user data to Firestore whenever it changes
  useEffect(() => {
    if (user?.uid) {
      saveUserData(user.uid, { profile, stats, quests, achievements });
    }
  }, [user?.uid, profile, stats, quests, achievements]);

  // Handlers for quests
  const handleAddQuest = (type, text) => {
    const updated = [...quests[type], { text, completed: false }];
    dispatch({ type: 'UPDATE_QUEST', questType: type, quests: updated });
  };
  const handleToggleQuest = (type, idx) => {
    const updated = quests[type].map((q, i) => i === idx ? { ...q, completed: !q.completed } : q);
    dispatch({ type: 'UPDATE_QUEST', questType: type, quests: updated });
    // Example: add XP to a stat and achievement on complete
    if (!quests[type][idx].completed) {
      dispatch({ type: 'UPDATE_STATS', payload: { willpower: stats.willpower + 5 } });
      dispatch({ type: 'ADD_ACHIEVEMENT', payload: `Completed: ${quests[type][idx].text}` });
    }
  };
  // Handler for editing profile (placeholder)
  const handleEditProfile = () => {
    const name = prompt('Enter your hero name:', profile.name);
    const bio = prompt('Enter your mission/bio:', profile.bio);
    dispatch({ type: 'UPDATE_PROFILE', payload: { name, bio } });
  };

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <div style={styles.left}>
          <CharacterProfile user={profile} onEdit={handleEditProfile} />
          <StatsPanel statValues={stats} />
        </div>
        <div style={styles.right}>
          <QuestBoard
            dailyQuests={quests.daily}
            weeklyQuests={quests.weekly}
            onAddQuest={handleAddQuest}
            onToggleQuest={handleToggleQuest}
          />
          <RewardsPanel achievements={achievements} />
          <AnalyticsPanel />
        </div>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)',
    padding: '40px 0',
    fontFamily: 'Poppins, Arial, sans-serif',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 40,
    maxWidth: 1100,
    margin: '0 auto',
    flexWrap: 'wrap',
  },
  left: {
    flex: 1,
    minWidth: 340,
    maxWidth: 400,
  },
  right: {
    flex: 2,
    minWidth: 340,
    maxWidth: 600,
  },
};
