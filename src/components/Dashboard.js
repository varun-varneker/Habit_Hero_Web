import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardCharacterProfile from './DashboardCharacterProfile';
import StatsPanel from './StatsPanel';
import QuestBoard from './QuestBoard';
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
  const loginStreak = useSelector(state => state.loginStreak);

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
            if (userData.loginStreak) dispatch({ type: 'SET_LOGIN_STREAK', payload: userData.loginStreak });
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
            loginStreak,
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
  }, [user?.uid, profile, stats, quests, achievements, inventory, streaks, loginStreak, friends, friendRequests]);

  // Handlers for quests
  const handleAddQuest = (type, text, stat = 'willpower', extra = {}) => {
    const { estimateMin, energy, context } = extra || {};
    const newQuest = { 
      text, 
      stat, 
      completed: false, 
      id: Date.now(),
      ...(estimateMin ? { estimateMin } : {}),
      ...(energy ? { energy } : {}),
      ...(context && context.length ? { context } : {})
    };
    const updatedQuests = { ...quests, [type]: [...(quests[type] || []), newQuest] };
    dispatch({ type: 'SET_QUESTS', payload: updatedQuests });
  };
  
  const handleToggleQuest = (type, idx) => {
    const questList = [...quests[type]];
    const quest = questList[idx];
    const wasCompleted = quest.completed;
    quest.completed = !quest.completed;
    if (!wasCompleted && quest.completed) {
      // increment completions count
      quest.completionsCount = (quest.completionsCount || 0) + 1;
      // every 5 completions, prompt a short reflection
      if (quest.completionsCount % 5 === 0) {
        const note = window.prompt('Nice streak! Add a short reflection (optional):', '');
        if (note && note.trim()) {
          quest.reflections = [...(quest.reflections || []), { date: new Date().toISOString(), note: note.trim() }];
        }
      }
    }
    
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

  // Kudos: lightweight appreciation on quest
  const handleKudos = (type, idx) => {
    const questList = [...(quests[type] || [])];
    if (!questList[idx]) return;
    const q = { ...questList[idx], kudosCount: (questList[idx].kudosCount || 0) + 1 };
    questList[idx] = q;
    dispatch({ type: 'SET_QUESTS', payload: { ...quests, [type]: questList } });
  };

  // Notes/comments on quest
  const handleAddNote = (type, idx, note) => {
    if (!note || !note.trim()) return;
    const questList = [...(quests[type] || [])];
    if (!questList[idx]) return;
    const q = { ...questList[idx], notes: [...(questList[idx].notes || []), { date: new Date().toISOString(), text: note.trim() }] };
    questList[idx] = q;
    dispatch({ type: 'SET_QUESTS', payload: { ...quests, [type]: questList } });
  };

  // Focus session completion increments a counter
  const handleFocusComplete = (type, idx) => {
    const questList = [...(quests[type] || [])];
    if (!questList[idx]) return;
    const q = { ...questList[idx], pomodorosCompleted: (questList[idx].pomodorosCompleted || 0) + 1 };
    questList[idx] = q;
    dispatch({ type: 'SET_QUESTS', payload: { ...quests, [type]: questList } });
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

  useEffect(() => {
    const today = new Date().toDateString();
    if (!loginStreak) {
      dispatch({
        type: 'INITIALIZE_LOGIN_STREAK',
        payload: {
          currentStreak: 1,
          longestStreak: 1,
          lastLoginDate: today
        }
      });
    } else {
      if (loginStreak.lastLoginDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        // If last login was yesterday, continue streak; otherwise start from 1 (new streak)
        const newStreak = loginStreak.lastLoginDate === yesterdayString
          ? (loginStreak.currentStreak || 0) + 1
          : 1;
        dispatch({
          type: 'UPDATE_LOGIN_STREAK',
          payload: {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, loginStreak.longestStreak),
            lastLoginDate: today
          }
        });
      }
    }
  }, [dispatch, loginStreak]);

  const streak = loginStreak?.currentStreak || 0;
  const longest = loginStreak?.longestStreak || 0;
  const today = new Date().toDateString();
  const loggedInToday = loginStreak?.lastLoginDate === today;

  if (isMobile) {
    return (
      <div style={styles.bg}>
        <div style={styles.mobileContainer}>
          <DashboardCharacterProfile onEdit={handleEditProfile} />
          <StreakTracker />
          <QuestBoard 
            dailyQuests={quests.daily || []}
            weeklyQuests={quests.weekly || []}
            onAddQuest={handleAddQuest} 
            onToggleQuest={handleToggleQuest}
            onKudos={handleKudos}
            onAddNote={handleAddNote}
            onFocusComplete={handleFocusComplete}
          />
          <StatsPanel stats={stats} />
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
        </div>
        <div style={styles.center}>
          <StreakTracker />
          <QuestBoard 
            dailyQuests={quests.daily || []}
            weeklyQuests={quests.weekly || []}
            onAddQuest={handleAddQuest} 
            onToggleQuest={handleToggleQuest}
            onKudos={handleKudos}
            onAddNote={handleAddNote}
            onFocusComplete={handleFocusComplete}
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
    gap: 30,
    maxWidth: 800,
    margin: '0 auto',
  },
  left: {
    minWidth: 350,
    flex: 1,
  },
  center: {
    minWidth: 400,
    flex: 1,
  },
  mobileContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    maxWidth: 500,
    margin: '0 auto',
  },
};
