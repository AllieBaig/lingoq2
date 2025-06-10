






<!--
  Purpose: Reusable card component for displaying content in organized, visually appealing containers
  Key features: Header/body/footer sections, hover effects, loading states, clickable variants, shadow levels
  Dependencies: None (pure Svelte component)
  Related helpers: None
  Function names: handleClick, handleKeydown
  MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
  Timestamp: 2025-06-10 14:35 | File: src/components/Card.svelte
-->

<script>
  export let variant = 'default';
  export let shadow = 'sm';
  export let padding = 'md';
  export let clickable = false;
  export let loading = false;
  export let disabled = false;
  export let href = null;
  export let target = null;
  export let rounded = 'lg';

  // Handle click events for clickable cards
  function handleClick(event) {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    
    if (clickable && !href) {
      // Dispatch custom click event for clickable cards without href
      const customEvent = new CustomEvent('cardClick', {
        detail: { originalEvent: event }
      });
      event.target.dispatchEvent(customEvent);
    }
  }

  // Handle keyboard navigation for clickable cards
  function handleKeydown(event) {
    if ((event.key === 'Enter' || event.key === ' ') && clickable) {
      event.preventDefault();
      handleClick(event);
    }
  }

  // Compute card classes
  $: classes = [
    'card',
    `card-${variant}`,
    `card-shadow-${shadow}`,
    `card-padding-${padding}`,
    `card-rounded-${rounded}`,
    clickable && 'card-clickable',
    loading && 'card-loading',
    disabled && 'card-disabled'
  ].filter(Boolean).join(' ');

  // Determine if this should be a link
  $: isLink = href && !disabled && !loading;
</script>

{#if isLink}
  <a 
    {href} 
    {target}
    class={classes}
    on:click={handleClick}
    on:keydown={handleKeydown}
  >
    {#if loading}
      <div class="card-loader">
        <div class="card-spinner"></div>
      </div>
    {:else}
      <slot />
    {/if}
  </a>
{:else}
  <div 
    class={classes}
    role={clickable ? 'button' : null}
    tabindex={clickable ? 0 : null}
    on:click={handleClick}
    on:keydown={handleKeydown}
  >
    {#if loading}
      <div class="card-loader">
        <div class="card-spinner"></div>
      </div>
    {:else}
      <slot />
    {/if}
  </div>
{/if}

<style>
  .card {
    display: block;
    background: white;
    border: 1px solid #e5e7eb;
    transition: all 0.2s ease-in-out;
    position: relative;
    overflow: hidden;
    width: 100%;
  }

  .card:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }

  /* Variants */
  .card-default {
    background: white;
    border-color: #e5e7eb;
  }

  .card-primary {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
    border-color: rgba(99, 102, 241, 0.2);
  }

  .card-success {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%);
    border-color: rgba(16, 185, 129, 0.2);
  }

  .card-warning {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%);
    border-color: rgba(245, 158, 11, 0.2);
  }

  .card-danger {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%);
    border-color: rgba(239, 68, 68, 0.2);
  }

  .card-ghost {
    background: transparent;
    border-color: transparent;
  }

  /* Shadows */
  .card-shadow-none {
    box-shadow: none;
  }

  .card-shadow-sm {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }

  .card-shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .card-shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .card-shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  /* Padding */
  .card-padding-none {
    padding: 0;
  }

  .card-padding-sm {
    padding: 1rem;
  }

  .card-padding-md {
    padding: 1.5rem;
  }

  .card-padding-lg {
    padding: 2rem;
  }

  .card-padding-xl {
    padding: 2.5rem;
  }

  /* Rounded corners */
  .card-rounded-none {
    border-radius: 0;
  }

  .card-rounded-sm {
    border-radius: 0.25rem;
  }

  .card-rounded-md {
    border-radius: 0.375rem;
  }

  .card-rounded-lg {
    border-radius: 0.5rem;
  }

  .card-rounded-xl {
    border-radius: 0.75rem;
  }

  .card-rounded-2xl {
    border-radius: 1rem;
  }

  /* States */
  .card-clickable {
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }

  .card-clickable:hover:not(.card-disabled):not(.card-loading) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }

  .card-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  .card-loading {
    cursor: wait;
    pointer-events: none;
  }

  /* Loading state */
  .card-loader {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    color: #6b7280;
  }

  .card-spinner {
    width: 2rem;
    height: 2rem;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #6366f1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .card-default {
      background: #1f2937;
      border-color: #374151;
    }

    .card-primary {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
      border-color: rgba(99, 102, 241, 0.3);
    }

    .card-success {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
      border-color: rgba(16, 185, 129, 0.3);
    }

    .card-warning {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%);
      border-color: rgba(245, 158, 11, 0.3);
    }

    .card-danger {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
      border-color: rgba(239, 68, 68, 0.3);
    }

    .card-loader {
      color: #9ca3af;
    }

    .card-spinner {
      border-color: #374151;
      border-top-color: #6366f1;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .card {
      transition: none;
    }

    .card-clickable:hover {
      transform: none;
    }

    .card-spinner {
      animation: none;
      border-top: 2px solid #6366f1;
      border-right: 2px solid #6366f1;
    }
  }
</style>



