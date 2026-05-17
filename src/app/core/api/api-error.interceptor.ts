import { ApplicationRef, inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiErrorService } from './api-error.service';
import { BadRequestErrorBody } from './model/bad-request-error-body.model';
import { fromCamelCase } from '@app/shared/util/label.util';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const apiErrorService = inject(ApiErrorService);
  const messageService = inject(MessageService);
  const appRef = inject(ApplicationRef);

  return next(request).pipe(
    catchError((response: HttpErrorResponse) => {
      handleHttpError(response, request, router, apiErrorService, messageService, appRef);
      return throwError(() => response);
    }),
  );
};

function handleHttpError(
  response: HttpErrorResponse,
  request: { url: string; method: string },
  router: Router,
  apiErrorService: ApiErrorService,
  messageService: MessageService,
  appRef: ApplicationRef,
): void {
  if (response.status === 401) {
    return;
  }
  if (response.status === 400) {
    const body = response.error as BadRequestErrorBody;
    const validationErrors = body?.validationErrors ?? [];
    const detail =
      validationErrors.length > 0
        ? validationErrors.map((e) => `${fromCamelCase(e.property)} ${e.error}`).join('\n')
        : response.message;
    messageService.add({ severity: 'error', summary: 'Validation error', detail });
    appRef.tick();
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
