import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserSessionService } from './user-session.service';

export const authenticationInterceptor: HttpInterceptorFn = (request, next) => {
  const userSession = inject(UserSessionService);

  if (request.url.startsWith('/')) {
    const isApiCall = request.url.startsWith(`/${environment.apiVersion}/`);
    const jwt = isApiCall ? userSession.jwt() : undefined;
    request = request.clone({
      credentials: 'same-origin',
      ...(jwt != null && { setHeaders: { Authorization: `Bearer ${jwt}` } }),
    });
  }
  return next(request);
};
