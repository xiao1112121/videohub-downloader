import { DownloadResponse, CacheData } from '@/types';
import { CACHE_EXPIRATION } from '@/config/constants';

// In-memory cache
class CacheService {
  private cache: Map<string, CacheData> = new Map();

  // Get from cache
  get(key: string): DownloadResponse | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;

    // Check if expired
    if (Date.now() - cached.timestamp > CACHE_EXPIRATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  // Set cache
  set(key: string, data: DownloadResponse): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // Clear cache
  clear(): void {
    this.cache.clear();
  }

  // Delete specific key
  delete(key: string): void {
    this.cache.delete(key);
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }
}

export const cacheService = new CacheService();
