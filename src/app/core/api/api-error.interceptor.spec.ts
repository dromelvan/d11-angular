import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiErrorService } from './api-error.service';
import { apiErrorInterceptor } from './api-error.interceptor';

describe('apiErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let router: Router;
  let apiErrorService: ApiErrorService;
  let messageService: MessageService;
  let appRef: ApplicationRef;

  async function postRequest(status: number): Promise<void> {
    const promise = firstValueFrom(http.post('/api', {}));

    const request = httpMock.expectOne('/api');
    request.flush({ detail: 'Detail' }, { status: status, statusText: 'statusText' });

    try {
      await promise;
    } catch {
      // Expected
    }
  }

  async function post400Request(): Promise<void> {
    const promise = firstValueFrom(http.post('/api', {}));

    const request = httpMock.expectOne('/api');
    request.flush(
      {
        validationErrors: [
          { property: 'player.country', error: 'is missing' },
          { property: 'player.height', error: 'is missing' },
        ],
      },
      { status: 400, statusText: 'Bad Request' },
    );

    try {
      await promise;
    } catch {
      // Expected
    }
  }

  beforeEach(() => {
    const routerMock = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    const apiErrorServiceMock = {
      setError: vi.fn(),
    };

    const messageServiceMock = {
      add: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMock },
        { provide: ApiErrorService, useValue: apiErrorServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    apiErrorService = TestBed.inject(ApiErrorService);
    messageService = TestBed.inject(MessageService);
    appRef = TestBed.inject(ApplicationRef);
    vi.spyOn(appRef, 'tick').mockImplementation(() => {});
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('rethrows error', async () => {
    const promise = firstValueFrom(http.get('/api'));

    const request = httpMock.expectOne('/api');
    request.flush({ message: 'Message' }, { status: 500, statusText: 'statusText' });

    await expect(promise).rejects.toBeInstanceOf(HttpErrorResponse);
  });

  it('does not set error for HTTP status 200', async () => {
    const promise = firstValueFrom(http.get('/api'));

    const request = httpMock.expectOne('/api');
    request.flush({ ok: true });

    await expect(promise).resolves.toEqual({ ok: true });

    expect(apiErrorService.setError).not.toHaveBeenCalled();
  });

  it('sets network error for HTTP status 0', async () => {
    await postRequest(0);

    expect(apiErrorService.setError).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 0,
        method: 'POST',
        url: '/api',
        message: 'Network error',
      }),
    );
  });

  it.each([403, 404, 409, 500])('sets API error for HTTP status %i', async (status) => {
    await postRequest(status);

    expect(apiErrorService.setError).toHaveBeenCalledWith(
      expect.objectContaining({
        status: status,
        method: 'POST',
        url: '/api',
      }),
    );
  });

  it.each([403, 404, 409, 500])('navigates to api-error for HTTP status %i', async (status) => {
    await postRequest(status);

    expect(router.navigate).toHaveBeenCalledWith(['api-error']);
  });

  it('does not set error for HTTP status 401', async () => {
    await postRequest(401);

    expect(apiErrorService.setError).not.toHaveBeenCalled();
  });

  it('does not navigate for HTTP status 401', async () => {
    await postRequest(401);

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('navigates to api-error for HTTP status 0', async () => {
    await postRequest(0);

    expect(router.navigate).toHaveBeenCalledWith(['api-error']);
  });

  it('sets body on API error', async () => {
    await postRequest(500);

    expect(apiErrorService.setError).toHaveBeenCalledWith(
      expect.objectContaining({
        body: '{\n  "detail": "Detail"\n}',
      }),
    );
  });

  it('shows toast with validation errors for HTTP status 400', async () => {
    await post400Request();

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Validation error',
      detail: 'Country is missing\nHeight is missing',
    });
  });

  it('ticks change detection after showing toast for HTTP status 400', async () => {
    await post400Request();

    expect(appRef.tick).toHaveBeenCalled();
  });

  it('does not navigate for HTTP status 400', async () => {
    await post400Request();

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('does not set API error for HTTP status 400', async () => {
    await post400Request();

    expect(apiErrorService.setError).not.toHaveBeenCalled();
  });
});
