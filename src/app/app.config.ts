import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { authenticationInterceptor } from '@app/core/auth';
import { apiErrorInterceptor } from '@app/core/api';
import { routes } from './app.routes';

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
        preset: Aura,
      },
    }),
  ],
};
