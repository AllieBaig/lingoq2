




<script>
  export let current = 0;
  export let max = 100;
  export let label = '';
  export let color = 'primary';
  export let size = 'medium';
  export let showPercentage = true;
  export let animated = false;

  $: percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  $: colorClass = `progress-${color}`;
  $: sizeClass = `progress-${size}`;
</script>

<div class="progress-container {sizeClass}">
  {#if label}
    <div class="progress-label">
      <span>{label}</span>
      {#if showPercentage}
        <span class="progress-percentage">{Math.round(percentage)}%</span>
      {/if}
    </div>
  {/if}
  
  <div class="progress-bar">
    <div 
      class="progress-fill {colorClass} {animated ? 'animated' : ''}"
      style="width: {percentage}%"
    >
      {#if !label && showPercentage}
        <span class="progress-text">{Math.round(percentage)}%</span>
      {/if}
    </div>
  </div>
</div>

<style>
  .progress-container {
    width: 100%;
    margin: 0.5rem 0;
  }

  .progress-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary, #333);
  }

  .progress-percentage {
    color: var(--text-secondary, #666);
  }

  .progress-bar {
    width: 100%;
    background-color: var(--bg-secondary, #e5e7eb);
    border-radius: 0.5rem;
    overflow: hidden;
    position: relative;
  }

  .progress-fill {
    height: 100%;
    border-radius: 0.5rem;
    transition: width 0.3s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .progress-fill.animated {
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
    animation: progress-stripes 1s linear infinite;
  }

  .progress-text {
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  /* Size variants */
  .progress-small .progress-bar {
    height: 0.5rem;
  }

  .progress-small .progress-text {
    font-size: 0.625rem;
  }

  .progress-medium .progress-bar {
    height: 0.75rem;
  }

  .progress-large .progress-bar {
    height: 1rem;
  }

  .progress-large .progress-text {
    font-size: 0.875rem;
  }

  /* Color variants */
  .progress-primary {
    background-color: var(--primary-color, #3b82f6);
  }

  .progress-success {
    background-color: var(--success-color, #10b981);
  }

  .progress-warning {
    background-color: var(--warning-color, #f59e0b);
  }

  .progress-danger {
    background-color: var(--danger-color, #ef4444);
  }

  .progress-health {
    background-color: #dc2626;
  }

  .progress-mana {
    background-color: #2563eb;
  }

  .progress-experience {
    background-color: #7c3aed;
  }

  .progress-energy {
    background-color: #059669;
  }

  @keyframes progress-stripes {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 1rem 0;
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .progress-label {
      font-size: 0.75rem;
    }

    .progress-small .progress-bar {
      height: 0.375rem;
    }

    .progress-medium .progress-bar {
      height: 0.5rem;
    }

    .progress-large .progress-bar {
      height: 0.75rem;
    }
  }
</style>




