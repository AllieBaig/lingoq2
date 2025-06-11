


// Purpose: Centralized API client for LingoQuest with offline support and caching
// Key features: RESTful API calls, offline queue, retry logic, error handling
// Dependencies: Browser fetch API, localStorage for offline queue
// Related helpers: storage.js for data persistence, auth.js for authentication
// Function names: apiCall, get, post, put, delete, uploadFile, handleOfflineQueue
// MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
// Timestamp: 2025-06-11 14:30 | File: src/lib/utils/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class ApiClient {
  constructor() {
    this.offlineQueue = [];
    this.isOnline = navigator.onLine;
    this.setupEventListeners();
    this.loadOfflineQueue();
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processOfflineQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If offline, queue the request
    if (!this.isOnline && options.method !== 'GET') {
      return this.queueOfflineRequest(endpoint, config);
    }

    try {
      const response = await this.fetchWithTimeout(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('API call failed:', error);
      
      // Retry logic for network errors
      if (error.name === 'TypeError' && options.retries < MAX_RETRIES) {
        await this.delay(RETRY_DELAY * (options.retries + 1));
        return this.apiCall(endpoint, { ...options, retries: (options.retries || 0) + 1 });
      }

      return { data: null, error: error.message };
    }
  }

  async fetchWithTimeout(url, config) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.apiCall(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data = {}) {
    return this.apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.apiCall(endpoint, { method: 'DELETE' });
  }

  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.apiCall(endpoint, {
      method: 'POST',
      body: formData,
      headers: {} // Remove Content-Type to let browser set it with boundary
    });
  }

  queueOfflineRequest(endpoint, config) {
    const request = {
      id: Date.now() + Math.random(),
      endpoint,
      config,
      timestamp: Date.now()
    };

    this.offlineQueue.push(request);
    this.saveOfflineQueue();

    return Promise.resolve({
      data: null,
      error: 'Request queued for when online',
      queued: true
    });
  }

  async processOfflineQueue() {
    if (this.offlineQueue.length === 0) return;

    console.log('Processing offline queue:', this.offlineQueue.length, 'requests');

    const processedRequests = [];
    
    for (const request of this.offlineQueue) {
      try {
        const result = await this.apiCall(request.endpoint, {
          ...request.config,
          retries: 0 // Reset retries for queued requests
        });

        if (!result.error) {
          processedRequests.push(request.id);
        }
      } catch (error) {
        console.error('Failed to process queued request:', error);
      }
    }

    // Remove successfully processed requests
    this.offlineQueue = this.offlineQueue.filter(
      request => !processedRequests.includes(request.id)
    );

    this.saveOfflineQueue();
  }

  saveOfflineQueue() {
    try {
      localStorage.setItem('api_offline_queue', JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  loadOfflineQueue() {
    try {
      const saved = localStorage.getItem('api_offline_queue');
      if (saved) {
        this.offlineQueue = JSON.parse(saved);
        // Clean up old requests (older than 24 hours)
        const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
        this.offlineQueue = this.offlineQueue.filter(
          request => request.timestamp > dayAgo
        );
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.offlineQueue = [];
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  clearOfflineQueue() {
    this.offlineQueue = [];
    this.saveOfflineQueue();
  }

  getQueuedRequestsCount() {
    return this.offlineQueue.length;
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Export convenience functions
export const api = {
  get: (endpoint, params) => apiClient.get(endpoint, params),
  post: (endpoint, data) => apiClient.post(endpoint, data),
  put: (endpoint, data) => apiClient.put(endpoint, data),
  delete: (endpoint) => apiClient.delete(endpoint),
  upload: (endpoint, file, data) => apiClient.uploadFile(endpoint, file, data),
  clearQueue: () => apiClient.clearOfflineQueue(),
  getQueuedCount: () => apiClient.getQueuedRequestsCount()
};

export default apiClient;




