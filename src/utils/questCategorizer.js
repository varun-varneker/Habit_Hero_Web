// Local AI learning patterns - no API needed!
const CATEGORY_PATTERNS = {
  strength: [
    // Physical activities
    ['exercise', 'workout', 'gym', 'run', 'walk', 'jog', 'bike', 'swim', 'lift', 'pushup', 'pullup'],
    ['clean', 'vacuum', 'mop', 'organize', 'yard', 'garden', 'move', 'carry', 'build'],
    ['sports', 'basketball', 'football', 'tennis', 'soccer', 'baseball', 'volleyball'],
    ['physical', 'strength', 'muscle', 'cardio', 'fitness', 'health', 'active']
  ],
  
  intelligence: [
    // Mental activities
    ['read', 'study', 'learn', 'research', 'analyze', 'write', 'code', 'program', 'develop'],
    ['book', 'article', 'course', 'tutorial', 'documentation', 'manual', 'guide'],
    ['math', 'science', 'history', 'language', 'skill', 'knowledge', 'education'],
    ['think', 'solve', 'problem', 'calculate', 'design', 'plan', 'strategy']
  ],
  
  charisma: [
    // Social activities
    ['talk', 'speak', 'present', 'meeting', 'call', 'text', 'message', 'email'],
    ['friend', 'family', 'colleague', 'team', 'group', 'social', 'party', 'event'],
    ['network', 'connect', 'collaborate', 'communicate', 'interview', 'date'],
    ['public', 'audience', 'speech', 'presentation', 'performance', 'stage']
  ],
  
  willpower: [
    // Self-discipline activities
    ['meditate', 'focus', 'concentrate', 'mindful', 'breathe', 'relax', 'calm'],
    ['quit', 'stop', 'avoid', 'resist', 'control', 'discipline', 'habit'],
    ['diet', 'fast', 'healthy', 'nutrition', 'sleep', 'rest', 'routine'],
    ['goal', 'commitment', 'dedication', 'persistence', 'determination']
  ],
  
  adaptability: [
    // Change and flexibility
    ['new', 'try', 'different', 'change', 'adapt', 'flexible', 'creative'],
    ['explore', 'discover', 'experiment', 'adventure', 'travel', 'experience'],
    ['skill', 'hobby', 'art', 'music', 'craft', 'create', 'make', 'build'],
    ['challenge', 'unknown', 'unfamiliar', 'novel', 'innovation', 'invention']
  ]
};

// Store user corrections for learning
const getUserCorrections = () => {
  const stored = localStorage.getItem('questCategoryCorrections');
  return stored ? JSON.parse(stored) : [];
};

const saveUserCorrection = (questText, aiSuggestion, userChoice) => {
  const corrections = getUserCorrections();
  const words = questText.toLowerCase().trim().split(/\s+/);
  
  corrections.push({
    quest: questText.toLowerCase().trim(),
    words: words,
    aiSuggested: aiSuggestion,
    userChose: userChoice,
    timestamp: Date.now()
  });
  
  // Keep only last 200 corrections
  if (corrections.length > 200) {
    corrections.splice(0, corrections.length - 200);
  }
  
  localStorage.setItem('questCategoryCorrections', JSON.stringify(corrections));
  console.log(`📚 Learned: "${questText}" → ${userChoice} (was ${aiSuggestion})`);
};

// Calculate word score for a category
const calculateCategoryScore = (questWords, category) => {
  let score = 0;
  const patterns = CATEGORY_PATTERNS[category] || [];
  
  // Check against built-in patterns
  patterns.forEach(patternGroup => {
    patternGroup.forEach(keyword => {
      questWords.forEach(word => {
        if (word.includes(keyword) || keyword.includes(word)) {
          score += 1;
        }
      });
    });
  });
  
  // Check against user corrections (learning)
  const corrections = getUserCorrections();
  corrections.forEach(correction => {
    if (correction.userChose === category) {
      const commonWords = correction.words.filter(word => 
        questWords.some(qword => 
          qword.includes(word) || word.includes(qword)
        )
      );
      
      // Weight learned patterns higher
      score += commonWords.length * 2;
    }
  });
  
  return score;
};

// Helper function to categorize without using learned data
const categorizeQuestWithoutLearning = (questText) => {
  const words = questText.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  const scores = {};
  const categories = ['strength', 'intelligence', 'charisma', 'willpower', 'adaptability'];
  
  categories.forEach(category => {
    let score = 0;
    const patterns = CATEGORY_PATTERNS[category] || [];
    
    patterns.forEach(patternGroup => {
      patternGroup.forEach(keyword => {
        words.forEach(word => {
          if (word.includes(keyword) || keyword.includes(word)) {
            score += 1;
          }
        });
      });
    });
    
    scores[category] = score;
  });
  
  const bestCategory = categories.reduce((best, category) => 
    scores[category] > scores[best] ? category : best
  );
  
  return scores[bestCategory] > 0 ? bestCategory : 'adaptability';
};

// Main categorization function - ONLY ONE DECLARATION
export function categorizeQuest(questText) {
  console.log(`🤖 Analyzing: "${questText}"`);
  
  const words = questText.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2); // Only words longer than 2 chars
  
  // Check user learning first
  const corrections = getUserCorrections();
  const learned = corrections.find(c => {
    const similarity = c.words.filter(word => 
      words.some(qword => qword.includes(word) || word.includes(qword))
    );
    return similarity.length >= 2; // At least 2 words match
  });
  
  if (learned) {
    console.log(`📚 Using learned pattern: ${learned.userChose}`);
    return learned.userChose;
  }
  
  // Calculate scores for each category
  const scores = {};
  const categories = ['strength', 'intelligence', 'charisma', 'willpower', 'adaptability'];
  
  categories.forEach(category => {
    scores[category] = calculateCategoryScore(words, category);
  });
  
  // Find best match
  const bestCategory = categories.reduce((best, category) => 
    scores[category] > scores[best] ? category : best
  );
  
  // If no clear winner, default to adaptability
  const result = scores[bestCategory] > 0 ? bestCategory : 'adaptability';
  
  console.log(`🎯 Scores:`, scores);
  console.log(`✅ Result: ${result}`);
  
  return result;
}

// Learning stats
export function getLearningStats() {
  const corrections = getUserCorrections();
  if (corrections.length === 0) return { corrections: 0, accuracy: 0 };
  
  // Calculate accuracy by checking if recent predictions match user choices
  const recent = corrections.slice(-50); // Last 50 corrections
  const accurate = recent.filter(c => {
    // Re-run categorization on the original text
    const predicted = categorizeQuestWithoutLearning(c.quest);
    return predicted === c.userChose;
  }).length;
  
  return {
    corrections: corrections.length,
    accuracy: recent.length > 0 ? Math.round((accurate / recent.length) * 100) : 0
  };
}

// Export the correction function
export { saveUserCorrection };