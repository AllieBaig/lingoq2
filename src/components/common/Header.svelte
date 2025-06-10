

<!--
Purpose: Main navigation header component with user menu, theme toggle, and PWA install prompt
Key features: Responsive navigation, offline indicator, user authentication, theme switching, PWA installation
Dependencies: Svelte stores (userStore, themeStore), CSS variables, SVG icons
Related helpers: Event dispatchers, onMount lifecycle, browser APIs
Function names: toggleMenu, closeMenu, toggleTheme, handleInstall, handleNavigation, handleLogout
MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
Timestamp: 2025-06-10 14:30 | File: src/components/Header.svelte
-->

<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { userStore, themeStore } from '../stores/index.js';
  
  const dispatch = createEventDispatcher();
  
  let isMenuOpen = false;
  let showInstallPrompt = false;
  let deferredPrompt = null;
  let isOnline = navigator.onLine;
  
  // Subscribe to stores
  $: user = $userStore;
  $: theme = $themeStore;
  
  onMount(() => {
    // Listen for install prompt
    window.addEventListener('showInstallPrompt', (event) => {
      showInstallPrompt = true;
      deferredPrompt = event.detail.prompt;
    });
    
    // Listen for connection changes
    window.addEventListener('connectionChange', (event) => {
      isOnline = event.detail.online;
    });
    
    // Hide install prompt after installation
    window.addEventListener('hideInstallPrompt', () => {
      showInstallPrompt = false;
      deferredPrompt = null;
    });
  });
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  function closeMenu() {
    isMenuOpen = false;
  }
  
  function toggleTheme() {
    themeStore.toggle();
  }
  
  async function handleInstall() {
    if (!deferredPrompt) return;
    
    try {
      const result = await deferredPrompt.prompt();
      console.log('Install prompt result:', result.outcome);
      
      if (result.outcome === 'accepted') {
        showInstallPrompt = false;
        deferredPrompt = null;
      }
    } catch (error) {
      console.error('Install prompt error:', error);
    }
  }
  
  function handleNavigation(section) {
    dispatch('navigate', { section });
    closeMenu();
  }
  
  function handleLogout() {
    userStore.logout();
    closeMenu();
  }
</script>

<header class="header">
  <div class="container">
    <div class="header-content">
      <!-- Logo and Brand -->
      <div class="brand">
        <div class="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 2L30 9L16 16L2 9L16 2Z" fill="currentColor" opacity="0.8"/>
            <path d="M2 23L16 30L30 23L16 16L2 23Z" fill="currentColor"/>
            <path d="M2 16L16 23L30 16" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </div>
        <h1 class="brand-name">LingoQuest</h1>
      </div>
      
      <!-- Connection Status -->
      {#if !isOnline}
        <div class="connection-status offline">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM8 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
            <path d="M8 4C5.79 4 4 5.79 4 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
          </svg>
          <span>Offline</span>
        </div>
      {/if}
      
      <!-- Navigation -->
      <nav class="nav" class:open={isMenuOpen}>
        <ul class="nav-list">
          <li>
            <button class="nav-link" on:click={() => handleNavigation('dashboard')}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              Dashboard
            </button>
          </li>
          <li>
            <button class="nav-link" on:click={() => handleNavigation('lessons')}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Lessons
            </button>
          </li>
          <li>
            <button class="nav-link" on:click={() => handleNavigation('progress')}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2V6h2v1h-2zm0 2v1h2V9H7zm0 3v1h2v-1H7z"/>
              </svg>
              Progress
            </button>
          </li>
          <li>
            <button class="nav-link" on:click={() => handleNavigation('profile')}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
              </svg>
              Profile
            </button>
          </li>
        </ul>
      </nav>
      
      <!-- Action Buttons -->
      <div class="actions">
        <!-- Install Button -->
        {#if showInstallPrompt}
          <button class="btn btn-sm btn-primary install-btn" on:click={handleInstall}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
            </svg>
            Install
          </button>
        {/if}
        
        <!-- Theme Toggle -->
        <button class="btn btn-icon" on:click={toggleTheme} title="Toggle Theme">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {#if theme === 'dark'}
              <path d="M10 2L13.09 8.26L20 9L14 14.74L15.18 21.02L10 18L4.82 21.02L6 14.74L0 9L6.91 8.26L10 2Z"/>
            {:else}
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
            {/if}
          </svg>
        </button>
        
        <!-- User Menu -->
        {#if user}
          <div class="user-menu">
            <button class="user-avatar" on:click={toggleMenu}>
              <img src={user.avatar || '/default-avatar.png'} alt={user.name} />
              <span class="user-name">{user.name}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
            
            {#if isMenuOpen}
              <div class="dropdown-menu">
                <button class="dropdown-item" on:click={() => handleNavigation('settings')}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                  </svg>
                  Settings
                </button>
                <button class="dropdown-item" on:click={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                  </svg>
                  Logout
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <button class="btn btn-primary" on:click={() => handleNavigation('login')}>
            Login
          </button>
        {/if}
        
        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" on:click={toggleMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            {#if isMenuOpen}
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            {:else}
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            {/if}
          </svg>
        </button>
      </div>
    </div>
  </div>
</header>

<style>
  .header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: all var(--transition-fast);
  }
  
  .container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--spacing-4);
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    gap: var(--spacing-4);
  }
  
  .brand {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    color: var(--primary-color);
    font-weight: var(--font-weight-bold);
  }
  
  .logo {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .brand-name {
    font-size: var(--font-size-xl);
    margin: 0;
  }
  
  .connection-status {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    font-size: var(--font-size-sm);
    padding: var(--spacing-1) var(--spacing-2);
    border-radius: var(--border-radius);
    background: var(--warning-color);
    color: white;
  }
  
  .connection-status.offline {
    background: var(--error-color);
  }
  
  .nav {
    display: flex;
    align-items: center;
  }
  
  .nav-list {
    display: flex;
    list-style: none;
    gap: var(--spacing-2);
    margin: 0;
    padding: 0;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2) var(--spacing-3);
    border-radius: var(--border-radius);
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .nav-link:hover {
    background: var(--bg-secondary);
    color: var(--primary-color);
  }
  
  .actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }
  
  .install-btn {
    animation: pulse 2s infinite;
  }
  
  .btn-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .btn-icon:hover {
    background: var(--primary-color);
    color: white;
  }
  
  .user-menu {
    position: relative;
  }
  
  .user-avatar {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-1);
    border-radius: var(--border-radius);
    background: none;
    border: none;
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .user-avatar:hover {
    background: var(--bg-secondary);
  }
  
  .user-avatar img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .user-name {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-color);
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-lg);
    min-width: 150px;
    z-index: 1000;
    margin-top: var(--spacing-1);
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    width: 100%;
    padding: var(--spacing-2) var(--spacing-3);
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: var(--font-size-sm);
    color: var(--text-color);
  }
  
  .dropdown-item:hover {
    background: var(--bg-secondary);
    color: var(--primary-color);
  }
  
  .mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    padding: var(--spacing-1);
  }
  
  @media (max-width: 768px) {
    .nav {
      display: none;
    }
    
    .nav.open {
      display: block;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--bg-primary);
      border-top: 1px solid var(--border-color);
      box-shadow: var(--shadow-lg);
    }
    
    .nav-list {
      flex-direction: column;
      padding: var(--spacing-4);
    }
    
    .nav-link {
      justify-content: flex-start;
      width: 100%;
      padding: var(--spacing-3);
    }
    
    .mobile-menu-toggle {
      display: block;
    }
    
    .user-name {
      display: none;
    }
    
    .install-btn {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    .brand-name {
      display: none;
    }
    
    .connection-status {
      display: none;
    }
  }
</style>


