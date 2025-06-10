





<!--
  Purpose: Reusable button component with multiple variants, sizes, and states for consistent UI interactions
  Key features: Multiple variants (primary, secondary, success, danger, warning, ghost), loading states, icon support, accessibility
  Dependencies: None (pure Svelte component)
  Related helpers: None
  Function names: handleClick
  MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
  Timestamp: 2025-06-10 14:32 | File: src/components/Button.svelte
-->

<script>
  export let variant = 'primary';
  export let size = 'md';
  export let disabled = false;
  export let loading = false;
  export let type = 'button';
  export let href = null;
  export let target = null;
  export let fullWidth = false;
  export let icon = null;
  export let iconPosition = 'left';

  // Handle click events
  function handleClick(event) {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
  }

  // Compute button classes
  $: classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    loading && 'btn-loading',
    disabled && 'btn-disabled'
  ].filter(Boolean).join(' ');

  // Determine if this should be a link or button
  $: isLink = href && !disabled && !loading;
</script>

{#if isLink}
  <a 
    {href} 
    {target}
    class={classes}
    role="button"
    tabindex="0"
    on:click={handleClick}
    on:keydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e);
      }
    }}
  >
    {#if loading}
      <span class="btn-spinner"></span>
    {:else if icon && iconPosition === 'left'}
      <span class="btn-icon btn-icon-left">{@html icon}</span>
    {/if}
    
    <slot />
    
    {#if !loading && icon && iconPosition === 'right'}
      <span class="btn-icon btn-icon-right">{@html icon}</span>
    {/if}
  </a>
{:else}
  <button 
    {type}
    {disabled}
    class={classes}
    on:click={handleClick}
  >
    {#if loading}
      <span class="btn-spinner"></span>
    {:else if icon && iconPosition === 'left'}
      <span class="btn-icon btn-icon-left">{@html icon}</span>
    {/if}
    
    <slot />
    
    {#if !loading && icon && iconPosition === 'right'}
      <span class="btn-icon btn-icon-right">{@html icon}</span>
    {/if}
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    position: relative;
    overflow: hidden;
    user-select: none;
    white-space: nowrap;
  }

  .btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }

  /* Variants */
  .btn-primary {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.25);
  }

  .btn-primary:hover:not(.btn-disabled):not(.btn-loading) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px 0 rgba(99, 102, 241, 0.35);
  }

  .btn-secondary {
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .btn-secondary:hover:not(.btn-disabled):not(.btn-loading) {
    background: #f9fafb;
    border-color: #6366f1;
    color: #6366f1;
  }

  .btn-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.25);
  }

  .btn-success:hover:not(.btn-disabled):not(.btn-loading) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px 0 rgba(16, 185, 129, 0.35);
  }

  .btn-danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: 0 4px 14px 0 rgba(239, 68, 68, 0.25);
  }

  .btn-danger:hover:not(.btn-disabled):not(.btn-loading) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px 0 rgba(239, 68, 68, 0.35);
  }

  .btn-warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.25);
  }

  .btn-warning:hover:not(.btn-disabled):not(.btn-loading) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px 0 rgba(245, 158, 11, 0.35);
  }

  .btn-ghost {
    background: transparent;
    color: #6366f1;
    border: 1px solid transparent;
  }

  .btn-ghost:hover:not(.btn-disabled):not(.btn-loading) {
    background: rgba(99, 102, 241, 0.1);
    border-color: #6366f1;
  }

  /* Sizes */
  .btn-xs {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    gap: 0.25rem;
  }

  .btn-sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
    gap: 0.375rem;
  }

  .btn-md {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    gap: 0.5rem;
  }

  .btn-lg {
    padding: 1rem 1.5rem;
    font-size: 1rem;
    gap: 0.5rem;
  }

  .btn-xl {
    padding: 1.25rem 2rem;
    font-size: 1.125rem;
    gap: 0.75rem;
  }

  /* States */
  .btn-full-width {
    width: 100%;
  }

  .btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  .btn-loading {
    cursor: wait;
    color: transparent;
  }

  /* Icons */
  .btn-icon {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  .btn-icon :global(svg) {
    width: 1em;
    height: 1em;
    fill: currentColor;
  }

  /* Spinner */
  .btn-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .btn-secondary {
      background: #374151;
      color: #f9fafb;
      border-color: #4b5563;
    }

    .btn-secondary:hover:not(.btn-disabled):not(.btn-loading) {
      background: #4b5563;
      border-color: #6366f1;
      color: #a5b4fc;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .btn {
      transition: none;
    }

    .btn-spinner {
      animation: none;
      border-top: 2px solid currentColor;
      border-right: 2px solid currentColor;
    }
  }
</style>



