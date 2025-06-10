




<!--
  Purpose: Reusable lesson card component for displaying individual lessons with progress tracking
  Key features: Interactive lesson cards, progress indicators, difficulty levels, completion status
  Dependencies: Lucide icons, global CSS variables, card styling
  Related helpers: GameState, ProgressTracker, LessonManager
  Function names: handleLessonClick, formatDuration, getLevelColor, getProgressPercentage
  MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
  Timestamp: 2025-06-10 14:30 | File: src/game/LessonCard.svelte
-->

<script>
  import { createEventDispatcher } from 'svelte';
  import { Play, Lock, CheckCircle, Clock, Star, Users } from 'lucide-svelte';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let lesson = {};
  export let isLocked = false;
  export let isCompleted = false;
  export let progress = 0;
  export let showProgress = true;
  export let compact = false;
  
  // Reactive properties
  $: difficultyColor = getLevelColor(lesson.difficulty);
  $: progressPercentage = Math.round(progress * 100);
  $: estimatedTime = formatDuration(lesson.estimatedMinutes || 10);
  
  // Event handlers
  function handleLessonClick() {
    if (!isLocked) {
      dispatch('lessonClick', {
        lesson,
        lessonId: lesson.id
      });
    }
  }
  
  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLessonClick();
    }
  }
  
  // Helper functions
  function getLevelColor(difficulty) {
    const colors = {
      beginner: 'var(--level-beginner)',
      intermediate: 'var(--level-intermediate)', 
      advanced: 'var(--level-advanced)',
      expert: 'var(--level-expert)'
    };
    return colors[difficulty] || colors.beginner;
  }
  
  function formatDuration(minutes) {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
</script>

<div 
  class="lesson-card {compact ? 'compact' : ''} {isLocked ? 'locked' : ''} {isCompleted ? 'completed' : ''}"
  class:interactive={!isLocked}
  role="button"
  tabindex={isLocked ? -1 : 0}
  on:click={handleLessonClick}
  on:keydown={handleKeydown}
  aria-label="Lesson: {lesson.title}"
  aria-disabled={isLocked}
>
  <!-- Lesson Status Icon -->
  <div class="lesson-status">
    {#if isLocked}
      <Lock size={20} color="var(--text-muted)" />
    {:else if isCompleted}
      <CheckCircle size={20} color="var(--success-color)" />
    {:else}
      <Play size={20} color="var(--primary-color)" />
    {/if}
  </div>
  
  <!-- Lesson Content -->
  <div class="lesson-content">
    <!-- Header -->
    <div class="lesson-header">
      <h3 class="lesson-title">{lesson.title}</h3>
      <div class="lesson-meta">
        <span class="difficulty-badge" style="background-color: {difficultyColor}">
          {lesson.difficulty}
        </span>
        {#if lesson.rating}
          <div class="rating">
            <Star size={14} color="var(--warning-color)" fill="var(--warning-color)" />
            <span>{lesson.rating}</span>
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Description -->
    {#if !compact && lesson.description}
      <p class="lesson-description">{lesson.description}</p>
    {/if}
    
    <!-- Progress Bar -->
    {#if showProgress && progress > 0}
      <div class="progress-section">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            style="width: {progressPercentage}%"
          ></div>
        </div>
        <span class="progress-text">{progressPercentage}% complete</span>
      </div>
    {/if}
    
    <!-- Footer Info -->
    <div class="lesson-footer">
      <div class="lesson-stats">
        <div class="stat">
          <Clock size={14} />
          <span>{estimatedTime}</span>
        </div>
        {#if lesson.participantCount}
          <div class="stat">
            <Users size={14} />
            <span>{lesson.participantCount}</span>
          </div>
        {/if}
      </div>
      
      {#if lesson.xpReward}
        <div class="xp-reward">
          +{lesson.xpReward} XP
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .lesson-card {
    background: var(--bg-primary);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
    padding: var(--spacing-4);
    transition: all var(--transition-fast);
    display: flex;
    gap: var(--spacing-3);
    position: relative;
    overflow: hidden;
  }
  
  .lesson-card.interactive {
    cursor: pointer;
  }
  
  .lesson-card.interactive:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--primary-color);
  }
  
  .lesson-card.interactive:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--primary-color-20);
    border-color: var(--primary-color);
  }
  
  .lesson-card.locked {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .lesson-card.locked:hover {
    transform: none;
    box-shadow: var(--shadow-sm);
    border-color: var(--border-color);
  }
  
  .lesson-card.completed {
    border-color: var(--success-color);
    background: linear-gradient(135deg, var(--bg-primary) 0%, rgba(16, 185, 129, 0.05) 100%);
  }
  
  .lesson-card.compact {
    padding: var(--spacing-3);
  }
  
  .lesson-card.compact .lesson-content {
    gap: var(--spacing-2);
  }
  
  .lesson-status {
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    margin-top: var(--spacing-1);
  }
  
  .lesson-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }
  
  .lesson-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-2);
  }
  
  .lesson-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color);
    margin: 0;
    line-height: var(--line-height-tight);
  }
  
  .lesson-meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    flex-shrink: 0;
  }
  
  .difficulty-badge {
    padding: var(--spacing-1) var(--spacing-2);
    border-radius: var(--border-radius);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: white;
    text-transform: capitalize;
  }
  
  .rating {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }
  
  .lesson-description {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    line-height: var(--line-height-base);
    margin: 0;
  }
  
  .progress-section {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }
  
  .progress-bar {
    flex: 1;
    height: 6px;
    background: var(--bg-secondary);
    border-radius: var(--border-radius);
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: var(--primary-gradient);
    transition: width var(--transition-slow);
    border-radius: var(--border-radius);
  }
  
  .progress-text {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    flex-shrink: 0;
  }
  
  .lesson-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-2);
  }
  
  .lesson-stats {
    display: flex;
    gap: var(--spacing-4);
  }
  
  .stat {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    font-size: var(--font-size-sm);
    color: var(--text-muted);
  }
  
  .xp-reward {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--primary-color);
    background: var(--primary-color-20);
    padding: var(--spacing-1) var(--spacing-2);
    border-radius: var(--border-radius);
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .lesson-card {
      padding: var(--spacing-3);
    }
    
    .lesson-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-2);
    }
    
    .lesson-meta {
      width: 100%;
      justify-content: space-between;
    }
    
    .lesson-stats {
      gap: var(--spacing-3);
    }
    
    .lesson-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-2);
    }
  }
  
  @media (max-width: 480px) {
    .lesson-card {
      flex-direction: column;
      text-align: center;
    }
    
    .lesson-status {
      align-self: center;
      margin-top: 0;
    }
    
    .lesson-header {
      text-align: center;
    }
  }
</style>


