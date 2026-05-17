import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserSessionService } from './user-session.service';
import { authenticationInterceptor } from './authentication.interceptor';

const JWT = 'test-jwt-token';
const FRESH_JWT = 'fresh-jwt-token';
const API_URL = `/${environment.apiVersion}/players`;
const SECURITY_URL = `/${environment.apiVersion}/security/authorize`;

describe('authenticationInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let jwtSignal: ReturnType<typeof signal<string | undefined>>;
  let mockUserSession: {
    jwt: ReturnType<typeof signal<string | undefined>>;
    isJwtExpired: ReturnType<typeof vi.fn>;
    authorize: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    jwtSignal = signal<string | undefined>(undefined);
    mockUserSession = {
      jwt: jwtSignal,
      isJwtExpired: vi.fn().mockReturnValue(false),
      authorize: vi.fn().mockReturnValue(of(FRESH_JWT)),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authenticationInterceptor])),
        provideHttpClientTesting(),
        { provide: UserSessionService, useValue: mockUserSession },
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

  // Credentials -----------------------------------------------------------------------------------

  describe('credentials', () => {
    it('adds same-origin credentials for relative URLs', () => {
      http.get('/relative/url').subscribe();

      expect(httpMock.expectOne('/relative/url').request.credentials).toBe('same-origin');
    });

    it('adds same-origin credentials for API calls', () => {
      http.get(API_URL).subscribe();

      expect(httpMock.expectOne(API_URL).request.credentials).toBe('same-origin');
    });

    it('adds same-origin credentials for security calls', () => {
      http.get(SECURITY_URL).subscribe();

      expect(httpMock.expectOne(SECURITY_URL).request.credentials).toBe('same-origin');
    });

    it('does not add credentials for absolute URLs', () => {
      http.get('https://absolute.com/url').subscribe();

      expect(httpMock.expectOne('https://absolute.com/url').request.credentials).toBeUndefined();
    });
  });

  // Authorization header --------------------------------------------------------------------------

  describe('Authorization header', () => {
    it('adds Bearer token for API calls when JWT is present', () => {
      jwtSignal.set(JWT);

      http.get(API_URL).subscribe();

      expect(httpMock.expectOne(API_URL).request.headers.get('Authorization')).toBe(
        `Bearer ${JWT}`,
      );
    });

    it('does not add Authorization header for API calls when JWT is not present', () => {
      http.get(API_URL).subscribe();

      expect(httpMock.expectOne(API_URL).request.headers.get('Authorization')).toBeNull();
    });

    it('does not add Authorization header for non-API relative URLs', () => {
      jwtSignal.set(JWT);

      http.get('/assets/image.png').subscribe();

      expect(
        httpMock.expectOne('/assets/image.png').request.headers.get('Authorization'),
      ).toBeNull();
    });

    it('does not add Authorization header for absolute URLs', () => {
      jwtSignal.set(JWT);

      http.get('https://absolute.com/url').subscribe();

      expect(
        httpMock.expectOne('https://absolute.com/url').request.headers.get('Authorization'),
      ).toBeNull();
    });
  });

  // Security calls --------------------------------------------------------------------------------

  describe('security calls', () => {
    it('does not add Authorization header', () => {
      jwtSignal.set(JWT);

      http.get(SECURITY_URL).subscribe();

      expect(httpMock.expectOne(SECURITY_URL).request.headers.get('Authorization')).toBeNull();
    });

    it('does not call authorize even when JWT is expired', () => {
      jwtSignal.set(JWT);
      mockUserSession.isJwtExpired.mockReturnValue(true);

      http.get(SECURITY_URL).subscribe();
      httpMock.expectOne(SECURITY_URL);

      expect(mockUserSession.authorize).not.toHaveBeenCalled();
    });
  });

  // JWT refresh -----------------------------------------------------------------------------------

  describe('JWT refresh', () => {
    it('does not call authorize when JWT is not expired', () => {
      jwtSignal.set(JWT);

      http.get(API_URL).subscribe();
      httpMock.expectOne(API_URL);

      expect(mockUserSession.authorize).not.toHaveBeenCalled();
    });

    it('calls authorize and uses fresh JWT when token is expired', () => {
      jwtSignal.set(JWT);
      mockUserSession.isJwtExpired.mockReturnValue(true);

      http.get(API_URL).subscribe();

      const request = httpMock.expectOne(API_URL);
      expect(mockUserSession.authorize).toHaveBeenCalled();
      expect(request.request.headers.get('Authorization')).toBe(`Bearer ${FRESH_JWT}`);
    });
  });
});
