import { TestBed } from '@angular/core/testing';
import { CacheEntry, HttpCacheService } from './http-cache.service';

describe('HttpCacheService', () => {
  let service: HttpCacheService;
  const testUrl = 'https://api.example.com/test';
  const testData = { id: 1, name: 'Test Data' };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpCacheService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('set and get', () => {
    it('should store and retrieve data', () => {
      service.set(testUrl, testData);
      const cached = service.get(testUrl);
      expect(cached).toEqual(testData);
    });

    it('should return null for non-existent cache', () => {
      const cached = service.get('non-existent-url');
      expect(cached).toBeNull();
    });

    it('should return null for expired cache', () => {
      const cacheKey = 'http_cache_' + testUrl;
      const expiredEntry: CacheEntry = {
        data: testData,
        expiresAt: Date.now() - 1000, // Expired 1 second ago
      };
      localStorage.setItem(cacheKey, JSON.stringify(expiredEntry));

      const cached = service.get(testUrl);
      expect(cached).toBeNull();
    });
  });

  describe('has', () => {
    it('should return true for existing valid cache', () => {
      service.set(testUrl, testData);
      expect(service.has(testUrl)).toBe(true);
    });

    it('should return false for non-existent cache', () => {
      expect(service.has('non-existent-url')).toBe(false);
    });

    it('should return false for expired cache', () => {
      const cacheKey = 'http_cache_' + testUrl;
      const expiredEntry: CacheEntry = {
        data: testData,
        expiresAt: Date.now() - 1000,
      };
      localStorage.setItem(cacheKey, JSON.stringify(expiredEntry));

      expect(service.has(testUrl)).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove cached data', () => {
      service.set(testUrl, testData);
      expect(service.has(testUrl)).toBe(true);

      service.remove(testUrl);
      expect(service.has(testUrl)).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all cached HTTP data', () => {
      service.set('url1', { data: 1 });
      service.set('url2', { data: 2 });
      service.set('url3', { data: 3 });

      service.clear();

      expect(service.has('url1')).toBe(false);
      expect(service.has('url2')).toBe(false);
      expect(service.has('url3')).toBe(false);
    });

    it('should not remove non-cache localStorage items', () => {
      localStorage.setItem('other_key', 'other_value');
      service.set(testUrl, testData);

      service.clear();

      expect(localStorage.getItem('other_key')).toBe('other_value');
      expect(service.has(testUrl)).toBe(false);
    });
  });

  describe('clearExpired', () => {
    it('should remove only expired entries', () => {
      // Add valid entry
      service.set('valid-url', { data: 'valid' });

      // Add expired entry
      const cacheKey = 'http_cache_expired-url';
      const expiredEntry: CacheEntry = {
        data: { data: 'expired' },
        expiresAt: Date.now() - 1000,
      };
      localStorage.setItem(cacheKey, JSON.stringify(expiredEntry));

      service.clearExpired();

      expect(service.has('valid-url')).toBe(true);
      expect(service.has('expired-url')).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      service.set('url1', { data: 1 });
      service.set('url2', { data: 2 });

      const stats = service.getStats();
      expect(stats.totalEntries).toBe(2);
      expect(stats.expiredEntries).toBe(0);
      expect(stats.totalSize).toBeGreaterThan(0);
    });

    it('should count expired entries', () => {
      service.set('valid-url', { data: 'valid' });

      const cacheKey = 'http_cache_expired-url';
      const expiredEntry: CacheEntry = {
        data: { data: 'expired' },
        expiresAt: Date.now() - 1000,
      };
      localStorage.setItem(cacheKey, JSON.stringify(expiredEntry));

      const stats = service.getStats();
      expect(stats.totalEntries).toBe(2);
      expect(stats.expiredEntries).toBe(1);
    });
  });
});
