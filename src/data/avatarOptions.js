// Avatar customization options
export const avatarOptions = {
  face: [
    { id: 'face1', name: 'Default', url: 'https://img.icons8.com/color/96/000000/person-male.png' },
    { id: 'face2', name: 'Friendly', url: 'https://img.icons8.com/color/96/000000/user-male-circle.png' },
    { id: 'face3', name: 'Cool', url: 'https://img.icons8.com/color/96/000000/businessman.png' },
    { id: 'face4', name: 'Warrior', url: 'https://img.icons8.com/color/96/000000/knight.png' },
    { id: 'face5', name: 'Mage', url: 'https://img.icons8.com/color/96/000000/wizard.png' },
    { id: 'face6', name: 'Female', url: 'https://img.icons8.com/color/96/000000/person-female.png' },
  ],
  hair: [
    { id: 'hair1', name: 'Short', color: '#8B4513' },
    { id: 'hair2', name: 'Long', color: '#8B4513' },
    { id: 'hair3', name: 'Curly', color: '#8B4513' },
    { id: 'hair4', name: 'Bald', color: null },
  ],
  hairColor: [
    { id: 'brown', name: 'Brown', value: '#8B4513' },
    { id: 'black', name: 'Black', value: '#000000' },
    { id: 'blonde', name: 'Blonde', value: '#FFD700' },
    { id: 'red', name: 'Red', value: '#FF4500' },
    { id: 'gray', name: 'Gray', value: '#808080' },
  ],
  outfit: [
    { id: 'casual', name: 'Casual', unlocked: true },
    { id: 'formal', name: 'Formal', unlocked: true },
    { id: 'warrior', name: 'Warrior Armor', unlocked: false, requirement: 'strength >= 50' },
    { id: 'mage', name: 'Mage Robes', unlocked: false, requirement: 'intelligence >= 50' },
    { id: 'ninja', name: 'Ninja Suit', unlocked: false, requirement: 'adaptability >= 50' },
    { id: 'royal', name: 'Royal Attire', unlocked: false, requirement: 'charisma >= 50' },
  ],
  accessories: [
    { id: 'none', name: 'None', unlocked: true },
    { id: 'glasses', name: 'Glasses', unlocked: true },
    { id: 'crown', name: 'Crown', unlocked: false, requirement: 'level >= 10' },
    { id: 'cape', name: 'Hero Cape', unlocked: false, requirement: 'total_quests >= 100' },
    { id: 'medal', name: 'Victory Medal', unlocked: false, requirement: 'achievements >= 25' },
  ],
  background: [
    { id: 'castle', name: 'Castle', unlocked: true },
    { id: 'forest', name: 'Mystic Forest', unlocked: false, requirement: 'willpower >= 30' },
    { id: 'mountains', name: 'Mountain Peak', unlocked: false, requirement: 'strength >= 30' },
    { id: 'library', name: 'Ancient Library', unlocked: false, requirement: 'intelligence >= 30' },
    { id: 'space', name: 'Cosmic Void', unlocked: false, requirement: 'level >= 15' },
  ]
};

// Default avatar configuration
export const defaultAvatar = {
  face: 'face1',
  hair: 'hair1',
  hairColor: 'brown',
  outfit: 'casual',
  accessories: 'none',
  background: 'castle'
};

// Function to check if an item is unlocked based on user stats
export const isItemUnlocked = (item, userStats, userLevel, achievements, totalQuests) => {
  if (item.unlocked) return true;
  if (!item.requirement) return true;
  
  const req = item.requirement;
  
  // Parse requirements
  if (req.includes('>=')) {
    const [stat, value] = req.split(' >= ');
    const requiredValue = parseInt(value);
    
    switch (stat) {
      case 'level':
        return userLevel >= requiredValue;
      case 'achievements':
        return achievements.length >= requiredValue;
      case 'total_quests':
        return totalQuests >= requiredValue;
      default:
        return userStats[stat] >= requiredValue;
    }
  }
  
  return false;
};
