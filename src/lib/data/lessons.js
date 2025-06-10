


// Purpose: Define lesson structure, content, and progression logic for language learning
// Key features: Lesson templates, difficulty progression, skill tracking, content organization
// Dependencies: languages.js for language data
// Related helpers: Used by lesson components, progress tracking, quiz generation
// Function names: getLessonById, getLessonsByLanguage, generateLessonContent, calculateProgress
// MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
// Timestamp: 2025-06-10 14:32 | File: src/lib/data/lessons.js

export const lessonTypes = {
  vocabulary: {
    name: 'Vocabulary',
    icon: '📚',
    color: '#3b82f6',
    description: 'Learn new words and phrases'
  },
  grammar: {
    name: 'Grammar',
    icon: '📝',
    color: '#10b981',
    description: 'Master language structure and rules'
  },
  listening: {
    name: 'Listening',
    icon: '👂',
    color: '#f59e0b',
    description: 'Improve comprehension skills'
  },
  speaking: {
    name: 'Speaking',
    icon: '🗣️',
    color: '#ef4444',
    description: 'Practice pronunciation and fluency'
  },
  reading: {
    name: 'Reading',
    icon: '📖',
    color: '#8b5cf6',
    description: 'Enhance reading comprehension'
  },
  writing: {
    name: 'Writing',
    icon: '✍️',
    color: '#06b6d4',
    description: 'Develop writing skills'
  },
  culture: {
    name: 'Culture',
    icon: '🌍',
    color: '#ec4899',
    description: 'Learn cultural context and customs'
  }
};

export const difficultyLevels = {
  1: { name: 'Beginner', xp: 50, color: '#10b981' },
  2: { name: 'Elementary', xp: 75, color: '#22c55e' },
  3: { name: 'Pre-Intermediate', xp: 100, color: '#84cc16' },
  4: { name: 'Intermediate', xp: 125, color: '#f59e0b' },
  5: { name: 'Upper-Intermediate', xp: 150, color: '#f97316' },
  6: { name: 'Advanced', xp: 175, color: '#ef4444' },
  7: { name: 'Proficient', xp: 200, color: '#dc2626' },
  8: { name: 'Expert', xp: 250, color: '#8b5cf6' }
};

export const lessonCategories = {
  basics: {
    name: 'Basics',
    icon: '🌱',
    order: 1,
    description: 'Essential words and phrases',
    requiredLevel: 1
  },
  greetings: {
    name: 'Greetings',
    icon: '👋',
    order: 2,
    description: 'How to say hello and goodbye',
    requiredLevel: 1
  },
  family: {
    name: 'Family',
    icon: '👨‍👩‍👧‍👦',
    order: 3,
    description: 'Family members and relationships',
    requiredLevel: 1
  },
  numbers: {
    name: 'Numbers',
    icon: '🔢',
    order: 4,
    description: 'Counting and basic math',
    requiredLevel: 1
  },
  colors: {
    name: 'Colors',
    icon: '🎨',
    order: 5,
    description: 'Basic colors and descriptions',
    requiredLevel: 1
  },
  food: {
    name: 'Food & Drink',
    icon: '🍕',
    order: 6,
    description: 'Meals, ingredients, and dining',
    requiredLevel: 2
  },
  travel: {
    name: 'Travel',
    icon: '✈️',
    order: 7,
    description: 'Transportation and directions',
    requiredLevel: 2
  },
  shopping: {
    name: 'Shopping',
    icon: '🛍️',
    order: 8,
    description: 'Buying and selling items',
    requiredLevel: 2
  },
  time: {
    name: 'Time & Dates',
    icon: '🕐',
    order: 9,
    description: 'Telling time and calendar',
    requiredLevel: 3
  },
  weather: {
    name: 'Weather',
    icon: '🌤️',
    order: 10,
    description: 'Weather conditions and seasons',
    requiredLevel: 3
  },
  hobbies: {
    name: 'Hobbies',
    icon: '⚽',
    order: 11,
    description: 'Leisure activities and interests',
    requiredLevel: 3
  },
  work: {
    name: 'Work & Career',
    icon: '💼',
    order: 12,
    description: 'Jobs and professional life',
    requiredLevel: 4
  },
  health: {
    name: 'Health',
    icon: '🏥',
    order: 13,
    description: 'Medical terms and body parts',
    requiredLevel: 4
  },
  education: {
    name: 'Education',
    icon: '🎓',
    order: 14,
    description: 'School and learning',
    requiredLevel: 4
  },
  technology: {
    name: 'Technology',
    icon: '💻',
    order: 15,
    description: 'Digital world and gadgets',
    requiredLevel: 5
  },
  environment: {
    name: 'Environment',
    icon: '🌱',
    order: 16,
    description: 'Nature and sustainability',
    requiredLevel: 5
  },
  politics: {
    name: 'Politics & Society',
    icon: '🏛️',
    order: 17,
    description: 'Government and social issues',
    requiredLevel: 6
  },
  business: {
    name: 'Business',
    icon: '📈',
    order: 18,
    description: 'Commerce and finance',
    requiredLevel: 6
  },
  arts: {
    name: 'Arts & Culture',
    icon: '🎭',
    order: 19,
    description: 'Music, art, and literature',
    requiredLevel: 7
  },
  philosophy: {
    name: 'Philosophy',
    icon: '🤔',
    order: 20,
    description: 'Abstract concepts and ideas',
    requiredLevel: 8
  }
};

export function generateLessonStructure(languageId, category, level) {
  const baseLesson = {
    id: `${languageId}-${category}-${level}`,
    languageId,
    category,
    level,
    title: `${lessonCategories[category]?.name} - Level ${level}`,
    description: lessonCategories[category]?.description || '',
    type: getRandomLessonType(),
    duration: calculateLessonDuration(level),
    xpReward: difficultyLevels[level]?.xp || 50,
    requiredLevel: lessonCategories[category]?.requiredLevel || 1,
    prerequisites: getPrerequisites(category, level),
    skills: generateSkills(category, level),
    exercises: generateExercises(category, level),
    vocabulary: generateVocabulary(languageId, category, level),
    grammar: generateGrammarPoints(languageId, category, level),
    culturalNotes: generateCulturalNotes(languageId, category),
    tips: generateLearningTips(category, level),
    completed: false,
    score: 0,
    attempts: 0,
    timeSpent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return baseLesson;
}

export function getLessonById(lessonId) {
  // This would typically fetch from a database or cache
  const [languageId, category, level] = lessonId.split('-');
  return generateLessonStructure(languageId, category, parseInt(level));
}

export function getLessonsByLanguage(languageId, userLevel = 1) {
  const lessons = [];
  
  Object.entries(lessonCategories).forEach(([category, categoryData]) => {
    if (categoryData.requiredLevel <= userLevel) {
      for (let level = 1; level <= Math.min(userLevel + 1, 8); level++) {
        lessons.push(generateLessonStructure(languageId, category, level));
      }
    }
  });

  return lessons.sort((a, b) => {
    if (a.category === b.category) {
      return a.level - b.level;
    }
    return lessonCategories[a.category].order - lessonCategories[b.category].order;
  });
}

export function getNextLesson(languageId, currentLessonId, userProgress) {
  const allLessons = getLessonsByLanguage(languageId, userProgress.level);
  const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
  
  if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
    return allLessons[currentIndex + 1];
  }
  
  return null;
}

export function calculateLessonProgress(completedLessons, totalLessons) {
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
}

function getRandomLessonType() {
  const types = Object.keys(lessonTypes);
  return types[Math.floor(Math.random() * types.length)];
}

function calculateLessonDuration(level) {
  const baseDuration = 10; // minutes
  return baseDuration + (level * 2);
}

function getPrerequisites(category, level) {
  const prerequisites = [];
  
  if (level > 1) {
    prerequisites.push(`${category}-${level - 1}`);
  }
  
  if (category === 'food' && level === 1) {
    prerequisites.push('basics-1', 'numbers-1');
  }
  
  if (category === 'travel' && level === 1) {
    prerequisites.push('basics-1', 'numbers-1', 'time-1');
  }
  
  return prerequisites;
}

function generateSkills(category, level) {
  const baseSkills = ['vocabulary', 'pronunciation'];
  
  if (level >= 2) baseSkills.push('grammar');
  if (level >= 3) baseSkills.push('listening');
  if (level >= 4) baseSkills.push('speaking');
  if (level >= 5) baseSkills.push('reading');
  if (level >= 6) baseSkills.push('writing');
  if (level >= 7) baseSkills.push('culture');
  
  return baseSkills;
}

function generateExercises(category, level) {
  const exercises = [
    {
      type: 'multiple-choice',
      count: Math.min(level * 2, 10),
      points: 10
    },
    {
      type: 'fill-blanks',
      count: Math.min(level, 5),
      points: 15
    }
  ];
  
  if (level >= 3) {
    exercises.push({
      type: 'matching',
      count: Math.min(level, 5),
      points: 20
    });
  }
  
  if (level >= 5) {
    exercises.push({
      type: 'translation',
      count: Math.min(level - 2, 3),
      points: 25
    });
  }
  
  return exercises;
}

function generateVocabulary(languageId, category, level) {
  // This would be populated from a comprehensive vocabulary database
  const vocabularyTemplates = {
    basics: ['hello', 'goodbye', 'please', 'thank you', 'yes', 'no'],
    family: ['mother', 'father', 'sister', 'brother', 'child', 'parent'],
    numbers: ['one', 'two', 'three', 'four', 'five', 'ten'],
    colors: ['red', 'blue', 'green', 'yellow', 'black', 'white'],
    food: ['bread', 'water', 'meat', 'vegetable', 'fruit', 'rice']
  };
  
  const baseWords = vocabularyTemplates[category] || ['word1', 'word2', 'word3'];
  
  return baseWords.slice(0, Math.min(level * 3, 15)).map(word => ({
    english: word,
    translation: `${word}_${languageId}`, // Placeholder for actual translations
    pronunciation: `/${word}/`,
    difficulty: level <= 3 ? 'easy' : level <= 6 ? 'medium' : 'hard',
    partOfSpeech: 'noun' // This would be determined properly
  }));
}

function generateGrammarPoints(languageId, category, level) {
  const grammarTemplates = {
    1: ['Present tense basics', 'Articles'],
    2: ['Plural forms', 'Question formation'],
    3: ['Past tense introduction', 'Adjective agreement'],
    4: ['Future tense', 'Comparative forms'],
    5: ['Present perfect', 'Conditional sentences'],
    6: ['Past perfect', 'Subjunctive mood'],
    7: ['Advanced verb forms', 'Complex sentence structure'],
    8: ['Idiomatic expressions', 'Advanced syntax']
  };
  
  return grammarTemplates[level] || [];
}

function generateCulturalNotes(languageId, category) {
  return [
    `Cultural context for ${category} in ${languageId} speaking countries`,
    `Common customs and etiquette related to ${category}`,
    `Regional variations and local expressions`
  ];
}

function generateLearningTips(category, level) {
  const tips = [
    'Practice regularly for better retention',
    'Use spaced repetition to remember vocabulary',
    'Try to use new words in context'
  ];
  
  if (level >= 3) {
    tips.push('Listen to native speakers when possible');
  }
  
  if (level >= 5) {
    tips.push('Read materials at your level');
    tips.push('Keep a vocabulary journal');
  }
  
  return tips;
}

export function getLessonsByCategory(languageId, category) {
  const lessons = [];
  const categoryData = lessonCategories[category];
  
  if (!categoryData) return lessons;
  
  for (let level = 1; level <= 8; level++) {
    lessons.push(generateLessonStructure(languageId, category, level));
  }
  
  return lessons;
}

export function getRecommendedLessons(languageId, userProgress, limit = 5) {
  const allLessons = getLessonsByLanguage(languageId, userProgress.level);
  const incompleteLessons = allLessons.filter(lesson => !lesson.completed);
  
  return incompleteLessons
    .slice(0, limit)
    .map(lesson => ({
      ...lesson,
      recommended: true,
      reason: getRecommendationReason(lesson, userProgress)
    }));
}

function getRecommendationReason(lesson, userProgress) {
  if (lesson.level === userProgress.level) {
    return 'Perfect for your current level';
  }
  
  if (lesson.level === userProgress.level + 1) {
    return 'Ready for the next challenge';
  }
  
  const weakSkills = Object.entries(userProgress.skills)
    .filter(([_, score]) => score < 70)
    .map(([skill]) => skill);
    
  if (lesson.skills.some(skill => weakSkills.includes(skill))) {
    return 'Helps improve your weak areas';
  }
  
  return 'Continues your learning path';
}



