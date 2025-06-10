




<script>
  export let currentScore = 0;
  export let totalQuestions = 0;
  export let currentQuestion = 0;
  export let streak = 0;
  export let timeRemaining = null;
  export let showProgress = true;
  export let showStreak = true;
  export let showTimer = false;
  
  $: progressPercentage = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;
  $: accuracy = currentQuestion > 0 ? Math.round((currentScore / currentQuestion) * 100) : 0;
  
  function formatTime(seconds) {
    if (seconds == null) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
</script>

<div class="score-display">
  <div class="score-grid">
    <!-- Main Score -->
    <div class="score-item primary">
      <div class="score-value">{currentScore}</div>
      <div class="score-label">Score</div>
    </div>
    
    <!-- Accuracy -->
    <div class="score-item">
      <div class="score-value">{accuracy}%</div>
      <div class="score-label">Accuracy</div>
    </div>
    
    <!-- Streak -->
    {#if showStreak}
      <div class="score-item" class:streak-active={streak > 0}>
        <div class="score-value">
          {streak}
          {#if streak > 2}
            <span class="streak-fire">🔥</span>
          {/if}
        </div>
        <div class="score-label">Streak</div>
      </div>
    {/if}
    
    <!-- Timer -->
    {#if showTimer && timeRemaining !== null}
      <div class="score-item timer" class:time-warning={timeRemaining <= 30}>
        <div class="score-value">{formatTime(timeRemaining)}</div>
        <div class="score-label">Time Left</div>
      </div>
    {/if}
  </div>
  
  <!-- Progress Bar -->
  {#if showProgress && totalQuestions > 0}
    <div class="progress-section">
      <div class="progress-info">
        <span class="progress-text">Question {currentQuestion} of {totalQuestions}</span>
        <span class="progress-percentage">{Math.round(progressPercentage)}%</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          style="width: {progressPercentage}%"
        ></div>
      </div>
    </div>
  {/if}
</div>

<style>
  .score-display {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
  }
  
  .score-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .score-item {
    text-align: center;
    padding: 0.75rem;
    border-radius: 8px;
    background: #f8fafc;
    transition: all 0.3s ease;
  }
  
  .score-item.primary {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
  }
  
  .score-item.streak-active {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
  }
  
  .score-item.timer {
    background: #f3f4f6;
  }
  
  .score-item.time-warning {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    animation: pulse 1s infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
  
  .score-value {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
  }
  
  .score-item.primary .score-value {
    font-size: 2rem;
  }
  
  .score-label {
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.8;
  }
  
  .streak-fire {
    font-size: 1rem;
    animation: flicker 0.5s ease-in-out infinite alternate;
  }
  
  @keyframes flicker {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.1);
    }
  }
  
  .progress-section {
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
  }
  
  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .progress-text {
    font-weight: 500;
  }
  
  .progress-percentage {
    font-weight: 600;
    color: #3b82f6;
  }
  
  .progress-bar {
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 3px;
    transition: width 0.5s ease;
  }
  
  @media (max-width: 640px) {
    .score-display {
      padding: 1rem;
      margin-bottom: 1rem;
    }
    
    .score-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
    
    .score-item {
      padding: 0.5rem;
    }
    
    .score-value {
      font-size: 1.25rem;
    }
    
    .score-item.primary .score-value {
      font-size: 1.5rem;
    }
    
    .score-label {
      font-size: 0.625rem;
    }
  }
  
  @media (max-width: 480px) {
    .score-grid {
      grid-template-columns: 1fr;
    }
    
    .score-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
    }
    
    .score-value {
      margin-bottom: 0;
    }
    
    .score-label {
      text-transform: none;
      font-size: 0.875rem;
      opacity: 1;
    }
  }
</style>





