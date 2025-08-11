const initialState = {
  user: null,
  profile: { 
    name: '', 
    bio: '', 
    avatar: {
      face: 'face1',
      hair: 'hair1',
      hairColor: 'brown',
      outfit: 'casual',
      accessories: 'none',
      background: 'castle'
    }
  },
  stats: { charisma: 0, intelligence: 0, strength: 0, adaptability: 0, willpower: 0 },
  quests: { daily: [], weekly: [] },
  achievements: [],
  experience: 0,
  level: 1,
  expToLevel: 100,
  inventory: [],
  streaks: {}, // habitName: { current: 0, longest: 0, lastCompleted: null }
  friends: [],
  friendRequests: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'UPDATE_STATS':
      return { ...state, stats: { ...state.stats, ...action.payload } };
    case 'SET_QUESTS':
      return { ...state, quests: action.payload };
    case 'UPDATE_QUEST':
      return { ...state, quests: { ...state.quests, [action.questType]: action.quests } };
    case 'ADD_ACHIEVEMENT':
      return { ...state, achievements: [...state.achievements, action.payload] };
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    case 'ADD_EXPERIENCE': {
      let exp = state.experience + action.payload;
      let level = state.level;
      let expToLevel = state.expToLevel;
      let achievements = [...state.achievements];
      while (exp >= expToLevel) {
        exp -= expToLevel;
        level += 1;
        expToLevel = Math.floor(expToLevel * 1.2);
        achievements.push(`Level Up! Reached level ${level}`);
      }
      return { ...state, experience: exp, level, expToLevel, achievements };
    }
    case 'SET_INVENTORY':
      return { ...state, inventory: action.payload };
    case 'UPDATE_STREAK': {
      const { habitName, completed } = action.payload;
      const today = new Date().toISOString().split('T')[0];
      const currentStreak = state.streaks[habitName] || { current: 0, longest: 0, lastCompleted: null };
      
      if (completed) {
        const newCurrent = currentStreak.current + 1;
        const newLongest = Math.max(currentStreak.longest, newCurrent);
        
        return {
          ...state,
          streaks: {
            ...state.streaks,
            [habitName]: {
              current: newCurrent,
              longest: newLongest,
              lastCompleted: today
            }
          }
        };
      } else {
        // Habit not completed, reset current streak
        return {
          ...state,
          streaks: {
            ...state.streaks,
            [habitName]: {
              ...currentStreak,
              current: 0
            }
          }
        };
      }
    }
    case 'SET_STREAKS':
      return { ...state, streaks: action.payload };
    case 'SEND_FRIEND_REQUEST':
      return { ...state, friendRequests: [...state.friendRequests, action.payload] };
    case 'ACCEPT_FRIEND_REQUEST': {
      const request = state.friendRequests[action.payload];
      return {
        ...state,
        friends: [...state.friends, { 
          email: request.email, 
          name: request.email.split('@')[0],
          level: 1,
          isOnline: false,
          addedAt: new Date().toISOString()
        }],
        friendRequests: state.friendRequests.filter((_, i) => i !== action.payload)
      };
    }
    case 'REJECT_FRIEND_REQUEST':
      return { 
        ...state, 
        friendRequests: state.friendRequests.filter((_, i) => i !== action.payload)
      };
    case 'SET_FRIENDS':
      return { ...state, friends: action.payload };
    case 'SET_FRIEND_REQUESTS':
      return { ...state, friendRequests: action.payload };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}
