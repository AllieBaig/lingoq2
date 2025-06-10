




<!--
  Purpose: Reusable modal dialog with overlay, animations, and accessibility features
  Key features: Backdrop click to close, ESC key support, focus management, customizable sizes
  Dependencies: Global CSS variables, fade/slide animations
  Related helpers: Used for confirmations, forms, content display across app
  Function names: handleBackdropClick, handleKeydown, handleClose
  License: MIT - https://opensource.org/licenses/MIT
  Created: 2025-06-10
-->

<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  export let isOpen = false;
  export let title = '';
  export let size = 'medium'; // 'small', 'medium', 'large', 'fullscreen'
  export let showCloseButton = true;
  export let closeOnBackdrop = true;
  export let closeOnEscape = true;
  export let showHeader = true;
  export let showFooter = false;

  const dispatch = createEventDispatcher();
  let modalElement;
  let previouslyFocused;

  function handleClose() {
    dispatch('close');
  }

  function handleBackdropClick(event) {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handleKeydown(event) {
    if (closeOnEscape && event.key === 'Escape') {
      handleClose();
    }

    // Trap focus within modal
    if (event.key === 'Tab') {
      const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    }
  }

  onMount(() => {
    if (isOpen) {
      previouslyFocused = document.activeElement;
      document.body.style.overflow = 'hidden';
      
      // Focus first focusable element or modal itself
      setTimeout(() => {
        const firstFocusable = modalElement.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          modalElement.focus();
        }
      }, 100);
    }
  });

  onDestroy(() => {
    if (previouslyFocused) {
      previouslyFocused.focus();
    }
    document.body.style.overflow = '';
  });

  $: if (isOpen) {
    document.body.style.overflow = 'hidden';
    previouslyFocused = document.activeElement;
  } else {
    document.body.style.overflow = '';
    if (previouslyFocused) {
      previouslyFocused.focus();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div 
    class="modal-overlay" 
    on:click={handleBackdropClick}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? 'modal-title' : null}
    tabindex="-1"
  >
    <div 
      class="modal-container"
      class:size-small={size === 'small'}
      class:size-medium={size === 'medium'}
      class:size-large={size === 'large'}
      class:size-fullscreen={size === 'fullscreen'}
      bind:this={modalElement}
    >
      {#if showHeader}
        <div class="modal-header">
          {#if title}
            <h2 id="modal-title" class="modal-title">{title}</h2>
          {/if}
          
          <slot name="header" />
          
          {#if showCloseButton}
            <button 
              class="modal-close-button"
              on:click={handleClose}
              aria-label="Close modal"
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          {/if}
        </div>
      {/if}

      <div class="modal-body">
        <slot />
      </div>

      {#if showFooter || $$slots.footer}
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--spacing-4);
    box-sizing: border-box;
    animation: fadeIn 0.2s ease-out;
  }

  .modal-container {
    background: var(--bg-primary);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease-out;
    border: 1px solid var(--border-color);
  }

  .size-small {
    width: 100%;
    max-width: 400px;
  }

  .size-medium {
    width: 100%;
    max-width: 600px;
  }

  .size-large {
    width: 100%;
    max-width: 800px;
  }

  .size-fullscreen {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    border-radius: 0;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-6);
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
  }

  .modal-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color);
    margin: 0;
  }

  .modal-close-button {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: var(--spacing-2);
    border-radius: var(--border-radius);
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close-button:hover {
    background: var(--bg-tertiary);
    color: var(--text-color);
  }

  .modal-close-button:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .modal-body {
    flex: 1;
    padding: var(--spacing-6);
    overflow-y: auto;
    color: var(--text-color);
  }

  .modal-footer {
    padding: var(--spacing-6);
    border-top: 1px solid var(--border-color);
    background: var(--bg-secondary);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-3);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .modal-overlay {
      padding: var(--spacing-2);
    }

    .modal-container {
      width: 100%;
      max-width: none;
      max-height: 95vh;
    }

    .size-fullscreen {
      height: 100vh;
      max-height: 100vh;
    }

    .modal-header,
    .modal-body,
    .modal-footer {
      padding: var(--spacing-4);
    }

    .modal-title {
      font-size: var(--font-size-base);
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .modal-overlay {
      animation: none;
    }

    .modal-container {
      animation: none;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .modal-container {
      border: 2px solid var(--text-color);
    }

    .modal-header,
    .modal-footer {
      border-color: var(--text-color);
    }
  }
</style>


