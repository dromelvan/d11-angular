import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { UserSessionService } from './user-session.service';
import { authenticationInterceptor } from './authentication.interceptor';

const JWT = 'test-jwt-token';
const API_URL = `/${environment.apiVersion}/players`;

describe('authenticationInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let jwtSignal: ReturnType<typeof signal<string | undefined>>;

  beforeEach(() => {
    jwtSignal = signal<string | undefined>(undefined);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authenticationInterceptor])),
        provideHttpClientTesting(),
        { provide: UserSessionService, useValue: { jwt: jwtSignal } },
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

  it('adds Authorization header for API calls when JWT is present', () => {
    jwtSignal.set(JWT);

    http.get(API_URL).subscribe();

    const request = httpMock.expectOne(API_URL);
    expect(request.request.headers.get('Authorization')).toBe(`Bearer ${JWT}`);
  });

  it('does not add Authorization header for API calls when JWT is not present', () => {
    http.get(API_URL).subscribe();

    const request = httpMock.expectOne(API_URL);
    expect(request.request.headers.get('Authorization')).toBeNull();
  });

  it('does not add Authorization header for non-API relative URLs', () => {
    jwtSignal.set(JWT);

    http.get('/assets/image.png').subscribe();

    const request = httpMock.expectOne('/assets/image.png');
    expect(request.request.headers.get('Authorization')).toBeNull();
  });

  it('does not add Authorization header for absolute URLs', () => {
    jwtSignal.set(JWT);

    http.get('https://absolute.com/url').subscribe();

    const request = httpMock.expectOne('https://absolute.com/url');
    expect(request.request.headers.get('Authorization')).toBeNull();
  });
});
