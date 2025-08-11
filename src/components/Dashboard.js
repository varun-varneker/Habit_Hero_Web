import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardCharacterProfile from './DashboardCharacterProfile';
import StatsPanel from './StatsPanel';
import QuestBoard from './QuestBoard';
import AnalyticsPanel from './AnalyticsPanel';
import InventoryPanel from './InventoryPanel';
import RewardsPanel from './RewardsPanel';
import FriendsPanel from './FriendsPanel';
import StreakTracker from './StreakTracker';
import Dock from '../ui/Dock';
import { loadUserData, saveUserData } from '../api/userData';

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
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load user data from Firestore on mount
  useEffect(() => {
    if (user?.uid) {
      const loadData = async () => {
        try {
          const userData = await loadUserData(user.uid);
          if (userData) {
            if (userData.profile) dispatch({ type: 'UPDATE_PROFILE', payload: userData.profile });
            if (userData.stats) dispatch({ type: 'UPDATE_STATS', payload: userData.stats });
            if (userData.quests) dispatch({ type: 'SET_QUESTS', payload: userData.quests });
            if (userData.achievements) dispatch({ type: 'SET_ACHIEVEMENTS', payload: userData.achievements });
            if (userData.inventory) dispatch({ type: 'SET_INVENTORY', payload: userData.inventory });
            if (userData.streaks) dispatch({ type: 'SET_STREAKS', payload: userData.streaks });
            if (userData.friends) dispatch({ type: 'SET_FRIENDS', payload: userData.friends });
            if (userData.friendRequests) dispatch({ type: 'SET_FRIEND_REQUESTS', payload: userData.friendRequests });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      };
      
      loadData();
    }
  }, [user, dispatch]);

  // Save user data to Firestore whenever it changes
  useEffect(() => {
    if (user?.uid && profile?.name) {
      const saveData = async () => {
        try {
          await saveUserData(user.uid, {
            profile,
            stats,
            quests,
            achievements,
            inventory,
            streaks,
            friends,
            friendRequests,
            lastUpdated: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error saving user data:', error);
        }
      };
      
      saveData();
    }
  }, [user?.uid, profile, stats, quests, achievements, inventory, streaks, friends, friendRequests]);

  // Handlers for quests
  const handleAddQuest = (type, text, stat = 'willpower') => {
    const newQuest = { text, stat, completed: false, id: Date.now() };
    const updatedQuests = { ...quests, [type]: [...(quests[type] || []), newQuest] };
    dispatch({ type: 'SET_QUESTS', payload: updatedQuests });
  };
  
  const handleToggleQuest = (type, idx) => {
    const questList = [...quests[type]];
    const quest = questList[idx];
    const wasCompleted = quest.completed;
    quest.completed = !quest.completed;
    
    const updatedQuests = { ...quests, [type]: questList };
    dispatch({ type: 'SET_QUESTS', payload: updatedQuests });
    
    if (!wasCompleted && quest.completed) {
      // Quest just completed - award XP and stat boost
      dispatch({ type: 'ADD_EXPERIENCE', payload: type === 'daily' ? 10 : 25 });
      
      const statIncrease = { [quest.stat]: 1 };
      dispatch({ type: 'UPDATE_STATS', payload: statIncrease });
      
      // Update streak
      dispatch({ type: 'UPDATE_STREAK', payload: { habitName: quest.text, completed: true } });
    } else if (wasCompleted && !quest.completed) {
      // Quest uncompleted - remove streak progress
      dispatch({ type: 'UPDATE_STREAK', payload: { habitName: quest.text, completed: false } });
    }
  };

  // Handler for editing profile
  const handleEditProfile = () => {
    navigate('/settings');
  };

  // Dock items configuration
  const dockItems = [
    { 
      icon: '🏠', 
      label: 'Home', 
      onClick: () => navigate('/dashboard') 
    },
    { 
      icon: '⚔️', 
      label: 'Quests', 
      onClick: () => navigate('/quests') 
    },
    { 
      icon: '🏆', 
      label: 'Achievements', 
      onClick: () => navigate('/achievements') 
    },
    { 
      icon: '⚙️', 
      label: 'Settings', 
      onClick: () => navigate('/settings') 
    }
  ];

  if (isMobile) {
    return (
      <div style={styles.bg}>
        <div style={styles.mobileContainer}>
          <DashboardCharacterProfile onEdit={handleEditProfile} />
          <QuestBoard 
            quests={quests} 
            onAddQuest={handleAddQuest} 
            onToggleQuest={handleToggleQuest} 
          />
          <StatsPanel stats={stats} />
          <StreakTracker streaks={streaks} />
          <AnalyticsPanel 
            stats={stats} 
            quests={quests} 
            achievements={achievements} 
          />
        </div>
        <Dock items={dockItems} />
      </div>
    );
  }

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <div style={styles.left}>
          <DashboardCharacterProfile onEdit={handleEditProfile} />
          <StatsPanel stats={stats} />
          <InventoryPanel inventory={inventory} />
        </div>
        <div style={styles.center}>
          <QuestBoard 
            quests={quests} 
            onAddQuest={handleAddQuest} 
            onToggleQuest={handleToggleQuest} 
          />
          <StreakTracker streaks={streaks} />
        </div>
        <div style={styles.right}>
          <AnalyticsPanel 
            stats={stats} 
            quests={quests} 
            achievements={achievements} 
          />
          <RewardsPanel achievements={achievements} />
          <FriendsPanel 
            friends={friends} 
            friendRequests={friendRequests} 
            onSendRequest={(email) => dispatch({ type: 'SEND_FRIEND_REQUEST', payload: { email } })}
            onAcceptRequest={(idx) => dispatch({ type: 'ACCEPT_FRIEND_REQUEST', payload: idx })}
            onRejectRequest={(idx) => dispatch({ type: 'REJECT_FRIEND_REQUEST', payload: idx })}
          />
        </div>
      </div>
      <Dock items={dockItems} />
    </div>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)',
    padding: '20px 10px 100px 10px',
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
  center: {
    minWidth: 320,
  },
  right: {
    minWidth: 320,
  },
  mobileContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    maxWidth: 500,
    margin: '0 auto',
  },
};
