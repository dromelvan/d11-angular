import { inject, provideAppInitializer } from '@angular/core';
import { catchError, firstValueFrom, of } from 'rxjs';
import { UserSessionService } from './user-session.service';

export const provideUserSessionInitializer = () =>
  provideAppInitializer(() => {
    const userSession = inject(UserSessionService);

    // If authorization fails here it just means we're not logged in so we can ignore it
    return firstValueFrom(userSession.authorize().pipe(catchError(() => of(undefined))));
  });
