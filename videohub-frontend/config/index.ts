// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Supported platforms
export const SUPPORTED_PLATFORMS = {
  TIKTOK: 'tiktok',
  FACEBOOK: 'facebook',
  YOUTUBE: 'youtube',
};

// Animation duration (ms)
export const ANIMATION_DURATION = 0.3;

// Colors
export const COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#6366F1',
  BACKGROUND: '#0F172A',
  CARD: '#1E293B',
  SUCCESS: '#22C55E',
  DANGER: '#EF4444',
};

// Metadata
export const META = {
  title: 'VideoHub Downloader - Download Videos Without Watermark',
  description: 'Download videos from TikTok, Facebook, and YouTube in high quality. Fast, easy, and secure.',
  keywords: 'video downloader, tiktok downloader, facebook downloader, youtube downloader',
  author: 'VideoHub Team',
};
