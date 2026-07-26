import { isValidUrl, getPlatformFromUrl, formatFileSize, formatDuration } from './helpers';

describe('Helpers', () => {
  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://www.tiktok.com/video/123456789')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('12345')).toBe(false);
    });
  });

  describe('getPlatformFromUrl', () => {
    it('should detect TikTok URLs', () => {
      expect(getPlatformFromUrl('https://www.tiktok.com/video/123456789')).toBe('tiktok');
      expect(getPlatformFromUrl('https://vm.tiktok.com/abc123')).toBe('tiktok');
      expect(getPlatformFromUrl('https://vt.tiktok.com/xyz789')).toBe('tiktok');
    });

    it('should detect Facebook URLs', () => {
      expect(getPlatformFromUrl('https://www.facebook.com/watch?v=123456789')).toBe('facebook');
      expect(getPlatformFromUrl('https://fb.watch/abc123')).toBe('facebook');
    });

    it('should detect YouTube URLs', () => {
      expect(getPlatformFromUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('youtube');
      expect(getPlatformFromUrl('https://youtu.be/dQw4w9WgXcQ')).toBe('youtube');
    });

    it('should return null for unsupported platforms', () => {
      expect(getPlatformFromUrl('https://www.instagram.com/p/abc123')).toBeNull();
      expect(getPlatformFromUrl('https://example.com')).toBeNull();
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });
  });

  describe('formatDuration', () => {
    it('should format seconds correctly', () => {
      expect(formatDuration(30)).toBe('0:30');
      expect(formatDuration(90)).toBe('1:30');
      expect(formatDuration(3661)).toBe('1:01:01');
    });
  });
});
