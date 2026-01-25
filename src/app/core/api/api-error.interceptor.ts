import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  return next(request).pipe(
    catchError((response: HttpErrorResponse) => {
      handleHttpError(response, request);
      return throwError(() => response);
    }),
  );
};

function handleHttpError(
  response: HttpErrorResponse,
  request: { url: string; method: string },
): void {
  if (response.status === 0) {
    // TODO User feedback
    console.error('Network error', { url: request.url, error: response.error });
    return;
  }

  switch (response.status) {
    case 400:
      break;
    case 401:
      break;
    case 403:
      break;
    case 404:
      break;
    case 409:
      break;
    case 500:
    default:
      break;
  }

  // TODO User feedback
  console.error('API error', {
    status: response.status,
    method: request.method,
    url: request.url,
    message: response.message,
    body: response.error,
  });
}
