import { cacheService } from './cache';
import { DownloadResponse } from '@/types';

describe('CacheService', () => {
  const mockData: DownloadResponse = {
    title: 'Test Video',
    thumbnail: 'https://example.com/thumb.jpg',
    duration: '0:30',
    platform: 'tiktok',
    quality: [
      { name: 'High', url: 'https://example.com/video.mp4' },
    ],
  };

  beforeEach(() => {
    cacheService.clear();
  });

  describe('get', () => {
    it('should return null for non-existent key', () => {
      expect(cacheService.get('non-existent')).toBeNull();
    });

    it('should return cached data for existing key', () => {
      cacheService.set('test-key', mockData);
      expect(cacheService.get('test-key')).toEqual(mockData);
    });
  });

  describe('set', () => {
    it('should store data in cache', () => {
      cacheService.set('test-key', mockData);
      expect(cacheService.size()).toBe(1);
    });
  });

  describe('delete', () => {
    it('should remove data from cache', () => {
      cacheService.set('test-key', mockData);
      cacheService.delete('test-key');
      expect(cacheService.get('test-key')).toBeNull();
      expect(cacheService.size()).toBe(0);
    });
  });

  describe('clear', () => {
    it('should remove all data from cache', () => {
      cacheService.set('key1', mockData);
      cacheService.set('key2', mockData);
      cacheService.clear();
      expect(cacheService.size()).toBe(0);
    });
  });

  describe('size', () => {
    it('should return the number of cached items', () => {
      cacheService.set('key1', mockData);
      cacheService.set('key2', mockData);
      expect(cacheService.size()).toBe(2);
    });
  });
});
