





<!--
  Purpose: Reusable loading component with spinner and customizable text
  Key features: Animated spinner, customizable message, accessibility support, responsive design
  Dependencies: Global CSS variables, fade-in animations
  Related helpers: Used across all components during async operations
  Function names: None (pure component)
  License: MIT - https://opensource.org/licenses/MIT
  Created: 2025-06-10
-->

<script>
  export let message = 'Loading...';
  export let size = 'medium'; // 'small', 'medium', 'large'
  export let showSpinner = true;
  export let fullScreen = false;
  export let color = 'primary'; // 'primary', 'secondary', 'white'
</script>

<div 
  class="loading-container" 
  class:full-screen={fullScreen}
  class:size-small={size === 'small'}
  class:size-large={size === 'large'}
  role="status" 
  aria-live="polite"
  aria-label={message}
>
  {#if showSpinner}
    <div 
      class="spinner" 
      class:spinner-small={size === 'small'}
      class:spinner-large={size === 'large'}
      class:spinner-primary={color === 'primary'}
      class:spinner-secondary={color === 'secondary'}
      class:spinner-white={color === 'white'}
      aria-hidden="true"
    ></div>
  {/if}
  
  {#if message}
    <span 
      class="loading-text"
      class:text-small={size === 'small'}
      class:text-large={size === 'large'}
      class:text-primary={color === 'primary'}
      class:text-secondary={color === 'secondary'}
      class:text-white={color === 'white'}
    >
      {message}
    </span>
  {/if}
</div>

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-3);
    padding: var(--spacing-4);
    min-height: 120px;
  }

  .full-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    z-index: 9999;
    min-height: 100vh;
  }

  .size-small {
    min-height: 80px;
    gap: var(--spacing-2);
    padding: var(--spacing-3);
  }

  .size-large {
    min-height: 200px;
    gap: var(--spacing-4);
    padding: var(--spacing-6);
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid transparent;
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .spinner-small {
    width: 24px;
    height: 24px;
    border-width: 2px;
  }

  .spinner-large {
    width: 48px;
    height: 48px;
    border-width: 4px;
  }

  .spinner-primary {
    border-top-color: var(--primary-color);
  }

  .spinner-secondary {
    border-top-color: var(--text-secondary);
  }

  .spinner-white {
    border-top-color: white;
  }

  .loading-text {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    text-align: center;
    opacity: 0.8;
  }

  .text-small {
    font-size: var(--font-size-sm);
  }

  .text-large {
    font-size: var(--font-size-lg);
  }

  .text-primary {
    color: var(--text-color);
  }

  .text-secondary {
    color: var(--text-secondary);
  }

  .text-white {
    color: white;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Fade in animation */
  .loading-container {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
      border-top: 3px solid var(--primary-color);
    }
    
    .loading-container {
      animation: none;
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .full-screen {
      background: rgba(0, 0, 0, 0.9);
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .spinner {
      border-width: 4px;
    }
    
    .loading-text {
      font-weight: var(--font-weight-bold);
    }
  }
</style>







