import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpCacheService } from '../services/http-cache.service';

/**
 * HTTP Interceptor that caches GET requests in localStorage
 *
 * This interceptor automatically caches all HTTP GET requests and serves
 * cached responses when available and not expired (30 minutes).
 *
 * To bypass cache for specific requests, add a custom header:
 * headers: { 'X-Skip-Cache': 'true' }
 */
export const httpCacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(HttpCacheService);

  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  // Allow requests to bypass cache with custom header
  if (req.headers.has('X-Skip-Cache')) {
    const modifiedReq = req.clone({
      headers: req.headers.delete('X-Skip-Cache'),
    });
    return next(modifiedReq);
  }

  const cachedResponse = cacheService.get(req.urlWithParams);

  // If cache exists and is valid, return it
  if (cachedResponse !== null) {
    // console.debug(`[Cache HIT] ${req.urlWithParams}`);
    return of(
      new HttpResponse({
        body: cachedResponse,
        status: 200,
        statusText: 'OK (from cache)',
      }),
    );
  }

  // Cache miss - make the request and cache the response
  // console.debug(`[Cache MISS] ${req.urlWithParams}`);
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cacheService.set(req.urlWithParams, event.body);
      }
    }),
  );
};
