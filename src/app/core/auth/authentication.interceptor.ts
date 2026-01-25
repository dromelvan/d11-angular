import { HttpInterceptorFn } from '@angular/common/http';

export const authenticationInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url.startsWith('/')) {
    request = request.clone({
      credentials: 'same-origin',
    });
  }
  return next(request);
};
