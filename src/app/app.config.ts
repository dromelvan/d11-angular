import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { authenticationInterceptor } from '@app/core/auth/authentication.interceptor';
import { provideUserSessionInitializer } from '@app/core/auth/user-session.initializer';
import { apiErrorInterceptor } from '@app/core/api/api-error.interceptor';
import { routes } from './app.routes';
import { D11Light } from './app.theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authenticationInterceptor, apiErrorInterceptor]),
    ),
    providePrimeNG({
      theme: {
        preset: D11Light,
      },
    }),
    provideUserSessionInitializer(),
  ],
};
