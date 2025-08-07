import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CharacterProfile from './CharacterProfile';
import StatsPanel from './StatsPanel';
import QuestBoard from './QuestBoard';
import RewardsPanel from './RewardsPanel';
import AnalyticsPanel from './AnalyticsPanel';
import StreakTracker from './StreakTracker';
import FriendsPanel from './FriendsPanel';
import Dock from '../ui/Dock';
import { VscHome, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import { VscChecklist as VscQuests } from 'react-icons/vsc'; // Use Checklist for Quests
import { loadUserData, saveUserData } from '../api/userData';
import InventoryPanel from './InventoryPanel';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  
  const user = useSelector(state => state.user);
  const profile = useSelector(state => state.profile);
  const stats = useSelector(state => state.stats);
  const quests = useSelector(state => state.quests);
  const achievements = useSelector(state => state.achievements);
  const inventory = useSelector(state => state.inventory);
  const streaks = useSelector(state => state.streaks);
  const friends = useSelector(state => state.friends);
  const friendRequests = useSelector(state => state.friendRequests);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          if (data.streaks) dispatch({ type: 'SET_STREAKS', payload: data.streaks });
          if (data.friends) dispatch({ type: 'SET_FRIENDS', payload: data.friends });
          if (data.friendRequests) dispatch({ type: 'SET_FRIEND_REQUESTS', payload: data.friendRequests });
        }
      });
    }
  }, [user, dispatch]);

  // Save user data to Firestore whenever it changes
  useEffect(() => {
    if (user?.uid) {
      saveUserData(user.uid, { profile, stats, quests, achievements, inventory, streaks, friends, friendRequests });
    }
  }, [user?.uid, profile, stats, quests, achievements, inventory, streaks, friends, friendRequests]);

  // Handlers for quests
  const handleAddQuest = (type, text, stat = 'willpower') => {
    if (!quests || !quests[type]) return;
    const updated = [...quests[type], { text, completed: false, stat }];
    dispatch({ type: 'UPDATE_QUEST', questType: type, quests: updated });
  };
  
  const handleToggleQuest = (type, idx) => {
    if (!quests || !quests[type] || !quests[type][idx]) return;
    const quest = quests[type][idx];
    const updated = quests[type].map((q, i) => i === idx ? { ...q, completed: !q.completed } : q);
    dispatch({ type: 'UPDATE_QUEST', questType: type, quests: updated });
    
    // Update streak when quest is completed
    if (!quest.completed) {
      dispatch({ type: 'UPDATE_STREAK', payload: { habitName: quest.text, completed: true } });
      // Add XP based on quest stat
      const statToUpdate = quest.stat || 'willpower';
      dispatch({ type: 'UPDATE_STATS', payload: { [statToUpdate]: (stats?.[statToUpdate] || 0) + 5 } });
      dispatch({ type: 'ADD_ACHIEVEMENT', payload: `Completed: ${quest.text}` });
    }
  };
  // Handler for editing profile (placeholder)
  const handleEditProfile = () => {
    const name = prompt('Enter your hero name:', profile?.name || '');
    const bio = prompt('Enter your mission/bio:', profile?.bio || '');
    if (name !== null && bio !== null) {
      dispatch({ type: 'UPDATE_PROFILE', payload: { name, bio } });
    }
  };

  const items = [
    { icon: <VscHome size={18} />, label: 'Home', onClick: () => navigate('/') },
    { icon: <VscQuests size={18} />, label: 'Quests', onClick: () => navigate('/quests') },
    { icon: <VscAccount size={18} />, label: 'Profile', onClick: () => navigate('/profile') },
    { icon: <VscSettingsGear size={18} />, label: 'Settings', onClick: () => navigate('/settings') },
  ];

  return (
    <div style={styles.bg}>
      <div style={{
        ...styles.container,
        flexDirection: isMobile ? 'column' : 'row',
      }}>
        <div style={{
          ...styles.left,
          flex: isMobile ? 'none' : 1,
          width: isMobile ? '100%' : 'auto',
          maxWidth: isMobile ? 400 : 400,
        }}>
          <CharacterProfile user={profile} onEdit={handleEditProfile} />
          <StatsPanel statValues={stats} />
          <FriendsPanel />
          <InventoryPanel inventory={inventory} />
        </div>
        <div style={{
          ...styles.right,
          flex: isMobile ? 'none' : 2,
          width: isMobile ? '100%' : 'auto',
          maxWidth: isMobile ? 400 : 600,
        }}>
          <QuestBoard
            dailyQuests={quests?.daily || []}
            weeklyQuests={quests?.weekly || []}
            onAddQuest={handleAddQuest}
            onToggleQuest={handleToggleQuest}
          />
          <StreakTracker streaks={streaks || {}} />
          <RewardsPanel achievements={achievements || []} />
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
    padding: '20px 10px 100px 10px', // Extra bottom padding for dock
    fontFamily: 'Poppins, Arial, sans-serif',
    boxSizing: 'border-box',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 20,
    maxWidth: 1200,
    margin: '0 auto',
  },
  left: {
    minWidth: 320,
  },
  right: {
    minWidth: 320,
  },
};
