


// Purpose: Application-wide constants and configuration values for LingoQuest
// Key features: Game settings, API endpoints, UI constants, language definitions
// Dependencies: None - pure constants file
// Related helpers: Used across all application modules for consistent values
// Function names: None - exports constant objects and values
// MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
// Timestamp: 2025-06-11 14:32 | File: src/lib/utils/constants.js

// Application metadata
export const APP_NAME = 'LingoQuest';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Interactive language learning through quests and challenges';

// Local storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'lingoquest_user_profile',
  LESSON_PROGRESS: 'lingoquest_lesson_progress',
  ACHIEVEMENTS: 'lingoquest_achievements',
  SETTINGS: 'lingoquest_settings',
  STREAK_DATA: 'lingoquest_streak_data',
  OFFLINE_DATA: 'lingoquest_offline_data',
  AUTH_TOKEN: 'lingoquest_auth_token',
  THEME: 'lingoquest_theme',
  LANGUAGE_PREFERENCE: 'lingoquest_language_preference'
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  LESSONS: {
    LIST: '/lessons',
    DETAIL: '/lessons/:id',
    PROGRESS: '/lessons/:id/progress',
    COMPLETE: '/lessons/:id/complete'
  },
  QUESTS: {
    LIST: '/quests',
    DETAIL: '/quests/:id',
    START: '/quests/:id/start',
    COMPLETE: '/quests/:id/complete'
  },
  ACHIEVEMENTS: {
    LIST: '/achievements',
    UNLOCK: '/achievements/:id/unlock'
  },
  LEADERBOARD: {
    GLOBAL: '/leaderboard/global',
    FRIENDS: '/leaderboard/friends'
  },
  PROGRESS: {
    SYNC: '/progress/sync',
    STATS: '/progress/stats'
  }
};

// Supported languages
export const LANGUAGES = {
  SPANISH: {
    code: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
    difficulty: 'beginner',
    categories: ['vocabulary', 'grammar', 'conversation', 'culture']
  },
  FRENCH: {
    code: 'fr',
    name: 'French',
    flag: '🇫🇷',
    difficulty: 'beginner',
    categories: ['vocabulary', 'grammar', 'conversation', 'culture']
  },
  GERMAN: {
    code: 'de',
    name: 'German',
    flag: '🇩🇪',
    difficulty: 'intermediate',
    categories: ['vocabulary', 'grammar', 'conversation', 'culture']
  },
  ITALIAN: {
    code: 'it',
    name: 'Italian',
    flag: '🇮🇹',
    difficulty: 'beginner',
    categories: ['vocabulary', 'grammar', 'conversation', 'culture']
  },
  PORTUGUESE: {
    code: 'pt',
    name: 'Portuguese',
    flag: '🇵🇹',
    difficulty: 'beginner',
    categories: ['vocabulary', 'grammar', 'conversation', 'culture']
  },
  JAPANESE: {
    code: 'ja',
    name: 'Japanese',
    flag: '🇯🇵',
    difficulty: 'advanced',
    categories: ['hiragana', 'katakana', 'kanji', 'grammar', 'conversation']
  },
  KOREAN: {
    code: 'ko',
    name: 'Korean',
    flag: '🇰🇷',
    difficulty: 'advanced',
    categories: ['hangul', 'grammar', 'conversation', 'culture']
  },
  MANDARIN: {
    code: 'zh',
    name: 'Mandarin Chinese',
    flag: '🇨🇳',
    difficulty: 'expert',
    categories: ['pinyin', 'characters', 'grammar', 'conversation', 'culture']
  }
};

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: {
    name: 'Beginner',
    color: '#10b981',
    icon: '🌱',
    xpMultiplier: 1.0,
    minAccuracy: 0.6
  },
  INTERMEDIATE: {
    name: 'Intermediate',
    color: '#f59e0b',
    icon: '🌿',
    xpMultiplier: 1.5,
    minAccuracy: 0.7
  },
  ADVANCED: {
    name: 'Advanced',
    color: '#ef4444',
    icon: '🌳',
    xpMultiplier: 2.0,
    minAccuracy: 0.8
  },
  EXPERT: {
    name: 'Expert',
    color: '#8b5cf6',
    icon: '🦅',
    xpMultiplier: 3.0,
    minAccuracy: 0.9
  }
};

// Quest types
export const QUEST_TYPES = {
  DAILY: {
    name: 'Daily Quest',
    duration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    xpReward: 50,
    icon: '📅'
  },
  WEEKLY: {
    name: 'Weekly Challenge',
    duration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    xpReward: 200,
    icon: '🗓️'
  },
  MONTHLY: {
    name: 'Monthly Mission',
    duration: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    xpReward: 500,
    icon: '📆'
  },
  SPECIAL: {
    name: 'Special Event',
    duration: null, // Variable duration
    xpReward: 1000,
    icon: '⭐'
  }
};

// Achievement categories
export const ACHIEVEMENT_CATEGORIES = {
  LEARNING: {
    name: 'Learning Milestones',
    color: '#6366f1',
    icon: '🎓'
  },
  STREAK: {
    name: 'Consistency',
    color: '#f59e0b',
    icon: '🔥'
  },
  SOCIAL: {
    name: 'Social',
    color: '#10b981',
    icon: '👥'
  },
  MASTERY: {
    name: 'Mastery',
    color: '#8b5cf6',
    icon: '🏆'
  },
  EXPLORATION: {
    name: 'Exploration',
    color: '#06b6d4',
    icon: '🗺️'
  }
};

// XP and leveling system
export const XP_SYSTEM = {
  BASE_XP_PER_LEVEL: 100,
  LEVEL_MULTIPLIER: 1.2,
  MAX_LEVEL: 100,
  BONUS_XP: {
    PERFECT_LESSON: 25,
    FIRST_TRY: 10,
    SPEED_BONUS: 15,
    STREAK_BONUS: 5
  }
};

// Streak system
export const STREAK_SYSTEM = {
  REQUIRED_DAILY_XP: 50,
  FREEZE_COST: 5, // gems
  MAX_FREEZES: 3,
  MILESTONES: [7, 14, 30, 50, 100, 365],
  REWARDS: {
    7: { gems: 5, xp: 100 },
    14: { gems: 10, xp: 200 },
    30: { gems: 25, xp: 500 },
    50: { gems: 50, xp: 1000 },
    100: { gems: 100, xp: 2000 },
    365: { gems: 365, xp: 5000 }
  }
};

// Lesson types
export const LESSON_TYPES = {
  VOCABULARY: {
    name: 'Vocabulary',
    icon: '📚',
    color: '#6366f1',
    minQuestions: 10,
    maxQuestions: 20
  },
  GRAMMAR: {
    name: 'Grammar',
    icon: '📝',
    color: '#10b981',
    minQuestions: 8,
    maxQuestions: 15
  },
  LISTENING: {
    name: 'Listening',
    icon: '🎧',
    color: '#f59e0b',
    minQuestions: 5,
    maxQuestions: 12
  },
  SPEAKING: {
    name: 'Speaking',
    icon: '🗣️',
    color: '#ef4444',
    minQuestions: 3,
    maxQuestions: 8
  },
  READING: {
    name: 'Reading',
    icon: '📖',
    color: '#8b5cf6',
    minQuestions: 5,
    maxQuestions: 10
  },
  CULTURE: {
    name: 'Culture',
    icon: '🌍',
    color: '#06b6d4',
    minQuestions: 5,
    maxQuestions: 15
  }
};

// Question types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  FILL_BLANK: 'fill_blank',
  MATCHING: 'matching',
  ORDERING: 'ordering',
  LISTENING: 'listening',
  SPEAKING: 'speaking',
  TRANSLATION: 'translation'
};

// Animation durations (in milliseconds)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536
};

// Theme configuration
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Game currency
export const CURRENCY = {
  GEMS: {
    name: 'Gems',
    icon: '💎',
    color: '#06b6d4'
  },
  COINS: {
    name: 'Coins',
    icon: '🪙',
    color: '#f59e0b'
  }
};

// Timer configurations
export const TIMERS = {
  LESSON_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  QUESTION_TIMEOUT: 60 * 1000, // 1 minute
  SPEAKING_TIMEOUT: 10 * 1000, // 10 seconds
  AUTO_SAVE_INTERVAL: 30 * 1000 // 30 seconds
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  AUTH_REQUIRED: 'Please log in to continue.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  LESSON_LOCKED: 'This lesson is locked. Complete previous lessons to unlock.',
  INSUFFICIENT_GEMS: 'Not enough gems to complete this action.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  LESSON_COMPLETED: 'Congratulations! Lesson completed successfully!',
  ACHIEVEMENT_UNLOCKED: 'Achievement unlocked!',
  LEVEL_UP: 'Level up! Great progress!',
  STREAK_MILESTONE: 'Streak milestone reached!',
  PROFILE_UPDATED: 'Profile updated successfully!'
};

// Default user settings
export const DEFAULT_SETTINGS = {
  theme: THEMES.AUTO,
  language: 'en',
  notifications: {
    daily_reminder: true,
    achievements: true,
    streak_freeze: true,
    social: false
  },
  audio: {
    enabled: true,
    volume: 0.8,
    speech_rate: 1.0
  },
  privacy: {
    show_progress: true,
    allow_friend_requests: true,
    show_online_status: false
  }
};

export default {
  APP_NAME,
  APP_VERSION,
  STORAGE_KEYS,
  API_ENDPOINTS,
  LANGUAGES,
  DIFFICULTY_LEVELS,
  QUEST_TYPES,
  ACHIEVEMENT_CATEGORIES,
  XP_SYSTEM,
  STREAK_SYSTEM,
  LESSON_TYPES,
  QUESTION_TYPES,
  ANIMATIONS,
  BREAKPOINTS,
  THEMES,
  NOTIFICATION_TYPES,
  CURRENCY,
  TIMERS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_SETTINGS
};



