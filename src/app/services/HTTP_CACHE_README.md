# HTTP Cache Service

This service provides automatic caching for all HTTP GET requests using localStorage with a 30-minute expiration time.

## Features

- ✅ Automatic caching of all HTTP GET requests
- ✅ 30-minute cache expiration
- ✅ localStorage persistence (survives page reloads)
- ✅ Automatic cache cleanup for expired entries
- ✅ Option to bypass cache for specific requests
- ✅ Cache statistics and management methods

## How It Works

The HTTP cache system consists of two main components:

1. **HttpCacheService** - Manages cache storage and retrieval in localStorage
2. **httpCacheInterceptor** - Intercepts HTTP requests and serves cached responses

## Automatic Caching

All HTTP GET requests are automatically cached. No changes to your existing services are required!

```typescript
// This request will be cached automatically
this.http.get<ArenaTeam[]>(API_URL + '/characters/arena_team/type/' + arenaType).subscribe((data) => {
  // First call: fetches from API and caches
  // Subsequent calls within 30 minutes: served from cache
});
```

## Bypassing Cache

If you need to skip the cache for a specific request, add the `X-Skip-Cache` header:

```typescript
this.http
  .get<any>(url, {
    headers: { 'X-Skip-Cache': 'true' },
  })
  .subscribe((data) => {
    // This request will always hit the API, bypassing cache
  });
```

## Manual Cache Management

You can inject the `HttpCacheService` to manually manage the cache:

```typescript
import { HttpCacheService } from './services/http-cache.service';

export class MyComponent {
  private cacheService = inject(HttpCacheService);

  clearAllCache() {
    this.cacheService.clear();
  }

  clearExpiredCache() {
    this.cacheService.clearExpired();
  }

  removeSingleCache(url: string) {
    this.cacheService.remove(url);
  }

  getCacheStats() {
    const stats = this.cacheService.getStats();
    console.log('Total cached entries:', stats.totalEntries);
    console.log('Expired entries:', stats.expiredEntries);
    console.log('Total cache size (bytes):', stats.totalSize);
  }
}
```

## Cache Duration

The cache duration is set to 30 minutes by default. To change this, modify the `CACHE_DURATION` constant in [services/http-cache.service.ts](../services/http-cache.service.ts):

```typescript
private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
```

## Cache Key Format

Cache keys are stored in localStorage with the prefix `http_cache_` followed by the full URL including query parameters:

```
http_cache_https://api.example.com/characters/arena_team/type/2
```

## Cache Entry Structure

Each cache entry is stored as JSON with the following structure:

```typescript
interface CacheEntry {
  data: any; // The cached response body
  expiresAt: number; // Timestamp when the cache expires
}
```

## Benefits

1. **Reduced API calls** - Significantly reduces the number of HTTP requests to your API
2. **Faster page loads** - Instant response for cached data
3. **Offline capability** - Works even after page reload (data persists in localStorage)
4. **Bandwidth savings** - Reduces network traffic
5. **Better UX** - Faster navigation and interaction

## Console Logging

The interceptor logs cache hits and misses to the console:

```
[Cache HIT] https://api.example.com/characters/arena_team/type/2
[Cache MISS] https://api.example.com/characters/arena_team/type/3
```

## Storage Limits

localStorage has a limit (typically 5-10 MB). The service handles this by:

- Automatically clearing expired entries when storage is full
- Gracefully handling storage errors

## Testing

Run the tests with:

```bash
ng test
```

The service includes comprehensive unit tests covering all functionality.
