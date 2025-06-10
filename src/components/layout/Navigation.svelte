






<script>
  import { onMount } from 'svelte';
  import { Home, BookOpen, Trophy, User, Menu, X, Bell, Settings } from 'lucide-svelte';
  
  export let currentPage = 'home';
  
  let isMenuOpen = false;
  let isMobile = false;
  let notificationCount = 0;
  let isOnline = true;
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'lessons', label: 'Lessons', icon: BookOpen, href: '/lessons' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, href: '/achievements' },
    { id: 'profile', label: 'Profile', icon: User, href: '/profile' }
  ];
  
  onMount(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Listen for connection status
    window.addEventListener('connectionChange', handleConnectionChange);
    
    // Listen for notification updates
    window.addEventListener('notificationUpdate', handleNotificationUpdate);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('connectionChange', handleConnectionChange);
      window.removeEventListener('notificationUpdate', handleNotificationUpdate);
    };
  });
  
  function checkMobile() {
    isMobile = window.innerWidth < 768;
    if (!isMobile) {
      isMenuOpen = false;
    }
  }
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  function closeMenu() {
    isMenuOpen = false;
  }
  
  function handleConnectionChange(event) {
    isOnline = event.detail.online;
  }
  
  function handleNotificationUpdate(event) {
    notificationCount = event.detail.count || 0;
  }
  
  function handleNavClick(item) {
    currentPage = item.id;
    closeMenu();
    
    // Dispatch navigation event
    window.dispatchEvent(new CustomEvent('navigate', {
      detail: { page: item.id, href: item.href }
    }));
  }
</script>

<nav class="navbar" class:menu-open={isMenuOpen}>
  <div class="nav-container">
    <!-- Logo and brand -->
    <div class="nav-brand">
      <a href="/" class="brand-link" on:click={() => handleNavClick(navItems[0])}>
        <div class="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="url(#logoGradient)" />
            <path d="M12 20l4-4-4-4M16 20h4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea" />
                <stop offset="100%" style="stop-color:#764ba2" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="brand-text">LingoQuest</span>
      </a>
      
      <!-- Connection status indicator -->
      {#if !isOnline}
        <div class="offline-indicator" title="Offline mode">
          <div class="offline-dot"></div>
        </div>
      {/if}
    </div>
    
    <!-- Mobile menu toggle -->
    {#if isMobile}
      <button class="menu-toggle" on:click={toggleMenu} aria-label="Toggle menu">
        {#if isMenuOpen}
          <X size={24} />
        {:else}
          <Menu size={24} />
        {/if}
      </button>
    {/if}
    
    <!-- Navigation links -->
    <div class="nav-links" class:mobile-open={isMenuOpen}>
      {#each navItems as item}
        <a 
          href={item.href}
          class="nav-link"
          class:active={currentPage === item.id}
          on:click|preventDefault={() => handleNavClick(item)}
        >
          <svelte:component this={item.icon} size={20} />
          <span class="nav-text">{item.label}</span>
        </a>
      {/each}
      
      <!-- Additional actions -->
      <div class="nav-actions">
        <button class="action-btn notification-btn" title="Notifications">
          <Bell size={20} />
          {#if notificationCount > 0}
            <span class="notification-badge">{notificationCount}</span>
          {/if}
        </button>
        
        <button class="action-btn settings-btn" title="Settings">
          <Settings size={20} />
        </button>
      </div>
    </div>
  </div>
</nav>

<!-- Mobile menu overlay -->
{#if isMobile && isMenuOpen}
  <div class="menu-overlay" on:click={closeMenu}></div>
{/if}

<style>
  .navbar {
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(10px);
  }
  
  .nav-container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--spacing-4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--navbar-height);
  }
  
  .nav-brand {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
  }
  
  .brand-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    text-decoration: none;
    color: var(--text-color);
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-lg);
    transition: color var(--transition-fast);
  }
  
  .brand-link:hover {
    color: var(--primary-color);
  }
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .brand-text {
    font-weight: var(--font-weight-bold);
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .offline-indicator {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }
  
  .offline-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--warning-color);
    animation: pulse 2s infinite;
  }
  
  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2);
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    border-radius: var(--border-radius);
    transition: background-color var(--transition-fast);
  }
  
  .menu-toggle:hover {
    background: var(--bg-secondary);
  }
  
  .nav-links {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2) var(--spacing-3);
    text-decoration: none;
    color: var(--text-secondary);
    font-weight: var(--font-weight-medium);
    border-radius: var(--border-radius);
    transition: all var(--transition-fast);
    position: relative;
  }
  
  .nav-link:hover {
    color: var(--primary-color);
    background: var(--primary-color-20);
  }
  
  .nav-link.active {
    color: var(--primary-color);
    background: var(--primary-color-20);
  }
  
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background: var(--primary-color);
    border-radius: 50%;
  }
  
  .nav-text {
    font-size: var(--font-size-sm);
  }
  
  .nav-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    margin-left: var(--spacing-4);
    padding-left: var(--spacing-4);
    border-left: 1px solid var(--border-color);
  }
  
  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2);
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: var(--border-radius);
    transition: all var(--transition-fast);
    position: relative;
  }
  
  .action-btn:hover {
    color: var(--primary-color);
    background: var(--primary-color-20);
  }
  
  .notification-badge {
    position: absolute;
    top: 0;
    right: 0;
    background: var(--error-color);
    color: white;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    padding: 2px 6px;
    border-radius: var(--border-radius-full);
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(50%, -50%);
  }
  
  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-overlay);
    z-index: var(--z-modal-backdrop);
  }
  
  /* Mobile styles */
  @media (max-width: 768px) {
    .nav-links {
      position: fixed;
      top: var(--navbar-height);
      left: 0;
      right: 0;
      background: var(--bg-primary);
      border-top: 1px solid var(--border-color);
      flex-direction: column;
      padding: var(--spacing-4);
      gap: var(--spacing-1);
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all var(--transition-base);
      box-shadow: var(--shadow-lg);
    }
    
    .nav-links.mobile-open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
    
    .nav-link {
      width: 100%;
      justify-content: flex-start;
      padding: var(--spacing-3) var(--spacing-4);
      font-size: var(--font-size-base);
    }
    
    .nav-link.active::after {
      display: none;
    }
    
    .nav-actions {
      width: 100%;
      justify-content: center;
      margin-top: var(--spacing-4);
      padding-top: var(--spacing-4);
      border-top: 1px solid var(--border-color);
      border-left: none;
      margin-left: 0;
      padding-left: 0;
    }
    
    .action-btn {
      padding: var(--spacing-3);
    }
  }
  
  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .nav-links {
      transition: none;
    }
    
    .offline-dot {
      animation: none;
    }
  }
</style>


