



// Purpose: Define available languages with their configurations and metadata
// Key features: Language definitions, difficulty levels, native names, RTL support
// Dependencies: None (pure data module)
// Related helpers: Used by language selector, progress tracking, lesson content
// Function names: None (data export only)
// MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
// Timestamp: 2025-06-10 14:30 | File: src/lib/data/languages.js

export const languages = [
  {
    id: 'spanish',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    difficulty: 'beginner',
    family: 'Romance',
    speakers: 500000000,
    countries: ['Spain', 'Mexico', 'Argentina', 'Colombia'],
    rtl: false,
    description: 'Learn the world\'s second most spoken language',
    lessons: 50,
    quests: 25,
    color: '#ff6b6b'
  },
  {
    id: 'french',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    difficulty: 'beginner',
    family: 'Romance',
    speakers: 280000000,
    countries: ['France', 'Canada', 'Belgium', 'Switzerland'],
    rtl: false,
    description: 'Master the language of love and diplomacy',
    lessons: 48,
    quests: 24,
    color: '#74b9ff'
  },
  {
    id: 'german',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    difficulty: 'intermediate',
    family: 'Germanic',
    speakers: 100000000,
    countries: ['Germany', 'Austria', 'Switzerland'],
    rtl: false,
    description: 'Learn the language of innovation and engineering',
    lessons: 52,
    quests: 26,
    color: '#fdcb6e'
  },
  {
    id: 'italian',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    difficulty: 'beginner',
    family: 'Romance',
    speakers: 65000000,
    countries: ['Italy', 'Vatican City', 'San Marino'],
    rtl: false,
    description: 'Discover the language of art, food, and culture',
    lessons: 46,
    quests: 23,
    color: '#55a3ff'
  },
  {
    id: 'portuguese',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    difficulty: 'beginner',
    family: 'Romance',
    speakers: 260000000,
    countries: ['Portugal', 'Brazil', 'Angola', 'Mozambique'],
    rtl: false,
    description: 'Explore the language of two continents',
    lessons: 47,
    quests: 24,
    color: '#00b894'
  },
  {
    id: 'japanese',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    difficulty: 'advanced',
    family: 'Japonic',
    speakers: 125000000,
    countries: ['Japan'],
    rtl: false,
    description: 'Master the intricate writing systems and culture',
    lessons: 60,
    quests: 30,
    color: '#e84393'
  },
  {
    id: 'korean',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    difficulty: 'advanced',
    family: 'Koreanic',
    speakers: 77000000,
    countries: ['South Korea', 'North Korea'],
    rtl: false,
    description: 'Learn the language of K-pop and technology',
    lessons: 58,
    quests: 29,
    color: '#a29bfe'
  },
  {
    id: 'mandarin',
    name: 'Mandarin Chinese',
    nativeName: '普通话',
    flag: '🇨🇳',
    difficulty: 'advanced',
    family: 'Sino-Tibetan',
    speakers: 918000000,
    countries: ['China', 'Taiwan', 'Singapore'],
    rtl: false,
    description: 'Conquer the world\'s most spoken language',
    lessons: 65,
    quests: 32,
    color: '#fd79a8'
  },
  {
    id: 'arabic',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    difficulty: 'expert',
    family: 'Semitic',
    speakers: 422000000,
    countries: ['Saudi Arabia', 'Egypt', 'Morocco', 'UAE'],
    rtl: true,
    description: 'Master the language of 22 countries',
    lessons: 70,
    quests: 35,
    color: '#00cec9'
  },
  {
    id: 'russian',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    difficulty: 'expert',
    family: 'Slavic',
    speakers: 258000000,
    countries: ['Russia', 'Belarus', 'Kazakhstan', 'Kyrgyzstan'],
    rtl: false,
    description: 'Learn the language of literature and science',
    lessons: 68,
    quests: 34,
    color: '#6c5ce7'
  },
  {
    id: 'hindi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    difficulty: 'intermediate',
    family: 'Indo-European',
    speakers: 602000000,
    countries: ['India'],
    rtl: false,
    description: 'Connect with over 600 million speakers',
    lessons: 55,
    quests: 28,
    color: '#ff7675'
  },
  {
    id: 'dutch',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    difficulty: 'intermediate',
    family: 'Germanic',
    speakers: 24000000,
    countries: ['Netherlands', 'Belgium', 'Suriname'],
    rtl: false,
    description: 'Learn the language of windmills and tulips',
    lessons: 45,
    quests: 22,
    color: '#fab1a0'
  }
];

export const difficultyLevels = {
  beginner: {
    name: 'Beginner',
    description: 'Easy to learn for English speakers',
    color: '#10b981',
    estimatedHours: '150-300',
    icon: '🌱'
  },
  intermediate: {
    name: 'Intermediate',
    description: 'Moderate difficulty with some challenges',
    color: '#f59e0b',
    estimatedHours: '300-600',
    icon: '🌿'
  },
  advanced: {
    name: 'Advanced',
    description: 'Challenging with complex grammar or writing',
    color: '#ef4444',
    estimatedHours: '600-900',
    icon: '🌳'
  },
  expert: {
    name: 'Expert',
    description: 'Very challenging for English speakers',
    color: '#8b5cf6',
    estimatedHours: '900+',
    icon: '🎯'
  }
};

export const languageFamilies = {
  Romance: {
    name: 'Romance Languages',
    description: 'Descended from Latin',
    languages: ['spanish', 'french', 'italian', 'portuguese'],
    color: '#ff6b6b'
  },
  Germanic: {
    name: 'Germanic Languages',
    description: 'Share common Germanic roots',
    languages: ['german', 'dutch'],
    color: '#fdcb6e'
  },
  Slavic: {
    name: 'Slavic Languages',
    description: 'Eastern European language family',
    languages: ['russian'],
    color: '#6c5ce7'
  },
  'Sino-Tibetan': {
    name: 'Sino-Tibetan Languages',
    description: 'Chinese and Tibetan language family',
    languages: ['mandarin'],
    color: '#fd79a8'
  },
  Japonic: {
    name: 'Japonic Languages',
    description: 'Japanese language family',
    languages: ['japanese'],
    color: '#e84393'
  },
  Koreanic: {
    name: 'Koreanic Languages',
    description: 'Korean language family',
    languages: ['korean'],
    color: '#a29bfe'
  },
  Semitic: {
    name: 'Semitic Languages',
    description: 'Middle Eastern language family',
    languages: ['arabic'],
    color: '#00cec9'
  },
  'Indo-European': {
    name: 'Indo-European Languages',
    description: 'Large language family including Hindi',
    languages: ['hindi'],
    color: '#ff7675'
  }
};

export function getLanguageById(id) {
  return languages.find(lang => lang.id === id);
}

export function getLanguagesByDifficulty(difficulty) {
  return languages.filter(lang => lang.difficulty === difficulty);
}

export function getLanguagesByFamily(family) {
  return languages.filter(lang => lang.family === family);
}

export function getPopularLanguages(limit = 5) {
  return languages
    .sort((a, b) => b.speakers - a.speakers)
    .slice(0, limit);
}

export function searchLanguages(query) {
  const lowercaseQuery = query.toLowerCase();
  return languages.filter(lang => 
    lang.name.toLowerCase().includes(lowercaseQuery) ||
    lang.nativeName.toLowerCase().includes(lowercaseQuery) ||
    lang.countries.some(country => 
      country.toLowerCase().includes(lowercaseQuery)
    )
  );
}

