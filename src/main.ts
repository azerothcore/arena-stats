import { enableProdMode, provideZoneChangeDetection } from '@angular/core';

import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { httpCacheInterceptor } from './app/interceptors/http-cache.interceptor';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideHttpClient(withXhr(), withInterceptors([httpCacheInterceptor])),
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
