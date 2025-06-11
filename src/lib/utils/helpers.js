


// Purpose: Utility helper functions for common operations throughout LingoQuest
// Key features: Date formatting, string manipulation, array operations, validation, storage utilities
// Dependencies: None (pure JavaScript utilities)
// Related helpers: constants.js, validators.js, storage.js
// Function names: formatDate, capitalizeFirst, shuffleArray, debounce, throttle, generateId, parseJSON, sanitizeHtml
// MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
// Timestamp: 2025-06-11 15:30 | File: src/lib/utils/helpers.js

/**
 * Format a date to a human-readable string
 * @param {Date|string|number} date - The date to format
 * @param {string} format - Format type: 'short', 'long', 'time', 'relative'
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'short') {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  switch (format) {
    case 'relative':
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    
    case 'time':
      return d.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    
    case 'long':
      return d.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    
    case 'short':
    default:
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
  }
}

/**
 * Capitalize the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalizeFirst(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalize each word in a string
 * @param {string} str - String to capitalize
 * @returns {string} Title case string
 */
export function toTitleCase(str) {
  if (!str || typeof str !== 'string') return '';
  return str.split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ');
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get a random element from an array
 * @param {Array} array - Array to pick from
 * @returns {*} Random element
 */
export function getRandomElement(array) {
  if (!Array.isArray(array) || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Generate a unique ID
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID
 */
export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 9);
  return `${prefix}${timestamp}${randomPart}`;
}

/**
 * Safely parse JSON with fallback
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed object or fallback
 */
export function parseJSON(jsonString, fallback = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
}

/**
 * Deep clone an object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Check if two objects are equal (deep comparison)
 * @param {*} a - First object
 * @param {*} b - Second object
 * @returns {boolean} True if objects are equal
 */
export function isEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (let key of keysA) {
      if (!keysB.includes(key) || !isEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}

/**
 * Format a number with thousands separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
  if (typeof num !== 'number') return '0';
  return num.toLocaleString();
}

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @param {number} decimals - Number of decimal places
 * @returns {number} Percentage
 */
export function calculatePercentage(value, total, decimals = 1) {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(decimals));
}

/**
 * Clamp a number between min and max values
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped number
 */
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Sleep for a specified duration
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after the delay
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a simple hash from a string
 * @param {string} str - String to hash
 * @returns {number} Hash value
 */
export function simpleHash(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add if truncated
 * @returns {string} Truncated text
 */
export function truncateText(text, length, suffix = '...') {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + suffix;
}

/**
 * Remove HTML tags from a string
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Convert camelCase to kebab-case
 * @param {string} str - CamelCase string
 * @returns {string} Kebab-case string
 */
export function camelToKebab(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert kebab-case to camelCase
 * @param {string} str - Kebab-case string
 * @returns {string} CamelCase string
 */
export function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}


