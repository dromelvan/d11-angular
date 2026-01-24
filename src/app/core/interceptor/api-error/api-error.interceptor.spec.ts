import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { apiErrorInterceptor } from '@app/core/interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

describe('apiErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);

    vi.spyOn(console, 'error').mockImplementation(() => {
      // Not doing anything here
    });
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('rethrows error', async () => {
    const promise = firstValueFrom(http.get('/api'));

    const request = httpMock.expectOne('/api');
    request.flush({ message: 'Message' }, { status: 500, statusText: 'statusText' });

    await expect(promise).rejects.toBeInstanceOf(HttpErrorResponse);
  });

  it('does not log error for HTTP status 200', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {
      // Empty
    });

    const promise = firstValueFrom(http.get('/api'));

    const request = httpMock.expectOne('/api');
    request.flush({ ok: true });

    await expect(promise).resolves.toEqual({ ok: true });

    expect(spy).not.toHaveBeenCalled();
  });

  it('logs network error for HTTP status 0', async () => {
    await postRequest(0);

    expect(console.error).toHaveBeenCalledWith(
      'Network error',
      expect.objectContaining({
        url: '/api',
      }),
    );
  });

  it.each([400, 401, 403, 404, 409])('logs API error for HTTP status %i', async (status) => {
    await postRequest(status);

    expect(console.error).toHaveBeenCalledWith(
      'API error',
      expect.objectContaining({
        status: status,
        method: 'POST',
        url: `/api`,
      }),
    );
  });

  // 500 might be handled differently than the known statuses when proper user notification is added
  it('logs API error for HTTP status 500', async () => {
    await postRequest(500);

    expect(console.error).toHaveBeenCalledWith(
      'API error',
      expect.objectContaining({
        status: 500,
        method: 'POST',
        url: '/api',
        body: { detail: 'Detail' },
      }),
    );
  });
});
