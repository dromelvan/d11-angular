import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiErrorService } from './api-error.service';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const apiErrorService = inject(ApiErrorService);
  return next(request).pipe(
    catchError((response: HttpErrorResponse) => {
      handleHttpError(response, request, router, apiErrorService);
      return throwError(() => response);
    }),
  );
};

function handleHttpError(
  response: HttpErrorResponse,
  request: { url: string; method: string },
  router: Router,
  apiErrorService: ApiErrorService,
): void {
  if (response.status === 401) {
    return;
  }
  apiErrorService.setError({
    status: response.status,
    method: request.method,
    url: request.url,
    message: response.status === 0 ? 'Network error' : response.message,
    body: response.error != null ? JSON.stringify(response.error, null, 2) : undefined,
  });
  router.navigate(['api-error']);
}
