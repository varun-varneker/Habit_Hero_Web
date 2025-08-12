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
  // Login-only streak with milestone-based progress bar
  // milestoneDays cycles through MILESTONES sequence; current resets to 0 on milestone achievement
  loginStreak: { current: 0, longest: 0, lastLoginDate: null, milestoneIndex: 0, milestoneDays: 3 },
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
    // Login streak: initialize/hydrate from DB
    case 'SET_LOGIN_STREAK':
      return { ...state, loginStreak: { ...state.loginStreak, ...(action.payload || {}) } };
    case 'INITIALIZE_LOGIN_STREAK': {
      const today = new Date().toDateString();
      const current = action.payload?.currentStreak ?? 1;
      const longest = action.payload?.longestStreak ?? 1;
      const milestoneIndex = action.payload?.milestoneIndex ?? state.loginStreak.milestoneIndex ?? 0;
      const milestoneDays = [3, 5, 7, 10][milestoneIndex % 4];
      return {
        ...state,
        loginStreak: {
          current,
          longest,
          lastLoginDate: action.payload?.lastLoginDate || today,
          milestoneIndex,
          milestoneDays,
        }
      };
    }
    case 'RESET_LOGIN_STREAK': {
      const milestoneIndex = 0; // reset cycle to 3-day goal on full reset
      return {
        ...state,
        loginStreak: {
          current: 0,
          longest: state.loginStreak.longest,
          lastLoginDate: action.payload?.lastLoginDate || state.loginStreak.lastLoginDate,
          milestoneIndex,
          milestoneDays: [3, 5, 7, 10][milestoneIndex]
        }
      };
    }
    case 'UPDATE_LOGIN_STREAK': {
      // Payload can provide computed currentStreak and lastLoginDate from UI/auth gate
      // Reducer augments: update longest, check milestone, award achievement, and advance cycle
      const MILESTONES = [3, 5, 7, 10];
      const prev = state.loginStreak || initialState.loginStreak;
      const current = Math.max(0, action.payload?.currentStreak ?? prev.current);
      const lastLoginDate = action.payload?.lastLoginDate || prev.lastLoginDate || new Date().toDateString();
      const milestoneIndex = Number.isInteger(prev.milestoneIndex) ? prev.milestoneIndex : 0;
      const milestoneDays = MILESTONES[milestoneIndex % MILESTONES.length];
      const longest = Math.max(prev.longest || 0, current);

      // Check if milestone achieved on this update
      let newMilestoneIndex = milestoneIndex;
      let newCurrent = current;
      let achievements = state.achievements;
      if (current >= milestoneDays && milestoneDays > 0) {
        const achievedLabel = `Streak Milestone: ${milestoneDays} days`;
        achievements = [...achievements, achievedLabel];
        newMilestoneIndex = (milestoneIndex + 1) % MILESTONES.length;
        // Reset bar for next cycle
        newCurrent = 0;
      }

      return {
        ...state,
        achievements,
        loginStreak: {
          current: newCurrent,
          longest,
          lastLoginDate,
          milestoneIndex: newMilestoneIndex,
          milestoneDays: MILESTONES[newMilestoneIndex % MILESTONES.length]
        }
      };
    }
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
