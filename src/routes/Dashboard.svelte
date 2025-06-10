


<!--
  Purpose: Main dashboard component displaying user progress, achievements, and quick actions
  Key features: Progress tracking, streak counter, daily goals, recent lessons, achievements showcase
  Dependencies: Svelte stores, Chart.js or similar, Icon components
  Related helpers: progressStore, achievementStore, lessonStore, streakCalculator
  Function names: updateProgress, calculateStreak, loadDashboardData, handleQuickAction
  MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
  Timestamp: 2025-06-10 14:30 | File: src/routes/Dashboard.svelte
-->

<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Trophy, 
    Target, 
    Flame, 
    BookOpen, 
    Clock, 
    TrendingUp,
    Play,
    Award,
    Calendar,
    Zap
  } from 'lucide-svelte';
  
  // Stores and state
  let userProgress = {
    currentLevel: 1,
    xp: 250,
    xpToNext: 500,
    streak: 7,
    lessonsCompleted: 23,
    totalLessons: 50,
    averageAccuracy: 87,
    weeklyGoal: 5,
    completedThisWeek: 3
  };
  
  let recentLessons = [];
  let achievements = [];
  let isLoading = true;
  let dailyGoalCompleted = false;
  
  // Calculate progress percentages
  $: progressPercentage = (userProgress.xp / userProgress.xpToNext) * 100;
  $: lessonProgressPercentage = (userProgress.lessonsCompleted / userProgress.totalLessons) * 100;
  $: weeklyProgressPercentage = (userProgress.completedThisWeek / userProgress.weeklyGoal) * 100;
  
  onMount(async () => {
    await loadDashboardData();
    checkDailyGoal();
  });
  
  async function loadDashboardData() {
    try {
      // Simulate API calls - replace with actual data fetching
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Load recent lessons
      recentLessons = [
        {
          id: 1,
          title: "Basic Greetings",
          language: "Spanish",
          completed: true,
          score: 95,
          date: "2025-06-10"
        },
        {
          id: 2,
          title: "Family Members",
          language: "Spanish", 
          completed: true,
          score: 88,
          date: "2025-06-09"
        },
        {
          id: 3,
          title: "Numbers 1-20",
          language: "Spanish",
          completed: true,
          score: 92,
          date: "2025-06-08"
        }
      ];
      
      // Load recent achievements
      achievements = [
        {
          id: 1,
          title: "First Steps",
          description: "Complete your first lesson",
          icon: "🎯",
          earned: true,
          date: "2025-06-08"
        },
        {
          id: 2,
          title: "Week Warrior",
          description: "Complete 7 days in a row",
          icon: "🔥",
          earned: true,
          date: "2025-06-10"
        },
        {
          id: 3,
          title: "Perfect Score",
          description: "Get 100% on any lesson",
          icon: "⭐",
          earned: false,
          date: null
        }
      ];
      
      isLoading = false;
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      isLoading = false;
    }
  }
  
  function checkDailyGoal() {
    const today = new Date().toDateString();
    const todaysLessons = recentLessons.filter(lesson => 
      new Date(lesson.date).toDateString() === today
    );
    dailyGoalCompleted = todaysLessons.length > 0;
  }
  
  function handleStartLesson() {
    goto('/lessons');
  }
  
  function handleTakeQuiz() {
    goto('/quiz');
  }
  
  function handleViewProgress() {
    goto('/profile');
  }
  
  function handleViewAchievements() {
    goto('/achievements');
  }
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
  
  function getStreakMessage(streak) {
    if (streak >= 30) return "Incredible dedication! 🏆";
    if (streak >= 14) return "You're on fire! 🔥";
    if (streak >= 7) return "Great consistency! ⭐";
    if (streak >= 3) return "Building momentum! 💪";
    return "Keep it up! 🚀";
  }
</script>

<div class="dashboard">
  {#if isLoading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading your progress...</p>
    </div>
  {:else}
    <!-- Welcome Section -->
    <section class="welcome-section">
      <div class="welcome-content">
        <h1>Welcome back, Learner!</h1>
        <p>Ready to continue your language learning journey?</p>
      </div>
      <div class="quick-actions">
        <button class="btn btn-primary" on:click={handleStartLesson}>
          <Play size={20} />
          Continue Learning
        </button>
        <button class="btn btn-secondary" on:click={handleTakeQuiz}>
          <Target size={20} />
          Take Quiz
        </button>
      </div>
    </section>

    <!-- Stats Overview -->
    <section class="stats-grid">
      <!-- XP Progress -->
      <div class="stat-card level-card">
        <div class="stat-header">
          <div class="stat-icon xp-icon">
            <TrendingUp size={24} />
          </div>
          <div class="stat-info">
            <h3>Level {userProgress.currentLevel}</h3>
            <p>{userProgress.xp} / {userProgress.xpToNext} XP</p>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progressPercentage}%"></div>
        </div>
      </div>

      <!-- Streak Counter -->
      <div class="stat-card streak-card">
        <div class="stat-header">
          <div class="stat-icon streak-icon">
            <Flame size={24} />
          </div>
          <div class="stat-info">
            <h3>{userProgress.streak} Day Streak</h3>
            <p>{getStreakMessage(userProgress.streak)}</p>
          </div>
        </div>
        <div class="streak-visual">
          {#each Array(Math.min(userProgress.streak, 7)) as _, i}
            <div class="streak-day active"></div>
          {/each}
          {#each Array(Math.max(0, 7 - userProgress.streak)) as _, i}
            <div class="streak-day"></div>
          {/each}
        </div>
      </div>

      <!-- Lessons Progress -->
      <div class="stat-card lessons-card">
        <div class="stat-header">
          <div class="stat-icon lessons-icon">
            <BookOpen size={24} />
          </div>
          <div class="stat-info">
            <h3>Lessons</h3>
            <p>{userProgress.lessonsCompleted} / {userProgress.totalLessons}</p>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {lessonProgressPercentage}%"></div>
        </div>
      </div>

      <!-- Weekly Goal -->
      <div class="stat-card goal-card">
        <div class="stat-header">
          <div class="stat-icon goal-icon">
            <Calendar size={24} />
          </div>
          <div class="stat-info">
            <h3>Weekly Goal</h3>
            <p>{userProgress.completedThisWeek} / {userProgress.weeklyGoal} lessons</p>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {weeklyProgressPercentage}%"></div>
        </div>
      </div>
    </section>

    <!-- Daily Goal Status -->
    <section class="daily-goal">
      <div class="goal-status {dailyGoalCompleted ? 'completed' : 'pending'}">
        <div class="goal-icon">
          {#if dailyGoalCompleted}
            <Award size={24} />
          {:else}
            <Target size={24} />
          {/if}
        </div>
        <div class="goal-content">
          <h3>
            {dailyGoalCompleted ? 'Daily Goal Complete!' : 'Today\'s Goal'}
          </h3>
          <p>
            {dailyGoalCompleted 
              ? 'Great work! You\'ve completed your lesson for today.' 
              : 'Complete one lesson to maintain your streak.'}
          </p>
        </div>
        {#if !dailyGoalCompleted}
          <button class="btn btn-sm btn-primary" on:click={handleStartLesson}>
            <Zap size={16} />
            Start Now
          </button>
        {/if}
      </div>
    </section>

    <!-- Recent Activity -->
    <section class="recent-activity">
      <div class="section-header">
        <h2>Recent Lessons</h2>
        <button class="btn btn-sm btn-secondary" on:click={handleViewProgress}>
          View All
        </button>
      </div>
      
      <div class="activity-list">
        {#each recentLessons as lesson}
          <div class="activity-item">
            <div class="activity-icon">
              <BookOpen size={20} />
            </div>
            <div class="activity-content">
              <h4>{lesson.title}</h4>
              <p>{lesson.language} • {formatDate(lesson.date)}</p>
            </div>
            <div class="activity-score">
              <span class="score">{lesson.score}%</span>
              <div class="score-badge {lesson.score >= 90 ? 'excellent' : lesson.score >= 80 ? 'good' : 'okay'}">
                {lesson.score >= 90 ? '⭐' : lesson.score >= 80 ? '👍' : '📚'}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- Recent Achievements -->
    <section class="achievements-section">
      <div class="section-header">
        <h2>Achievements</h2>
        <button class="btn btn-sm btn-secondary" on:click={handleViewAchievements}>
          View All
        </button>
      </div>
      
      <div class="achievements-grid">
        {#each achievements.slice(0, 6) as achievement}
          <div class="achievement-card {achievement.earned ? 'earned' : 'locked'}">
            <div class="achievement-icon">
              {achievement.icon}
            </div>
            <div class="achievement-content">
              <h4>{achievement.title}</h4>
              <p>{achievement.description}</p>
              {#if achievement.earned && achievement.date}
                <small class="achievement-date">
                  Earned {formatDate(achievement.date)}
                </small>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}
</div>

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-6);
    min-height: 100vh;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    color: var(--text-muted);
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: var(--spacing-4);
  }

  /* Welcome Section */
  .welcome-section {
    background: var(--bg-primary);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-8);
    margin-bottom: var(--spacing-6);
    box-shadow: var(--shadow-sm);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--border-color);
  }

  .welcome-content h1 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-2);
    color: var(--text-color);
  }

  .welcome-content p {
    color: var(--text-secondary);
    font-size: var(--font-size-lg);
  }

  .quick-actions {
    display: flex;
    gap: var(--spacing-3);
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-4);
    margin-bottom: var(--spacing-6);
  }

  .stat-card {
    background: var(--bg-primary);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-6);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    transition: all var(--transition-fast);
  }

  .stat-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .stat-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    margin-bottom: var(--spacing-4);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .xp-icon { background: var(--primary-gradient); }
  .streak-icon { background: var(--error-gradient); }
  .lessons-icon { background: var(--success-gradient); }
  .goal-icon { background: var(--warning-gradient); }

  .stat-info h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--spacing-1);
  }

  .stat-info p {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    margin: 0;
  }

  .streak-visual {
    display: flex;
    gap: var(--spacing-1);
  }

  .streak-day {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--border-color);
    transition: all var(--transition-fast);
  }

  .streak-day.active {
    background: var(--error-color);
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.3);
  }

  /* Daily Goal */
  .daily-goal {
    margin-bottom: var(--spacing-6);
  }

  .goal-status {
    background: var(--bg-primary);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-6);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
  }

  .goal-status.completed {
    border-color: var(--success-color);
    background: linear-gradient(135deg, var(--bg-primary) 0%, rgba(16, 185, 129, 0.05) 100%);
  }

  .goal-status.pending {
    border-color: var(--warning-color);
    background: linear-gradient(135deg, var(--bg-primary) 0%, rgba(245, 158, 11, 0.05) 100%);
  }

  .goal-status .goal-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .completed .goal-icon {
    background: var(--success-gradient);
  }

  .pending .goal-icon {
    background: var(--warning-gradient);
  }

  .goal-content {
    flex: 1;
  }

  .goal-content h3 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-1);
  }

  .goal-content p {
    color: var(--text-secondary);
    margin: 0;
  }

  /* Recent Activity */
  .recent-activity,
  .achievements-section {
    background: var(--bg-primary);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-6);
    margin-bottom: var(--spacing-6);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-4);
  }

  .section-header h2 {
    font-size: var(--font-size-xl);
    margin: 0;
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .activity-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    padding: var(--spacing-4);
    border-radius: var(--border-radius);
    background: var(--bg-secondary);
    transition: all var(--transition-fast);
  }

  .activity-item:hover {
    background: var(--bg-tertiary);
    transform: translateX(4px);
  }

  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: var(--border-radius);
    background: var(--primary-gradient);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .activity-content {
    flex: 1;
  }

  .activity-content h4 {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    margin-bottom: var(--spacing-1);
  }

  .activity-content p {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    margin: 0;
  }

  .activity-score {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }

  .score {
    font-weight: var(--font-weight-semibold);
    color: var(--text-color);
  }

  .score-badge {
    font-size: var(--font-size-lg);
  }

  /* Achievements */
  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-4);
  }

  .achievement-card {
    padding: var(--spacing-4);
    border-radius: var(--border-radius);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
  }

  .achievement-card.earned {
    background: linear-gradient(135deg, var(--bg-secondary) 0%, rgba(16, 185, 129, 0.1) 100%);
    border-color: var(--success-color);
  }

  .achievement-card.locked {
    opacity: 0.6;
  }

  .achievement-card:hover {
    background: var(--bg-tertiary);
    transform: translateY(-2px);
  }

  .achievement-icon {
    font-size: var(--font-size-2xl);
    width: 40px;
    text-align: center;
  }

  .achievement-content h4 {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    margin-bottom: var(--spacing-1);
  }

  .achievement-content p {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    margin: 0 0 var(--spacing-1) 0;
  }

  .achievement-date {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .dashboard {
      padding: var(--spacing-4);
    }

    .welcome-section {
      flex-direction: column;
      text-align: center;
      gap: var(--spacing-4);
    }

    .quick-actions {
      width: 100%;
      justify-content: center;
    }

    .quick-actions .btn {
      flex: 1;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .goal-status {
      flex-direction: column;
      text-align: center;
      gap: var(--spacing-3);
    }

    .section-header {
      flex-direction: column;
      gap: var(--spacing-2);
      align-items: stretch;
    }

    .achievements-grid {
      grid-template-columns: 1fr;
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>



