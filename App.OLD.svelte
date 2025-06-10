



<script>
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import Header from './components/common/Header.svelte';
  import Navigation from './components/layout/Navigation.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import Lessons from './routes/Lessons.svelte';
  import Quiz from './routes/Quiz.svelte';
  import Profile from './routes/Profile.svelte';
  import Settings from './routes/Settings.svelte';
  import Modal from './components/common/Modal.svelte';
  import { currentRoute, isOnline, showInstallPrompt } from './lib/stores/settings.js';
  import { userProgress } from './lib/stores/progress.js';
  import { gameState } from './lib/stores/game.js';

  let installPrompt = null;
  let showOfflineBanner = false;
  let showMessage = false;
  let messageText = '';
  let messageType = 'info';

  onMount(() => {
    // Initialize app state
    loadUserData();
    
    // Listen for PWA events
    window.addEventListener('showInstallPrompt', handleInstallPrompt);
    window.addEventListener('hideInstallPrompt', hideInstallPrompt);
    window.addEventListener('connectionChange', handleConnectionChange);
    window.addEventListener('showMessage', handleShowMessage);
    window.addEventListener('appHidden', handleAppHidden);
    window.addEventListener('appVisible', handleAppVisible);

    // Check initial connection status
    isOnline.set(navigator.onLine);

    return () => {
      window.removeEventListener('showInstallPrompt', handleInstallPrompt);
      window.removeEventListener('hideInstallPrompt', hideInstallPrompt);
      window.removeEventListener('connectionChange', handleConnectionChange);
      window.removeEventListener('showMessage', handleShowMessage);
      window.removeEventListener('appHidden', handleAppHidden);
      window.removeEventListener('appVisible', handleAppVisible);
    };
  });

  function loadUserData() {
    try {
      const savedProgress = localStorage.getItem('lingoquest-progress');
      if (savedProgress) {
        userProgress.set(JSON.parse(savedProgress));
      }

      const savedGameState = localStorage.getItem('lingoquest-game');
      if (savedGameState) {
        gameState.set(JSON.parse(savedGameState));
      }

      const savedRoute = localStorage.getItem('lingoquest-route');
      if (savedRoute) {
        currentRoute.set(savedRoute);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  function handleInstallPrompt(event) {
    installPrompt = event.detail.prompt;
    showInstallPrompt.set(true);
  }

  function hideInstallPrompt() {
    showInstallPrompt.set(false);
    installPrompt = null;
  }

  function handleConnectionChange(event) {
    isOnline.set(event.detail.online);
    showOfflineBanner = !event.detail.online;
    
    if (event.detail.online) {
      setTimeout(() => {
        showOfflineBanner = false;
      }, 3000);
    }
  }

  function handleShowMessage(event) {
    messageText = event.detail.message;
    messageType = event.detail.type || 'info';
    showMessage = true;
    
    setTimeout(() => {
      showMessage = false;
    }, 5000);
  }

  function handleAppHidden() {
    // Pause any running timers or animations
    gameState.update(state => ({
      ...state,
      isPaused: true
    }));
  }

  function handleAppVisible() {
    // Resume timers or animations
    gameState.update(state => ({
      ...state,
      isPaused: false
    }));
  }

  async function installApp() {
    if (installPrompt) {
      const result = await installPrompt.prompt();
      console.log('Install prompt result:', result);
      hideInstallPrompt();
    }
  }

  function dismissMessage() {
    showMessage = false;
  }

  function getRouteComponent(route) {
    switch (route) {
      case 'lessons':
        return Lessons;
      case 'quiz':
        return Quiz;
      case 'profile':
        return Profile;
      case 'settings':
        return Settings;
      default:
        return Dashboard;
    }
  }

  $: RouteComponent = getRouteComponent($currentRoute);
</script>

<main class="app">
  <Header />
  
  {#if showOfflineBanner}
    <div class="offline-banner" transition:slide>
      <span>📱 You're offline - some features may be limited</span>
    </div>
  {/if}

  {#if showMessage}
    <div class="message-banner {messageType}" transition:fade>
      <span>{messageText}</span>
      <button class="dismiss-btn" on:click={dismissMessage}>×</button>
    </div>
  {/if}

  <div class="app-content">
    <div class="route-container">
      {#key $currentRoute}
        <div class="route-wrapper" transition:fade={{ duration: 200 }}>
          <svelte:component this={RouteComponent} />
        </div>
      {/key}
    </div>
  </div>

  <Navigation />

  {#if $showInstallPrompt}
    <Modal on:close={hideInstallPrompt}>
      <div class="install-modal">
        <div class="install-icon">📱</div>
        <h3>Install LingoQuest</h3>
        <p>Get the full app experience with offline access and push notifications!</p>
        <div class="install-actions">
          <button class="btn-secondary" on:click={hideInstallPrompt}>
            Maybe Later
          </button>
          <button class="btn-primary" on:click={installApp}>
            Install Now
          </button>
        </div>
      </div>
    </Modal>
  {/if}
</main>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-gradient);
    color: var(--text-color);
  }

  .offline-banner {
    background: var(--warning-color);
    color: white;
    padding: 0.75rem;
    text-align: center;
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .message-banner {
    padding: 0.75rem 1rem;
    text-align: center;
    font-size: 0.9rem;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
  }

  .message-banner.success {
    background: var(--success-color);
    color: white;
  }

  .message-banner.error {
    background: var(--error-color);
    color: white;
  }

  .message-banner.info {
    background: var(--primary-color);
    color: white;
  }

  .dismiss-btn {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    margin-left: 1rem;
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }

  .dismiss-btn:hover {
    opacity: 1;
  }

  .app-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .route-container {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .route-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
  }

  .install-modal {
    text-align: center;
    padding: 2rem;
    max-width: 400px;
  }

  .install-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .install-modal h3 {
    margin-bottom: 1rem;
    color: var(--text-color);
    font-size: 1.5rem;
  }

  .install-modal p {
    margin-bottom: 2rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .install-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .btn-primary, .btn-secondary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
  }

  .btn-primary {
    background: var(--primary-color);
    color: white;
  }

  .btn-primary:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: var(--bg-secondary);
    color: var(--text-color);
    border: 1px solid var(--border-color);
  }

  .btn-secondary:hover {
    background: var(--bg-tertiary);
  }

  @media (max-width: 768px) {
    .install-modal {
      padding: 1.5rem;
    }

    .install-actions {
      flex-direction: column;
    }

    .btn-primary, .btn-secondary {
      width: 100%;
    }
  }
</style>




