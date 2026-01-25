import { Injectable } from '@angular/core';

export interface CacheEntry {
  data: any;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class HttpCacheService {
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  private readonly CACHE_PREFIX = 'http_cache_';

  /**
   * Get cached data for a given URL
   * @param url The URL to retrieve cached data for
   * @returns The cached data or null if not found or expired
   */
  get(url: string): any | null {
    const cacheKey = this.getCacheKey(url);
    const cachedItem = localStorage.getItem(cacheKey);

    if (!cachedItem) {
      return null;
    }

    try {
      const cacheEntry: CacheEntry = JSON.parse(cachedItem);

      // Check if cache has expired
      if (Date.now() > cacheEntry.expiresAt) {
        this.remove(url);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.error('Error parsing cache entry:', error);
      this.remove(url);
      return null;
    }
  }

  /**
   * Store data in cache for a given URL
   * @param url The URL to cache data for
   * @param data The data to cache
   */
  set(url: string, data: any): void {
    const cacheKey = this.getCacheKey(url);
    const expiresAt = Date.now() + this.CACHE_DURATION;

    const cacheEntry: CacheEntry = {
      data,
      expiresAt,
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
    } catch (error) {
      console.error('Error storing cache entry:', error);
      // If localStorage is full, clear expired entries and try again
      this.clearExpired();
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
      } catch (retryError) {
        console.error('Failed to store cache entry after clearing expired items:', retryError);
      }
    }
  }

  /**
   * Remove cached data for a given URL
   * @param url The URL to remove from cache
   */
  remove(url: string): void {
    const cacheKey = this.getCacheKey(url);
    localStorage.removeItem(cacheKey);
  }

  /**
   * Clear all cached HTTP data
   */
  clear(): void {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    for (const keyToRemove of keysToRemove) {
      localStorage.removeItem(keyToRemove);
    }
  }

  /**
   * Clear only expired cache entries
   */
  clearExpired(): void {
    const keysToRemove: string[] = [];
    const now = Date.now();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX)) {
        const cachedItem = localStorage.getItem(key);
        if (cachedItem) {
          try {
            const cacheEntry: CacheEntry = JSON.parse(cachedItem);
            if (now > cacheEntry.expiresAt) {
              keysToRemove.push(key);
            }
          } catch (error) {
            // If parsing fails, remove the corrupted entry
            keysToRemove.push(key);
          }
        }
      }
    }

    for (const keyToRemove of keysToRemove) {
      localStorage.removeItem(keyToRemove);
    }
  }

  /**
   * Generate cache key from URL
   * @param url The URL to generate a key for
   * @returns The cache key
   */
  private getCacheKey(url: string): string {
    return `${this.CACHE_PREFIX}${url}`;
  }

  /**
   * Check if a URL has valid cached data
   * @param url The URL to check
   * @returns True if valid cache exists, false otherwise
   */
  has(url: string): boolean {
    return this.get(url) !== null;
  }

  /**
   * Get cache statistics
   * @returns Object with cache statistics
   */
  getStats(): { totalEntries: number; expiredEntries: number; totalSize: number } {
    let totalEntries = 0;
    let expiredEntries = 0;
    let totalSize = 0;
    const now = Date.now();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX)) {
        totalEntries++;
        const cachedItem = localStorage.getItem(key);
        if (cachedItem) {
          totalSize += cachedItem.length;
          try {
            const cacheEntry: CacheEntry = JSON.parse(cachedItem);
            if (now > cacheEntry.expiresAt) {
              expiredEntries++;
            }
          } catch (error) {
            expiredEntries++;
          }
        }
      }
    }

    return { totalEntries, expiredEntries, totalSize };
  }
}
