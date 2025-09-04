// src/config.js
// Centralized configuration for environment-dependent variables
// This provides a clean, single source of truth for all environment variables

export const publicUrl = process.env.PUBLIC_URL || '';

// Global application configuration
export const appConfig = {
  gameTitle: 'Dharma\'s Cipher: The Kashi Khanda',
  shortTitle: 'Dharma\'s Cipher',
  supportEmail: 'support@dharmascipher.com',
  version: '1.0.0',
  
  // SEO and meta information
  description: 'An immersive philosophical adventure through ancient wisdom',
  themeColor: '#1a1a2e',
  
  // External service configurations (add as needed)
  // apiBaseUrl: process.env.REACT_APP_API_URL || 'https://api.fallback.com',
  // sentryDsn: process.env.REACT_APP_SENTRY_DSN,
  
  // Feature flags (add as needed)
  features: {
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    enableDebugMode: process.env.NODE_ENV === 'development',
  }
};

// Helper functions for common path operations
export const getAssetUrl = (path) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${publicUrl}/${cleanPath}`;
};

export const getImageUrl = (imagePath) => getAssetUrl(`images/${imagePath}`);

export const getFontUrl = (fontPath) => getAssetUrl(`fonts/${fontPath}`);

// Environment helpers
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTesting = process.env.NODE_ENV === 'test';

export default {
  publicUrl,
  appConfig,
  getAssetUrl,
  getImageUrl, 
  getFontUrl,
  isDevelopment,
  isProduction,
  isTesting
};
