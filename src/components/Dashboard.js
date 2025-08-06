import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CharacterProfile from './CharacterProfile';
import StatsPanel from './StatsPanel';
import QuestBoard from './QuestBoard';
import RewardsPanel from './RewardsPanel';
import AnalyticsPanel from './AnalyticsPanel';
import Dock from '../ui/Dock';
import { VscHome, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import { VscChecklist as VscQuests } from 'react-icons/vsc'; // Use Checklist for Quests
import { loadUserData, saveUserData } from '../api/userData';
import InventoryPanel from './InventoryPanel';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const profile = useSelector(state => state.profile);
  const stats = useSelector(state => state.stats);
  const quests = useSelector(state => state.quests);
  const achievements = useSelector(state => state.achievements);
  const inventory = useSelector(state => state.inventory);

  // Load user data from Firestore on mount
  useEffect(() => {
    if (user?.uid) {
      loadUserData(user.uid).then(data => {
        if (data) {
          if (data.profile) dispatch({ type: 'UPDATE_PROFILE', payload: data.profile });
          if (data.stats) dispatch({ type: 'UPDATE_STATS', payload: data.stats });
          if (data.quests) dispatch({ type: 'SET_QUESTS', payload: data.quests });
          if (data.achievements) {
            // Clear achievements before adding to avoid duplicates
            dispatch({ type: 'SET_ACHIEVEMENTS', payload: [] });
            data.achievements.forEach(a => dispatch({ type: 'ADD_ACHIEVEMENT', payload: a }));
          }
          if (data.inventory) dispatch({ type: 'SET_INVENTORY', payload: data.inventory });
        }
      });
    }
  }, [user, dispatch]);

  // Save user data to Firestore whenever it changes
  useEffect(() => {
    if (user?.uid) {
      saveUserData(user.uid, { profile, stats, quests, achievements, inventory });
    }
  }, [user?.uid, profile, stats, quests, achievements, inventory]);

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

  const items = [
    { icon: <VscHome size={18} />, label: 'Home', onClick: () => navigate('/') },
    { icon: <VscQuests size={18} />, label: 'Quests', onClick: () => navigate('/quests') },
    { icon: <VscAccount size={18} />, label: 'Profile', onClick: () => navigate('/profile') },
    { icon: <VscSettingsGear size={18} />, label: 'Settings', onClick: () => navigate('/settings') },
  ];

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <div style={styles.left}>
          <CharacterProfile user={profile} onEdit={handleEditProfile} />
          <StatsPanel statValues={stats} />
          <InventoryPanel inventory={inventory} />
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
      <Dock 
        items={items}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
      />
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
