


/*
 * Purpose: Progress tracking and analytics for LingoQuest learning data
 * Key features: Session tracking, performance metrics, streak calculation, time analytics
 * Dependencies: Svelte stores, date utilities
 * Related helpers: Game store, local storage, statistics calculator
 * Function names: trackSession, calculateWeeklyProgress, updateMetrics, getAnalytics
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-06-11 14:32 | File: lib/stores/progress.js
 */

import { writable, derived, get } from 'svelte/store';

// Progress data store
export const progressData = writable({
  sessions: [],
  dailyStats: {},
  weeklyStats: {},
  monthlyStats: {},
  skillProgress: {},
  streakData: {
    current: 0,
    longest: 0,
    lastActiveDate: null
  },
  timeSpent: {
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  },
  accuracy: {
    overall: 0,
    recent: 0,
    bySkill: {}
  }
});

// Session tracking store
export const currentSession = writable({
  startTime: null,
  endTime: null,
  lessonsCompleted: 0,
  xpEarned: 0,
  accuracy: 0,
  mistakes: [],
  isActive: false
});

// Learning analytics store
export const learningAnalytics = writable({
  strongSkills: [],
  weakSkills: [],
  recommendedFocus: [],
  learningVelocity: 0,
  retentionRate: 0,
  difficultyAdaptation: 'medium'
});

// Derived stores for computed values
export const weeklyProgress = derived(
  progressData,
  ($progressData) => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekSessions = $progressData.sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= weekStart;
    });
    
    const dailyProgress = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = date.toDateString();
      
      const dayData = $progressData.dailyStats[dateStr] || {
        xp: 0,
        lessons: 0,
        timeSpent: 0,
        accuracy: 0
      };
      
      return {
        date: dateStr,
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        ...dayData
      };
    });
    
    return {
      sessions: weekSessions,
      dailyProgress,
      totalXP: weekSessions.reduce((sum, s) => sum + s.xpEarned, 0),
      totalTime: weekSessions.reduce((sum, s) => sum + s.duration, 0),
      averageAccuracy: weekSessions.length > 0 
        ? weekSessions.reduce((sum, s) => sum + s.accuracy, 0) / weekSessions.length 
        : 0
    };
  }
);

export const monthlyProgress = derived(
  progressData,
  ($progressData) => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const monthSessions = $progressData.sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= monthStart;
    });
    
    const weeklyData = [];
    const weeksInMonth = Math.ceil((today.getDate() + monthStart.getDay()) / 7);
    
    for (let week = 0; week < weeksInMonth; week++) {
      const weekStart = new Date(monthStart);
      weekStart.setDate(1 + (week * 7) - monthStart.getDay());
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekSessions = monthSessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });
      
      weeklyData.push({
        week: week + 1,
        sessions: weekSessions.length,
        xp: weekSessions.reduce((sum, s) => sum + s.xpEarned, 0),
        timeSpent: weekSessions.reduce((sum, s) => sum + s.duration, 0),
        accuracy: weekSessions.length > 0
          ? weekSessions.reduce((sum, s) => sum + s.accuracy, 0) / weekSessions.length
          : 0
      });
    }
    
    return {
      sessions: monthSessions,
      weeklyData,
      totalXP: monthSessions.reduce((sum, s) => sum + s.xpEarned, 0),
      totalTime: monthSessions.reduce((sum, s) => sum + s.duration, 0),
      averageAccuracy: monthSessions.length > 0
        ? monthSessions.reduce((sum, s) => sum + s.accuracy, 0) / monthSessions.length
        : 0
    };
  }
);

export const skillInsights = derived(
  progressData,
  ($progressData) => {
    const skills = Object.keys($progressData.skillProgress);
    
    const insights = skills.map(skill => {
      const progress = $progressData.skillProgress[skill];
      const recentSessions = $progressData.sessions
        .filter(s => s.skills && s.skills.includes(skill))
        .slice(-10);
      
      const trend = calculateTrend(recentSessions.map(s => s.accuracy));
      const mastery = calculateMastery(progress);
      
      return {
        skill,
        progress,
        trend,
        mastery,
        needsWork: mastery < 0.7 && trend < 0,
        strength: mastery > 0.8 && trend >= 0
      };
    });
    
    return {
      skills: insights,
      weakAreas: insights.filter(s => s.needsWork),
      strengths: insights.filter(s => s.strength),
      recommendations: generateRecommendations(insights)
    };
  }
);

// Progress actions
export const progressActions = {
  // Initialize progress from localStorage
  loadProgress() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lingoquest-progress');
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          progressData.set(parsedData);
        } catch (error) {
          console.error('Failed to load progress data:', error);
        }
      }
    }
  },

  // Save progress to localStorage
  saveProgress() {
    if (typeof window !== 'undefined') {
      const current = get(progressData);
      localStorage.setItem('lingoquest-progress', JSON.stringify(current));
    }
  },

  // Start a new learning session
  startSession() {
    const now = new Date();
    currentSession.set({
      startTime: now.toISOString(),
      endTime: null,
      lessonsCompleted: 0,
      xpEarned: 0,
      accuracy: 0,
      mistakes: [],
      isActive: true
    });
  },

  // End current session
  endSession() {
    const session = get(currentSession);
    if (!session.isActive) return;

    const now = new Date();
    const duration = Math.floor((now - new Date(session.startTime)) / 1000);
    
    const sessionData = {
      id: Date.now().toString(),
      date: now.toISOString(),
      startTime: session.startTime,
      endTime: now.toISOString(),
      duration,
      lessonsCompleted: session.lessonsCompleted,
      xpEarned: session.xpEarned,
      accuracy: session.accuracy,
      mistakes: session.mistakes,
      skills: this.extractSkillsFromSession(session)
    };

    this.recordSession(sessionData);
    
    currentSession.update(s => ({ ...s, isActive: false, endTime: now.toISOString() }));
  },

  // Record completed session
  recordSession(sessionData) {
    progressData.update(data => {
      const dateStr = new Date(sessionData.date).toDateString();
      
      // Update sessions
      const sessions = [...data.sessions, sessionData].slice(-100); // Keep last 100 sessions
      
      // Update daily stats
      const dailyStats = { ...data.dailyStats };
      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = { xp: 0, lessons: 0, timeSpent: 0, accuracy: 0, sessionCount: 0 };
      }
      
      const dayStats = dailyStats[dateStr];
      dayStats.xp += sessionData.xpEarned;
      dayStats.lessons += sessionData.lessonsCompleted;
      dayStats.timeSpent += sessionData.duration;
      dayStats.sessionCount += 1;
      dayStats.accuracy = (dayStats.accuracy * (dayStats.sessionCount - 1) + sessionData.accuracy) / dayStats.sessionCount;
      
      // Update time spent
      const timeSpent = { ...data.timeSpent };
      timeSpent.total += sessionData.duration;
      timeSpent.today = this.getTodayTimeSpent(sessions);
      timeSpent.thisWeek = this.getWeekTimeSpent(sessions);
      timeSpent.thisMonth = this.getMonthTimeSpent(sessions);
      
      // Update overall accuracy
      const accuracy = { ...data.accuracy };
      accuracy.overall = this.calculateOverallAccuracy(sessions);
      accuracy.recent = this.calculateRecentAccuracy(sessions.slice(-10));
      
      // Update skill progress
      const skillProgress = { ...data.skillProgress };
      if (sessionData.skills) {
        sessionData.skills.forEach(skill => {
          if (!skillProgress[skill]) {
            skillProgress[skill] = { sessions: 0, totalAccuracy: 0, averageAccuracy: 0, xpEarned: 0 };
          }
          
          const skillData = skillProgress[skill];
          skillData.sessions += 1;
          skillData.totalAccuracy += sessionData.accuracy;
          skillData.averageAccuracy = skillData.totalAccuracy / skillData.sessions;
          skillData.xpEarned += sessionData.xpEarned;
        });
        
        accuracy.bySkill = Object.keys(skillProgress).reduce((acc, skill) => {
          acc[skill] = skillProgress[skill].averageAccuracy;
          return acc;
        }, {});
      }
      
      return {
        ...data,
        sessions,
        dailyStats,
        timeSpent,
        accuracy,
        skillProgress
      };
    });
    
    this.updateStreak();
    this.updateAnalytics();
    this.saveProgress();
  },

  // Update streak data
  updateStreak() {
    const today = new Date().toDateString();
    
    progressData.update(data => {
      const streakData = { ...data.streakData };
      
      if (streakData.lastActiveDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (streakData.lastActiveDate === yesterday.toDateString()) {
          streakData.current += 1;
          streakData.longest = Math.max(streakData.longest, streakData.current);
        } else if (streakData.lastActiveDate) {
          streakData.current = 1;
        } else {
          streakData.current = 1;
        }
        
        streakData.lastActiveDate = today;
      }
      
      return { ...data, streakData };
    });
  },

  // Update session data
  updateSession(updates) {
    currentSession.update(session => ({ ...session, ...updates }));
  },

  // Add XP to current session
  addSessionXP(xp) {
    currentSession.update(session => ({
      ...session,
      xpEarned: session.xpEarned + xp
    }));
  },

  // Record mistake in current session
  recordMistake(mistake) {
    currentSession.update(session => ({
      ...session,
      mistakes: [...session.mistakes, {
        ...mistake,
        timestamp: new Date().toISOString()
      }]
    }));
  },

  // Update learning analytics
  updateAnalytics() {
    const data = get(progressData);
    const recentSessions = data.sessions.slice(-20);
    
    const analytics = {
      strongSkills: this.identifyStrongSkills(data.skillProgress),
      weakSkills: this.identifyWeakSkills(data.skillProgress),
      recommendedFocus: this.generateFocusRecommendations(data.skillProgress, recentSessions),
      learningVelocity: this.calculateLearningVelocity(recentSessions),
      retentionRate: this.calculateRetentionRate(recentSessions),
      difficultyAdaptation: this.suggestDifficultyLevel(data.accuracy.recent, data.streakData.current)
    };
    
    learningAnalytics.set(analytics);
  },

  // Helper methods
  getTodayTimeSpent(sessions) {
    const today = new Date().toDateString();
    return sessions
      .filter(s => new Date(s.date).toDateString() === today)
      .reduce((sum, s) => sum + s.duration, 0);
  },

  getWeekTimeSpent(sessions) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return sessions
      .filter(s => new Date(s.date) >= weekAgo)
      .reduce((sum, s) => sum + s.duration, 0);
  },

  getMonthTimeSpent(sessions) {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    return sessions
      .filter(s => new Date(s.date) >= monthAgo)
      .reduce((sum, s) => sum + s.duration, 0);
  },

  calculateOverallAccuracy(sessions) {
    if (sessions.length === 0) return 0;
    return sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length;
  },

  calculateRecentAccuracy(recentSessions) {
    if (recentSessions.length === 0) return 0;
    return recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length;
  },

  extractSkillsFromSession(session) {
    // This would be determined by the lessons completed
    // For now, return a placeholder
    return ['vocabulary', 'grammar', 'listening'];
  },

  identifyStrongSkills(skillProgress) {
    return Object.entries(skillProgress)
      .filter(([_, data]) => data.averageAccuracy > 80)
      .map(([skill, _]) => skill)
      .slice(0, 3);
  },

  identifyWeakSkills(skillProgress) {
    return Object.entries(skillProgress)
      .filter(([_, data]) => data.averageAccuracy < 60)
      .map(([skill, _]) => skill)
      .slice(0, 3);
  },

  generateFocusRecommendations(skillProgress, recentSessions) {
    const weakSkills = this.identifyWeakSkills(skillProgress);
    const recentMistakes = recentSessions
      .flatMap(s => s.mistakes || [])
      .reduce((acc, mistake) => {
        acc[mistake.type] = (acc[mistake.type] || 0) + 1;
        return acc;
      }, {});
    
    return [
      ...weakSkills,
      ...Object.keys(recentMistakes)
        .sort((a, b) => recentMistakes[b] - recentMistakes[a])
        .slice(0, 2)
    ].slice(0, 3);
  },

  calculateLearningVelocity(recentSessions) {
    if (recentSessions.length < 2) return 0;
    
    const xpGained = recentSessions.reduce((sum, s) => sum + s.xpEarned, 0);
    const timeSpent = recentSessions.reduce((sum, s) => sum + s.duration, 0);
    
    return timeSpent > 0 ? (xpGained / timeSpent) * 3600 : 0; // XP per hour
  },

  calculateRetentionRate(recentSessions) {
    if (recentSessions.length === 0) return 0;
    
    // Simple retention calculation based on accuracy trend
    const accuracies = recentSessions.map(s => s.accuracy);
    const trend = calculateTrend(accuracies);
    
    return Math.max(0, Math.min(100, 70 + trend * 30));
  },

  suggestDifficultyLevel(recentAccuracy, currentStreak) {
    if (recentAccuracy > 85 && currentStreak > 3) return 'hard';
    if (recentAccuracy < 60 || currentStreak === 0) return 'easy';
    return 'medium';
  },

  // Reset all progress data
  resetProgress() {
    progressData.set({
      sessions: [],
      dailyStats: {},
      weeklyStats: {},
      monthlyStats: {},
      skillProgress: {},
      streakData: {
        current: 0,
        longest: 0,
        lastActiveDate: null
      },
      timeSpent: {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0
      },
      accuracy: {
        overall: 0,
        recent: 0,
        bySkill: {}
      }
    });
    
    learningAnalytics.set({
      strongSkills: [],
      weakSkills: [],
      recommendedFocus: [],
      learningVelocity: 0,
      retentionRate: 0,
      difficultyAdaptation: 'medium'
    });
    
    this.saveProgress();
  }
};

// Helper functions
function calculateTrend(values) {
  if (values.length < 2) return 0;
  
  const n = values.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = values.reduce((sum, val) => sum + val, 0);
  const sumXY = values.reduce((sum, val, i) => sum + val * i, 0);
  const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  return slope;
}

function calculateMastery(skillData) {
  if (!skillData || skillData.sessions === 0) return 0;
  
  const accuracyWeight = skillData.averageAccuracy / 100;
  const experienceWeight = Math.min(1, skillData.sessions / 20);
  
  return (accuracyWeight * 0.7 + experienceWeight * 0.3);
}

function generateRecommendations(skillInsights) {
  const recommendations = [];
  
  skillInsights.forEach(skill => {
    if (skill.needsWork) {
      recommendations.push(`Focus on ${skill.skill} - needs improvement`);
    }
  });
  
  if (recommendations.length === 0) {
    recommendations.push('Great job! Keep practicing to maintain your progress');
  }
  
  return recommendations.slice(0, 3);
}

// Initialize progress on module load
if (typeof window !== 'undefined') {
  progressActions.loadProgress();
}



