


// Purpose: Authentication state management store for user login/logout and session handling
// Key features: Reactive auth state, local storage persistence, session validation, user profile management
// Dependencies: Svelte store, browser localStorage API
// Related helpers: validateToken, refreshToken, getUserProfile functions
// Function names: createAuthStore, login, logout, checkAuth, updateProfile
// MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
// Timestamp: 2025-06-11 15:30 | File: src/lib/stores/auth.js

import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// Auth state interface
const defaultAuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null
};

// Create the auth store
function createAuthStore() {
  const { subscribe, set, update } = writable(defaultAuthState);

  return {
    subscribe,
    
    // Initialize auth state from localStorage
    init: async () => {
      if (!browser) return;
      
      try {
        const stored = localStorage.getItem('lingoquest_auth');
        if (stored) {
          const authData = JSON.parse(stored);
          
          // Validate stored token
          if (await validateToken(authData.token)) {
            update(state => ({
              ...state,
              isAuthenticated: true,
              user: authData.user,
              token: authData.token,
              loading: false
            }));
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('lingoquest_auth');
            update(state => ({ ...state, loading: false }));
          }
        } else {
          update(state => ({ ...state, loading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        update(state => ({ 
          ...state, 
          loading: false, 
          error: 'Failed to initialize authentication' 
        }));
      }
    },

    // Login user
    login: async (credentials) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const { user, token } = await response.json();
        
        // Store in localStorage
        if (browser) {
          localStorage.setItem('lingoquest_auth', JSON.stringify({ user, token }));
        }

        update(state => ({
          ...state,
          isAuthenticated: true,
          user,
          token,
          loading: false,
          error: null
        }));

        return { success: true };
      } catch (error) {
        console.error('Login error:', error);
        update(state => ({
          ...state,
          loading: false,
          error: error.message || 'Login failed'
        }));
        return { success: false, error: error.message };
      }
    },

    // Register new user
    register: async (userData) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }

        const { user, token } = await response.json();
        
        // Store in localStorage
        if (browser) {
          localStorage.setItem('lingoquest_auth', JSON.stringify({ user, token }));
        }

        update(state => ({
          ...state,
          isAuthenticated: true,
          user,
          token,
          loading: false,
          error: null
        }));

        return { success: true };
      } catch (error) {
        console.error('Registration error:', error);
        update(state => ({
          ...state,
          loading: false,
          error: error.message || 'Registration failed'
        }));
        return { success: false, error: error.message };
      }
    },

    // Logout user
    logout: async () => {
      try {
        // Call logout endpoint if authenticated
        const currentState = get(authStore);
        if (currentState.isAuthenticated && currentState.token) {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${currentState.token}`,
              'Content-Type': 'application/json'
            }
          });
        }
      } catch (error) {
        console.error('Logout API error:', error);
      } finally {
        // Clear local state regardless of API call result
        if (browser) {
          localStorage.removeItem('lingoquest_auth');
        }
        
        set(defaultAuthState);
      }
    },

    // Update user profile
    updateProfile: async (profileData) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const currentState = get(authStore);
        const response = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${currentState.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(profileData)
        });

        if (!response.ok) {
          throw new Error('Profile update failed');
        }

        const updatedUser = await response.json();
        
        // Update localStorage
        if (browser) {
          const authData = JSON.parse(localStorage.getItem('lingoquest_auth') || '{}');
          authData.user = updatedUser;
          localStorage.setItem('lingoquest_auth', JSON.stringify(authData));
        }

        update(state => ({
          ...state,
          user: updatedUser,
          loading: false,
          error: null
        }));

        return { success: true };
      } catch (error) {
        console.error('Profile update error:', error);
        update(state => ({
          ...state,
          loading: false,
          error: error.message || 'Profile update failed'
        }));
        return { success: false, error: error.message };
      }
    },

    // Clear error
    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}

// Helper function to validate token
async function validateToken(token) {
  if (!token) return false;
  
  try {
    const response = await fetch('/api/auth/validate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

// Helper function to get current state
function get(store) {
  let value;
  store.subscribe(val => value = val)();
  return value;
}

// Create and export the auth store
export const authStore = createAuthStore();

// Derived stores for common auth checks
export const isAuthenticated = derived(authStore, $auth => $auth.isAuthenticated);
export const currentUser = derived(authStore, $auth => $auth.user);
export const authLoading = derived(authStore, $auth => $auth.loading);
export const authError = derived(authStore, $auth => $auth.error);

// Initialize auth store when module loads
if (browser) {
  authStore.init();
}



