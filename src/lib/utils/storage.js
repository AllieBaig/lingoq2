


// Purpose: Local storage utilities for persistent data management in LingoQuest
// Key features: Safe localStorage/sessionStorage access, data serialization, encryption, cache management
// Dependencies: helpers.js for parseJSON utility
// Related helpers: helpers.js, constants.js
// Function names: setItem, getItem, removeItem, clear, getStorageSize, encryptData, decryptData, setCache, getCache
// MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
// Timestamp: 2025-06-11 15:32 | File: src/lib/utils/storage.js

import { parseJSON } from './helpers.js';

/**
 * Storage types enum
 */
export const STORAGE_TYPES = {
  LOCAL: 'localStorage',
  SESSION: 'sessionStorage'
};

/**
 * Storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  USER_PROFILE: 'lingoquest_user_profile',
  SETTINGS: 'lingoquest_settings',
  PROGRESS: 'lingoquest_progress',
  LESSONS_CACHE: 'lingoquest_lessons_cache',
  QUIZ_RESULTS: 'lingoquest_quiz_results',
  ACHIEVEMENTS: 'lingoquest_achievements',
  STREAK_DATA: 'lingoquest_streak_data',
  THEME: 'lingoquest_theme',
  LANGUAGE: 'lingoquest_language',
  OFFLINE_DATA: 'lingoquest_offline_data',
  LAST_SYNC: 'lingoquest_last_sync',
  INSTALL_PROMPT: 'lingoquest_install_prompt_dismissed'
};

/**
 * Check if storage is available
 * @param {string} type - Storage type ('localStorage' or 'sessionStorage')
 * @returns {boolean} True if storage is available
 */
function isStorageAvailable(type) {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn(`${type} is not available:`, error);
    return false;
  }
}

/**
 * Get storage object based on type
 * @param {string} storageType - Storage type
 * @returns {Storage|null} Storage object or null
 */
function getStorage(storageType = STORAGE_TYPES.LOCAL) {
  if (!isStorageAvailable(storageType)) {
    return null;
  }
  return window[storageType];
}

/**
 * Set an item in storage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @param {string} storageType - Storage type
 * @returns {boolean} Success status
 */
export function setItem(key, value, storageType = STORAGE_TYPES.LOCAL) {
  try {
    const storage = getStorage(storageType);
    if (!storage) return false;
    
    const serializedValue = JSON.stringify({
      data: value,
      timestamp: Date.now(),
      version: '1.0.0'
    });
    
    storage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Failed to set item in ${storageType}:`, error);
    return false;
  }
}

/**
 * Get an item from storage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @param {string} storageType - Storage type
 * @returns {*} Retrieved value or default value
 */
export function getItem(key, defaultValue = null, storageType = STORAGE_TYPES.LOCAL) {
  try {
    const storage = getStorage(storageType);
    if (!storage) return defaultValue;
    
    const item = storage.getItem(key);
    if (!item) return defaultValue;
    
    const parsed = parseJSON(item, null);
    if (!parsed || typeof parsed !== 'object') {
      // Handle legacy data without wrapper
      return parseJSON(item, defaultValue);
    }
    
    return parsed.data !== undefined ? parsed.data : defaultValue;
  } catch (error) {
    console.error(`Failed to get item from ${storageType}:`, error);
    return defaultValue;
  }
}

/**
 * Remove an item from storage
 * @param {string} key - Storage key
 * @param {string} storageType - Storage type
 * @returns {boolean} Success status
 */
export function removeItem(key, storageType = STORAGE_TYPES.LOCAL) {
  try {
    const storage = getStorage(storageType);
    if (!storage) return false;
    
    storage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove item from ${storageType}:`, error);
    return false;
  }
}

/**
 * Clear all items from storage
 * @param {string} storageType - Storage type
 * @returns {boolean} Success status
 */
export function clear(storageType = STORAGE_TYPES.LOCAL) {
  try {
    const storage = getStorage(storageType);
    if (!storage) return false;
    
    storage.clear();
    return true;
  } catch (error) {
    console.error(`Failed to clear ${storageType}:`, error);
    return false;
  }
}

/**
 * Get all keys from storage
 * @param {string} storageType - Storage type
 * @param {string} prefix - Optional prefix filter
 * @returns {string[]} Array of keys
 */
export function getKeys(storageType = STORAGE_TYPES.LOCAL, prefix = '') {
  try {
    const storage = getStorage(storageType);
    if (!storage) return [];
    
    const keys = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && (!prefix || key.startsWith(prefix))) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    console.error(`Failed to get keys from ${storageType}:`, error);
    return [];
  }
}

/**
 * Get storage size in bytes
 * @param {string} storageType - Storage type
 * @returns {number} Storage size in bytes
 */
export function getStorageSize(storageType = STORAGE_TYPES.LOCAL) {
  try {
    const storage = getStorage(storageType);
    if (!storage) return 0;
    
    let totalSize = 0;
    for (let key in storage) {
      if (storage.hasOwnProperty(key)) {
        totalSize += key.length + storage[key].length;
      }
    }
    return totalSize;
  } catch (error) {
    console.error(`Failed to calculate ${storageType} size:`, error);
    return 0;
  }
}

/**
 * Check if storage is nearly full
 * @param {string} storageType - Storage type
 * @param {number} threshold - Threshold percentage (0-100)
 * @returns {boolean} True if storage is nearly full
 */
export function isStorageNearlyFull(storageType = STORAGE_TYPES.LOCAL, threshold = 80) {
  try {
    const currentSize = getStorageSize(storageType);
    const maxSize = 5 * 1024 * 1024; // Approximate 5MB limit for localStorage
    const usagePercentage = (currentSize / maxSize) * 100;
    return usagePercentage >= threshold;
  } catch (error) {
    console.error('Failed to check storage fullness:', error);
    return false;
  }
}

/**
 * Cache data with expiration
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds
 * @param {string} storageType - Storage type
 * @returns {boolean} Success status
 */
export function setCache(key, data, ttl = 3600000, storageType = STORAGE_TYPES.LOCAL) {
  const cacheItem = {
    data,
    timestamp: Date.now(),
    ttl,
    expires: Date.now() + ttl
  };
  
  return setItem(`cache_${key}`, cacheItem, storageType);
}

/**
 * Get cached data if not expired
 * @param {string} key - Cache key
 * @param {*} defaultValue - Default value if cache miss
 * @param {string} storageType - Storage type
 * @returns {*} Cached data or default value
 */
export function getCache(key, defaultValue = null, storageType = STORAGE_TYPES.LOCAL) {
  const cacheItem = getItem(`cache_${key}`, null, storageType);
  
  if (!cacheItem || typeof cacheItem !== 'object') {
    return defaultValue;
  }
  
  if (Date.now() > cacheItem.expires) {
    removeItem(`cache_${key}`, storageType);
    return defaultValue;
  }
  
  return cacheItem.data;
}

/**
 * Clear expired cache entries
 * @param {string} storageType - Storage type
 * @returns {number} Number of cleared entries
 */
export function clearExpiredCache(storageType = STORAGE_TYPES.LOCAL) {
  const cacheKeys = getKeys(storageType, 'cache_');
  let clearedCount = 0;
  
  cacheKeys.forEach(key => {
    const cacheItem = getItem(key, null, storageType);
    if (cacheItem && typeof cacheItem === 'object' && Date.now() > cacheItem.expires) {
      removeItem(key, storageType);
      clearedCount++;
    }
  });
  
  return clearedCount;
}

/**
 * Simple encryption for sensitive data (not cryptographically secure)
 * @param {string} text - Text to encrypt
 * @param {string} key - Encryption key
 * @returns {string} Encrypted text
 */
export function simpleEncrypt(text, key = 'lingoquest') {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    result += String.fromCharCode(char ^ keyChar);
  }
  return btoa(result);
}

/**
 * Simple decryption for sensitive data
 * @param {string} encryptedText - Encrypted text
 * @param {string} key - Decryption key
 * @returns {string} Decrypted text
 */
export function simpleDecrypt(encryptedText, key = 'lingoquest') {
  try {
    const text = atob(encryptedText);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(char ^ keyChar);
    }
    return result;
  } catch (error) {
    console.error('Failed to decrypt data:', error);
    return '';
  }
}

/**
 * Store encrypted data
 * @param {string} key - Storage key
 * @param {*} value - Value to encrypt and store
 * @param {string} encryptionKey - Encryption key
 * @param {string} storageType - Storage type
 * @returns {boolean} Success status
 */
export function setEncryptedItem(key, value, encryptionKey, storageType = STORAGE_TYPES.LOCAL) {
  try {
    const serialized = JSON.stringify(value);
    const encrypted = simpleEncrypt(serialized, encryptionKey);
    return setItem(key, encrypted, storageType);
  } catch (error) {
    console.error('Failed to store encrypted item:', error);
    return false;
  }
}

/**
 * Retrieve and decrypt data
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value
 * @param {string} encryptionKey - Decryption key
 * @param {string} storageType - Storage type
 * @returns {*} Decrypted value or default value
 */
export function getEncryptedItem(key, defaultValue, encryptionKey, storageType = STORAGE_TYPES.LOCAL) {
  try {
    const encrypted = getItem(key, null, storageType);
    if (!encrypted) return defaultValue;
    
    const decrypted = simpleDecrypt(encrypted, encryptionKey);
    return parseJSON(decrypted, defaultValue);
  } catch (error) {
    console.error('Failed to retrieve encrypted item:', error);
    return defaultValue;
  }
}

/**
 * Export storage data for backup
 * @param {string[]} keys - Keys to export (optional, exports all if not provided)
 * @param {string} storageType - Storage type
 * @returns {Object} Exported data
 */
export function exportData(keys = null, storageType = STORAGE_TYPES.LOCAL) {
  const exportKeys = keys || getKeys(storageType);
  const exportData = {};
  
  exportKeys.forEach(key => {
    const value = getItem(key, null, storageType);
    if (value !== null) {
      exportData[key] = value;
    }
  });
  
  return {
    data: exportData,
    timestamp: Date.now(),
    version: '1.0.0'
  };
}

/**
 * Import storage data from backup
 * @param {Object} backupData - Backup data to import
 * @param {boolean} overwrite - Whether to overwrite existing data
 * @param {string} storageType - Storage type
 * @returns {boolean} Success status
 */
export function importData(backupData, overwrite = false, storageType = STORAGE_TYPES.LOCAL) {
  try {
    if (!backupData || !backupData.data) {
      throw new Error('Invalid backup data format');
    }
    
    let importCount = 0;
    for (const [key, value] of Object.entries(backupData.data)) {
      if (overwrite || getItem(key, null, storageType) === null) {
        if (setItem(key, value, storageType)) {
          importCount++;
        }
      }
    }
    
    console.log(`Imported ${importCount} items to ${storageType}`);
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
}



