import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserSessionService } from './user-session.service';

export const authenticationInterceptor: HttpInterceptorFn = (request, next) => {
  const userSession = inject(UserSessionService);
  const apiPrefix = `/${environment.apiVersion}/`;

  if (!request.url.startsWith('/')) {
    return next(request);
  }

  request = request.clone({ credentials: 'same-origin' });

  if (!request.url.startsWith(apiPrefix)) {
    return next(request);
  }

  if (request.url.startsWith(`${apiPrefix}security/`)) {
    return next(request);
  }

  const jwt = userSession.jwt();
  if (jwt == null) {
    return next(request);
  }

  const isExpired = userSession.isJwtExpired();

  return (isExpired ? userSession.authorize() : of(jwt)).pipe(
    switchMap((freshJwt) =>
      next(request.clone({ setHeaders: { Authorization: `Bearer ${freshJwt}` } })),
    ),
  );
};
