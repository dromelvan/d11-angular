import { HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { authenticationInterceptor } from '@app/core/interceptor';

describe('authenticationInterceptor', () => {
  // Helper to intercept and return the modified request
  function interceptRequest(request: HttpRequest<unknown>): HttpRequest<unknown> {
    let interceptedRequest: HttpRequest<unknown> | undefined;

    const next = {
      handle(httpRequest: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
        interceptedRequest = httpRequest;
        return of();
      },
    };

    authenticationInterceptor(request, next.handle.bind(next));

    if (!interceptedRequest) {
      throw new Error('interceptedRequest');
    }
    return interceptedRequest;
  }

  it('adds credentials for relative URLs', () => {
    const request = new HttpRequest<unknown>('GET', '/relative/url');

    const result = interceptRequest(request);

    expect(result.credentials).toBe('same-origin');
  });

  it('does not modify absolute URLs', () => {
    const request = new HttpRequest<unknown>('GET', 'https://absolute.com/url');

    const result = interceptRequest(request);

    expect(result.credentials).toBeUndefined();
  });

  it('forwards the request to next', () => {
    const request = new HttpRequest<unknown>('GET', '/next/url');

    const next = {
      handle: vi.fn((httpRequest: HttpRequest<unknown>): Observable<HttpEvent<unknown>> => {
        void httpRequest;
        return of({} as HttpEvent<unknown>);
      }),
    };

    authenticationInterceptor(request, next.handle.bind(next)).subscribe();

    expect(next.handle).toHaveBeenCalledTimes(1);
  });
});
