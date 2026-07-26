// Configuration for supported platforms
export const SUPPORTED_PLATFORMS = {
  TIKTOK: 'tiktok',
  FACEBOOK: 'facebook',
  YOUTUBE: 'youtube',
};

// Cache expiration time (1 hour)
export const CACHE_EXPIRATION = 3600000;

// Rate limiting
export const RATE_LIMIT = {
  WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW || '3600000'),
  MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
};

// API response
export const API_RESPONSE = {
  SUCCESS: 'success',
  ERROR: 'error',
};

// Error messages
export const ERROR_MESSAGES = {
  INVALID_URL: 'Invalid URL format',
  UNSUPPORTED_PLATFORM: 'Unsupported platform',
  FAILED_TO_FETCH: 'Failed to fetch video data',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  INTERNAL_ERROR: 'Internal server error',
};
