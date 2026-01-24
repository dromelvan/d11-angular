import { authenticationInterceptor } from '@app/core/interceptor';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

describe('authenticationInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authenticationInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);

    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('adds credentials for relative URLs', () => {
    http.get('/relative/url').subscribe();

    const request = httpMock.expectOne('/relative/url');
    expect(request.request.credentials).toBe('same-origin');
  });

  it('does not add credentials for absolute URLs', () => {
    http.get('https://absolute.com/url').subscribe();

    const request = httpMock.expectOne('https://absolute.com/url');
    expect(request.request.credentials).toBeUndefined();
  });

  it('forwards the request to next handler', () => {
    http.get('/forward/url').subscribe();

    const request = httpMock.expectOne('/forward/url');
    expect(request.request.method).toBe('GET');
  });
});
