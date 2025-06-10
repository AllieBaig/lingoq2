



<!--
  Purpose: Responsive sidebar component for LingoQuest with navigation and user info
  Key features: Collapsible design, progress tracking, quick actions, responsive layout
  Dependencies: lucide-svelte icons, CSS variables from global styles
  Related helpers: Navigation.svelte, user progress store
  Function names: toggleSidebar, closeSidebar, handleQuickAction, updateProgress
  MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
  Timestamp: 2025-06-10 14:30 | File: src/layout/Sidebar.svelte
-->

<script>
  import { onMount } from 'svelte';
  import { 
    ChevronLeft, 
    ChevronRight, 
    Home, 
    BookOpen, 
    Trophy, 
    User, 
    Settings,
    Target,
    Clock,
    Flame,
    Star,
    TrendingUp,
    Calendar,
    Volume2,
    VolumeX
  } from 'lucide-svelte';
  
  export let isOpen = true;
  export let currentPage = 'home';
  export let userProgress = {
    level: 12,
    xp: 2850,
    streak: 15,
    dailyGoal: 50,
    dailyProgress: 32,
    completedLessons: 145,
    totalLessons: 200
  };
  
  let isMobile = false;
  let isCollapsed = false;
  let soundEnabled = true;
  let notifications = [];
  
  const navigationItems = [
    { id: 'home', label: 'Dashboard', icon: Home, href: '/', badge: null },
    { id: 'lessons', label: 'Lessons', icon: BookOpen, href: '/lessons', badge: '3' },
    { id: 'practice', label: 'Practice', icon: Target, href: '/practice', badge: null },
    { id: 'achievements', label: 'Achievements', icon: Trophy, href: '/achievements', badge: 'new' },
    { id: 'profile', label: 'Profile', icon: User, href: '/profile', badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings', badge: null }
  ];
  
  const quickActions = [
    { id: 'daily-challenge', label: 'Daily Challenge', icon: Calendar, color: 'primary' },
    { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen, color: 'success' },
    { id: 'speaking', label: 'Speaking', icon: Volume2, color: 'warning' },
    { id: 'review', label: 'Review', icon: TrendingUp, color: 'info' }
  ];
  
  onMount(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Listen for sidebar toggle events
    window.addEventListener('toggleSidebar', handleToggleSidebar);
    
    // Load user preferences
    loadUserPreferences();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('toggleSidebar', handleToggleSidebar);
    };
  });
  
  function checkMobile() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth < 1024;
    
    if (isMobile && !wasMobile) {
      isOpen = false;
    } else if (!isMobile && wasMobile) {
      isOpen = true;
      isCollapsed = false;
    }
  }
  
  function toggleSidebar() {
    if (isMobile) {
      isOpen = !isOpen;
    } else {
      isCollapsed = !isCollapsed;
    }
  }
  
  function closeSidebar() {
    if (isMobile) {
      isOpen = false;
    }
  }
  
  function handleToggleSidebar() {
    toggleSidebar();
  }
  
  function handleNavigation(item) {
    currentPage = item.id;
    
    if (isMobile) {
      closeSidebar();
    }
    
    // Dispatch navigation event
    window.dispatchEvent(new CustomEvent('navigate', {
      detail: { page: item.id, href: item.href }
    }));
  }
  
  function handleQuickAction(action) {
    console.log('Quick action clicked:', action.id);
    
    // Dispatch quick action event
    window.dispatchEvent(new CustomEvent('quickAction', {
      detail: { action: action.id, label: action.label }
    }));
    
    if (isMobile) {
      closeSidebar();
    }
  }
  
  function toggleSound() {
    soundEnabled = !soundEnabled;
    
    // Save preference
    localStorage.setItem('soundEnabled', soundEnabled.toString());
    
    // Dispatch sound toggle event
    window.dispatchEvent(new CustomEvent('soundToggle', {
      detail: { enabled: soundEnabled }
    }));
  }
  
  function loadUserPreferences() {
    const savedSoundEnabled = localStorage.getItem('soundEnabled');
    if (savedSoundEnabled !== null) {
      soundEnabled = savedSoundEnabled === 'true';
    }
    
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed !== null && !isMobile) {
      isCollapsed = savedCollapsed === 'true';
    }
  }
  
  function saveCollapsedState() {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
  }
  
  $: if (typeof window !== 'undefined') {
    saveCollapsedState();
  }
  
  $: progressPercentage = Math.round((userProgress.dailyProgress / userProgress.dailyGoal) * 100);
  $: lessonProgressPercentage = Math.round((userProgress.completedLessons / userProgress.totalLessons) * 100);
</script>

<!-- Sidebar overlay for mobile -->
{#if isMobile && isOpen}
  <div class="sidebar-overlay" on:click={closeSidebar}></div>
{/if}

<!-- Sidebar -->
<aside 
  class="sidebar" 
  class:open={isOpen} 
  class:collapsed={isCollapsed && !isMobile}
  class:mobile={isMobile}
>
  <!-- Header -->
  <div class="sidebar-header">
    {#if !isCollapsed || isMobile}
      <div class="user-info">
        <div class="user-avatar">
          <img src="/default-avatar.png" alt="User avatar" />
          <div class="level-badge">
            <Star size={12} />
            <span>{userProgress.level}</span>
          </div>
        </div>
        <div class="user-details">
          <h3 class="user-name">Language Learner</h3>
          <p class="user-xp">{userProgress.xp.toLocaleString()} XP</p>
        </div>
      </div>
    {:else}
      <div class="user-avatar-collapsed">
        <img src="/default-avatar.png" alt="User avatar" />
        <div class="level-badge-small">{userProgress.level}</div>
      </div>
    {/if}
    
    <!-- Toggle button -->
    {#if !isMobile}
      <button class="sidebar-toggle" on:click={toggleSidebar} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        {#if isCollapsed}
          <ChevronRight size={16} />
        {:else}
          <ChevronLeft size={16} />
        {/if}
      </button>
    {/if}
  </div>
  
  <!-- Progress section -->
  {#if !isCollapsed || isMobile}
    <div class="progress-section">
      <div class="daily-progress">
        <div class="progress-header">
          <span class="progress-label">Daily Goal</span>
          <span class="progress-value">{userProgress.dailyProgress}/{userProgress.dailyGoal}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progressPercentage}%"></div>
        </div>
      </div>
      
      <div class="stats-row">
        <div class="stat">
          <Flame size={16} />
          <span>{userProgress.streak} day streak</span>
        </div>
        <div class="stat">
          <Clock size={16} />
          <span>32 min today</span>
        </div>
      </div>
    </div>
  {:else}
    <div class="progress-collapsed">
      <div class="mini-progress" title="Daily progress: {progressPercentage}%">
        <div class="mini-progress-fill" style="width: {progressPercentage}%"></div>
      </div>
      <div class="streak-indicator" title="{userProgress.streak} day streak">
        <Flame size={12} />
        <span>{userProgress.streak}</span>
      </div>
    </div>
  {/if}
  
  <!-- Navigation -->
  <nav class="sidebar-nav">
    <ul class="nav-list">
      {#each navigationItems as item}
        <li class="nav-item">
          <button 
            class="nav-link" 
            class:active={currentPage === item.id}
            on:click={() => handleNavigation(item)}
            title={isCollapsed ? item.label : ''}
          >
            <div class="nav-icon">
              <svelte:component this={item.icon} size={20} />
            </div>
            {#if !isCollapsed || isMobile}
              <span class="nav-label">{item.label}</span>
              {#if item.badge}
                <span class="nav-badge" class:new={item.badge === 'new'}>{item.badge}</span>
              {/if}
            {:else if item.badge}
              <div class="nav-badge-dot"></div>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  </nav>
  
  <!-- Quick Actions -->
  {#if !isCollapsed || isMobile}
    <div class="quick-actions">
      <h4 class="section-title">Quick Actions</h4>
      <div class="action-grid">
        {#each quickActions as action}
          <button 
            class="action-btn {action.color}" 
            on:click={() => handleQuickAction(action)}
            title={action.label}
          >
            <svelte:component this={action.icon} size={16} />
            <span>{action.label}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Footer -->
  <div class="sidebar-footer">
    {#if !isCollapsed || isMobile}
      <div class="footer-stats">
        <div class="lesson-progress">
          <span class="stat-label">Lessons Completed</span>
          <div class="stat-bar">
            <div class="stat-fill" style="width: {lessonProgressPercentage}%"></div>
          </div>
          <span class="stat-text">{userProgress.completedLessons}/{userProgress.totalLessons}</span>
        </div>
      </div>
      
      <div class="footer-actions">
        <button class="footer-btn" on:click={toggleSound} title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}>
          {#if soundEnabled}
            <Volume2 size={16} />
          {:else}
            <VolumeX size={16} />
          {/if}
        </button>
      </div>
    {:else}
      <div class="footer-collapsed">
        <button class="footer-btn-small" on:click={toggleSound} title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}>
          {#if soundEnabled}
            <Volume2 size={14} />
          {:else}
            <VolumeX size={14} />
          {/if}
        </button>
      </div>
    {/if}
  </div>
</aside>

<style>
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-overlay);
    z-index: var(--z-modal-backdrop);
  }
  
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: var(--sidebar-width);
    height: 100vh;
    background: var(--bg-primary);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    transform: translateX(-100%);
    transition: all var(--transition-base);
    z-index: var(--z-fixed);
    overflow: hidden;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .sidebar.collapsed {
    width: 4rem;
  }
  
  .sidebar.mobile {
    box-shadow: var(--shadow-xl);
  }
  
  .sidebar-header {
    padding: var(--spacing-4);
    border-bottom: 1px solid var(--border-color);
    position: relative;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
  }
  
  .user-avatar {
    position: relative;
    width: 48px;
    height: 48px;
  }
  
  .user-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .level-badge {
    position: absolute;
    bottom: -2px;
    right: -2px;
    background: var(--primary-gradient);
    color: white;
    border-radius: var(--border-radius-full);
    padding: 2px 6px;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    display: flex;
    align-items: center;
    gap: 2px;
    min-width: 20px;
    height: 20px;
    justify-content: center;
  }
  
  .user-avatar-collapsed {
    width: 32px;
    height: 32px;
    position: relative;
    margin: 0 auto;
  }
  
  .user-avatar-collapsed img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .level-badge-small {
    position: absolute;
    bottom: -2px;
    right: -2px;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    font-size: 10px;
    font-weight: var(--font-weight-semibold);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .user-details {
    flex: 1;
    min-width: 0;
  }
  
  .user-name {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color);
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .user-xp {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    margin: 0;
  }
  
  .sidebar-toggle {
    position: absolute;
    top: 50%;
    right: var(--spacing-2);
    transform: translateY(-50%);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .sidebar-toggle:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
  
  .progress-section {
    padding: var(--spacing-4);
    border-bottom: 1px solid var(--border-color);
  }
  
  .daily-progress {
    margin-bottom: var(--spacing-3);
  }
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-2);
  }
  
  .progress-label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-color);
  }
  
  .progress-value {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
  }
  
  .progress-bar {
    height: 8px;
    background: var(--bg-secondary);
    border-radius: var(--border-radius-full);
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: var(--primary-gradient);
    border-radius: var(--border-radius-full);
    transition: width var(--transition-slow);
  }
  
  .stats-row {
    display: flex;
    gap: var(--spacing-4);
  }
  
  .stat {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }
  
  .progress-collapsed {
    padding: var(--spacing-2);
    border-bottom: 1px solid var(--border-color);
  }
  
  .mini-progress {
    height: 4px;
    background: var(--bg-secondary);
    border-radius: var(--border-radius-full);
    overflow: hidden;
    margin-bottom: var(--spacing-2);
  }
  
  .mini-progress-fill {
    height: 100%;
    background: var(--primary-gradient);
    border-radius: var(--border-radius-full);
    transition: width var(--transition-slow);
  }
  
  .streak-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    font-size: 10px;
    color: var(--warning-color);
  }
  
  .sidebar-nav {
    flex: 1;
    padding: var(--spacing-2) 0;
    overflow-y: auto;
  }
  
  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .nav-item {
    margin: 0;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-3) var(--spacing-4);
    width: 100%;
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-fast);
    position: relative;
  }
  
  .nav-link:hover {
    background: var(--primary-color-20);
    color: var(--primary-color);
  }
  
  .nav-link.active {
    background: var(--primary-color-20);
    color: var(--primary-color);
  }
  
  .nav-link.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--primary-color);
  }
  
  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
  }
  
  .nav-label {
    flex: 1;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .nav-badge {
    background: var(--primary-color);
    color: white;
    font-size: 10px;
    font-weight: var(--font-weight-semibold);
    padding: 2px 6px;
    border-radius: var(--border-radius-full);
    min-width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .nav-badge.new {
    background: var(--success-color);
  }
  
  .nav-badge-dot {
    width: 8px;
    height: 8px;
    background: var(--primary-color);
    border-radius: 50%;
    position: absolute;
    top: 8px;
    right: 8px;
  }
  
  .quick-actions {
    padding: var(--spacing-4);
    border-top: 1px solid var(--border-color);
  }
  
  .section-title {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: var(--spacing-3);
  }
  
  .action-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-2);
  }
  
  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-1);
    padding: var(--spacing-2);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
  }
  
  .action-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .action-btn.primary:hover {
    background: var(--primary-color-20);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
  
  .action-btn.success:hover {
    background: rgba(16, 185, 129, 0.1);
    border-color: var(--success-color);
    color: var(--success-color);
  }
  
  .action-btn.warning:hover {
    background: rgba(245, 158, 11, 0.1);
    border-color: var(--warning-color);
    color: var(--warning-color);
  }
  
  .action-btn.info:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: var(--info-color);
    color: var(--info-color);
  }
  
  .sidebar-footer {
    padding: var(--spacing-4);
    border-top: 1px solid var(--border-color);
  }
  
  .footer-stats {
    margin-bottom: var(--spacing-3);
  }
  
  .lesson-progress {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
  }
  
  .stat-label {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }
  
  .stat-bar {
    height: 4px;
    background: var(--bg-secondary);
    border-radius: var(--border-radius-full);
    overflow: hidden;
  }
  
  .stat-fill {
    height: 100%;
    background: var(--success-gradient);
    border-radius: var(--border-radius-full);
    transition: width var(--transition-slow);
  }
  
  .stat-text {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    text-align: center;
  }
  
  .footer-actions {
    display: flex;
    justify-content: center;
  }
  
  .footer-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: var(--spacing-2);
    border-radius: var(--border-radius);
    transition: all var(--transition-fast);
  }
  
  .footer-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-color);
  }
  
  .footer-collapsed {
    display: flex;
    justify-content: center;
  }
  
  .footer-btn-small {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: var(--spacing-1);
    border-radius: var(--border-radius);
    transition: all var(--transition-fast);
  }
  
  .footer-btn-small:hover {
    background: var(--bg-secondary);
    color: var(--text-color);
  }
  
  /* Desktop styles */
  @media (min-width: 1024px) {
    .sidebar {
      position: static;
      transform: none;
      height: calc(100vh - var(--navbar-height));
      top: var(--navbar-height);
    }
    
    .sidebar.open {
      transform: none;
    }
  }
  
  /* Mobile styles */
  @media (max-width: 1023px) {
    .sidebar {
      width: 280px;
    }
  }
  
  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .sidebar {
      transition: none;
    }
    
    .progress-fill,
    .mini-progress-fill,
    .stat-fill {
      transition: none;
    }
  }
</style>



