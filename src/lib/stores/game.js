


/*
 * Purpose: Centralized game state management for LingoQuest
 * Key features: Progress tracking, achievements, streaks, level management
 * Dependencies: Svelte stores
 * Related helpers: LocalStorage utility, progress calculator
 * Function names: updateProgress, unlockAchievement, calculateStreak, levelUp
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-06-11 14:30 | File: lib/stores/game.js
 */

import { writable, derived, get } from 'svelte/store';

// Game state store
export const gameState = writable({
  currentLevel: 1,
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastPlayDate: null,
  completedLessons: [],
  achievements: [],
  unlockedFeatures: ['basic-lessons'],
  preferences: {
    dailyGoal: 50,
    reminderTime: '19:00',
    soundEnabled: true,
    vibrationEnabled: true
  }
});

// Progress tracking store
export const progressState = writable({
  todayXP: 0,
  weeklyXP: 0,
  monthlyXP: 0,
  lessonsCompleted: 0,
  quizzesCompleted: 0,
  averageAccuracy: 0,
  timeSpent: 0
});

// Achievement definitions
export const achievements = writable([
  {
    id: 'first-lesson',
    title: 'Getting Started',
    description: 'Complete your first lesson',
    icon: '🎯',
    xpReward: 10,
    unlocked: false
  },
  {
    id: 'streak-3',
    title: 'On Fire',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    xpReward: 25,
    unlocked: false
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    xpReward: 50,
    unlocked: false
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete a lesson with 100% accuracy',
    icon: '💎',
    xpReward: 30,
    unlocked: false
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete a lesson in under 2 minutes',
    icon: '🚀',
    xpReward: 40,
    unlocked: false
  }
]);

// Derived stores
export const currentLevelProgress = derived(
  gameState,
  ($gameState) => {
    const xpForCurrentLevel = $gameState.currentLevel * 100;
    const xpForNextLevel = ($gameState.currentLevel + 1) * 100;
    const progressXP = $gameState.totalXP - (xpForCurrentLevel - 100);
    const neededXP = xpForNextLevel - xpForCurrentLevel;
    
    return {
      current: Math.max(0, progressXP),
      needed: neededXP,
      percentage: Math.min(100, (progressXP / neededXP) * 100)
    };
  }
);

export const dailyGoalProgress = derived(
  [gameState, progressState],
  ([$gameState, $progressState]) => {
    const goal = $gameState.preferences.dailyGoal;
    const current = $progressState.todayXP;
    
    return {
      current,
      goal,
      percentage: Math.min(100, (current / goal) * 100),
      completed: current >= goal
    };
  }
);

// Game actions
export const gameActions = {
  // Initialize game state from localStorage
  loadGameState() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lingoquest-game-state');
      if (saved) {
        try {
          const parsedState = JSON.parse(saved);
          gameState.set(parsedState);
        } catch (error) {
          console.error('Failed to load game state:', error);
        }
      }
      
      const savedProgress = localStorage.getItem('lingoquest-progress-state');
      if (savedProgress) {
        try {
          const parsedProgress = JSON.parse(savedProgress);
          progressState.set(parsedProgress);
        } catch (error) {
          console.error('Failed to load progress state:', error);
        }
      }
    }
  },

  // Save game state to localStorage
  saveGameState() {
    if (typeof window !== 'undefined') {
      const currentState = get(gameState);
      const currentProgress = get(progressState);
      
      localStorage.setItem('lingoquest-game-state', JSON.stringify(currentState));
      localStorage.setItem('lingoquest-progress-state', JSON.stringify(currentProgress));
    }
  },

  // Add XP and handle level ups
  addXP(amount) {
    gameState.update(state => {
      const newTotalXP = state.totalXP + amount;
      const newLevel = Math.floor(newTotalXP / 100) + 1;
      
      if (newLevel > state.currentLevel) {
        this.levelUp(newLevel);
      }
      
      return {
        ...state,
        totalXP: newTotalXP,
        currentLevel: newLevel
      };
    });
    
    progressState.update(state => ({
      ...state,
      todayXP: state.todayXP + amount
    }));
    
    this.saveGameState();
  },

  // Handle level up
  levelUp(newLevel) {
    const state = get(gameState);
    
    // Unlock new features based on level
    const newFeatures = [];
    if (newLevel >= 3) newFeatures.push('advanced-lessons');
    if (newLevel >= 5) newFeatures.push('story-mode');
    if (newLevel >= 10) newFeatures.push('conversation-practice');
    
    gameState.update(currentState => ({
      ...currentState,
      currentLevel: newLevel,
      unlockedFeatures: [...currentState.unlockedFeatures, ...newFeatures]
    }));
    
    // Show level up notification
    this.showNotification(`Level Up! You reached level ${newLevel}!`, 'success');
  },

  // Update streak
  updateStreak() {
    const today = new Date().toDateString();
    const state = get(gameState);
    
    if (state.lastPlayDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (state.lastPlayDate === yesterday.toDateString()) {
        // Continuing streak
        gameState.update(currentState => ({
          ...currentState,
          currentStreak: currentState.currentStreak + 1,
          longestStreak: Math.max(currentState.longestStreak, currentState.currentStreak + 1),
          lastPlayDate: today
        }));
      } else {
        // Starting new streak
        gameState.update(currentState => ({
          ...currentState,
          currentStreak: 1,
          lastPlayDate: today
        }));
      }
      
      this.checkStreakAchievements();
      this.saveGameState();
    }
  },

  // Complete a lesson
  completeLesson(lessonId, accuracy, timeSpent) {
    const xpEarned = Math.floor(accuracy * 20 + (timeSpent < 120 ? 10 : 0));
    
    this.addXP(xpEarned);
    this.updateStreak();
    
    gameState.update(state => ({
      ...state,
      completedLessons: [...state.completedLessons, {
        id: lessonId,
        completedAt: new Date().toISOString(),
        accuracy,
        timeSpent,
        xpEarned
      }]
    }));
    
    progressState.update(state => ({
      ...state,
      lessonsCompleted: state.lessonsCompleted + 1,
      timeSpent: state.timeSpent + timeSpent,
      averageAccuracy: this.calculateAverageAccuracy([...state.completedLessons, { accuracy }])
    }));
    
    this.checkAchievements(lessonId, accuracy, timeSpent);
    this.saveGameState();
    
    return xpEarned;
  },

  // Unlock achievement
  unlockAchievement(achievementId) {
    const achievementsList = get(achievements);
    const achievement = achievementsList.find(a => a.id === achievementId);
    
    if (achievement && !achievement.unlocked) {
      achievements.update(list => 
        list.map(a => 
          a.id === achievementId 
            ? { ...a, unlocked: true }
            : a
        )
      );
      
      gameState.update(state => ({
        ...state,
        achievements: [...state.achievements, achievementId]
      }));
      
      this.addXP(achievement.xpReward);
      this.showNotification(`Achievement Unlocked: ${achievement.title}!`, 'success');
    }
  },

  // Check for new achievements
  checkAchievements(lessonId, accuracy, timeSpent) {
    const state = get(gameState);
    
    // First lesson
    if (state.completedLessons.length === 1) {
      this.unlockAchievement('first-lesson');
    }
    
    // Perfect accuracy
    if (accuracy === 100) {
      this.unlockAchievement('perfectionist');
    }
    
    // Speed demon
    if (timeSpent < 120) {
      this.unlockAchievement('speed-demon');
    }
  },

  // Check streak achievements
  checkStreakAchievements() {
    const state = get(gameState);
    
    if (state.currentStreak >= 3) {
      this.unlockAchievement('streak-3');
    }
    
    if (state.currentStreak >= 7) {
      this.unlockAchievement('streak-7');
    }
  },

  // Calculate average accuracy
  calculateAverageAccuracy(lessons) {
    if (lessons.length === 0) return 0;
    
    const total = lessons.reduce((sum, lesson) => sum + lesson.accuracy, 0);
    return Math.round(total / lessons.length);
  },

  // Show notification
  showNotification(message, type = 'info') {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message, type }
      }));
    }
  },

  // Update preferences
  updatePreferences(newPreferences) {
    gameState.update(state => ({
      ...state,
      preferences: { ...state.preferences, ...newPreferences }
    }));
    
    this.saveGameState();
  },

  // Reset progress (for testing)
  resetProgress() {
    gameState.set({
      currentLevel: 1,
      totalXP: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastPlayDate: null,
      completedLessons: [],
      achievements: [],
      unlockedFeatures: ['basic-lessons'],
      preferences: {
        dailyGoal: 50,
        reminderTime: '19:00',
        soundEnabled: true,
        vibrationEnabled: true
      }
    });
    
    progressState.set({
      todayXP: 0,
      weeklyXP: 0,
      monthlyXP: 0,
      lessonsCompleted: 0,
      quizzesCompleted: 0,
      averageAccuracy: 0,
      timeSpent: 0
    });
    
    achievements.update(list => 
      list.map(achievement => ({ ...achievement, unlocked: false }))
    );
    
    this.saveGameState();
  }
};

// Initialize game state on module load
if (typeof window !== 'undefined') {
  gameActions.loadGameState();
}



