const initialState = {
  user: null,
  profile: { name: '', bio: '', avatar: '' },
  stats: { charisma: 0, intelligence: 0, strength: 0, adaptability: 0, willpower: 0 },
  quests: { daily: [], weekly: [] },
  achievements: [],
  experience: 0,
  level: 1,
  expToLevel: 100,
  inventory: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
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
    default:
      return state;
  }
}
