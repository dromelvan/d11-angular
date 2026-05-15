import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { ApiService } from '@app/core/api/api.service';
import { fakeD11TeamBase, fakeUser, PostFn, userCredentials } from '@app/test';
import { AuthenticationResponseBody } from './authentication-response-body.model';
import { AuthorizationResponseBody } from './authorization-response-body.model';
import { RequestPasswordResetRequestBody } from './request-password-reset-request-body.model';
import { ResetPasswordRequestBody } from './reset-password-request-body.model';
import { SecurityApiService } from './security-api.service';
import { UnauthorizationResponseBody } from './unauthorization-response-body.model';

describe('SecurityApiService', () => {
  const d11Team = fakeD11TeamBase();

  let securityApi: SecurityApiService;
  let apiServiceMock: { post: PostFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SecurityApiService,
        { provide: ApiService, useValue: { post: vi.fn() as PostFn } },
      ],
    });

    securityApi = TestBed.inject(SecurityApiService);
    apiServiceMock = TestBed.inject(ApiService) as { post: PostFn };
  });

  it('is created', () => {
    expect(securityApi).toBeTruthy();
  });

  // Authenticate ----------------------------------------------------------------------------------

  describe('authenticate', () => {
    const authenticationResponse: AuthenticationResponseBody = {
      user: fakeUser(),
      d11Team,
      jwt: 'authenticate-token',
      expiresAt: '1070-01-01T00:00:00',
      persistent: true,
    };

    it('calls post on authenticate', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(authenticationResponse)) as PostFn;

      await firstValueFrom(securityApi.authenticate(userCredentials));

      expect(apiServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        securityApi.namespace,
        'authenticate',
        userCredentials,
      );
    });

    it('returns the response body on authenticate', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(authenticationResponse)) as PostFn;

      const result = await firstValueFrom(securityApi.authenticate(userCredentials));

      expect(result).toEqual(authenticationResponse);
    });

    it('propagates errors on authenticate', async () => {
      const httpError = new Error('INVALID');

      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => httpError)) as PostFn;

      expect(firstValueFrom(securityApi.authenticate(userCredentials))).rejects.toThrow(
        httpError.message,
      );
    });
  });

  // Authorize -------------------------------------------------------------------------------------

  describe('authorize', () => {
    const authorizationResponse: AuthorizationResponseBody = {
      user: fakeUser(),
      d11Team,
      jwt: 'authorize-token',
      expiresAt: '1070-01-01T00:00:00',
      persistent: true,
    };

    it('calls post on authorize', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(authorizationResponse)) as PostFn;

      await firstValueFrom(securityApi.authorize());

      expect(apiServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        securityApi.namespace,
        'authorize',
        {},
      );
    });

    it('returns the response body on authorize', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(authorizationResponse)) as PostFn;

      const result = await firstValueFrom(securityApi.authorize());

      expect(result).toEqual(authorizationResponse);
    });

    it('propagates errors on authorize', async () => {
      const httpError = new Error('INVALID');

      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => httpError)) as PostFn;

      await expect(firstValueFrom(securityApi.authorize())).rejects.toThrow(httpError.message);
    });
  });

  // Unauthorize -----------------------------------------------------------------------------------

  describe('unauthorize', () => {
    const unauthorizationResponse: UnauthorizationResponseBody = {
      loggedOut: true,
    };

    it('calls post on unauthorize', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(unauthorizationResponse)) as PostFn;

      await firstValueFrom(securityApi.unauthorize());

      expect(apiServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        securityApi.namespace,
        'unauthorize',
        {},
      );
    });

    it('maps the result on unauthorize', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(unauthorizationResponse)) as PostFn;

      const loggedOut = await firstValueFrom(securityApi.unauthorize());

      expect(loggedOut).toBe(unauthorizationResponse.loggedOut);
    });

    it('propagates errors on unauthorize', async () => {
      const httpError = new Error('INVALID');

      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => httpError)) as PostFn;

      await expect(firstValueFrom(securityApi.unauthorize())).rejects.toThrow(httpError.message);
    });

    it('does not map the result on unauthorize error', async () => {
      apiServiceMock.post = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('INVALID'))) as PostFn;

      await expect(firstValueFrom(securityApi.unauthorize())).rejects.toBeInstanceOf(Error);
    });
  });

  // requestPasswordReset --------------------------------------------------------------------------

  describe('requestPasswordReset', () => {
    const body: RequestPasswordResetRequestBody = {
      email: 'user@example.com',
      link: 'https://example.com/reset',
    };

    it('calls post with namespace, endpoint and body', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(undefined)) as PostFn;

      await firstValueFrom(securityApi.requestPasswordReset(body));

      expect(apiServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        securityApi.namespace,
        'request-password-reset',
        body,
      );
    });

    it('propagates errors', async () => {
      const error = new Error('BAD_REQUEST');
      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => error)) as PostFn;

      await expect(firstValueFrom(securityApi.requestPasswordReset(body))).rejects.toThrow(
        error.message,
      );
    });
  });

  // resetPassword ---------------------------------------------------------------------------------

  describe('resetPassword', () => {
    const body: ResetPasswordRequestBody = {
      email: 'user@example.com',
      password: 'newpassword',
      resetPasswordToken: '550e8400-e29b-41d4-a716-446655440000',
    };

    it('calls post with namespace, endpoint and body', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(undefined)) as PostFn;

      await firstValueFrom(securityApi.resetPassword(body));

      expect(apiServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        securityApi.namespace,
        'reset-password',
        body,
      );
    });

    it('propagates errors', async () => {
      const error = new Error('UNAUTHORIZED');
      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => error)) as PostFn;

      await expect(firstValueFrom(securityApi.resetPassword(body))).rejects.toThrow(error.message);
    });
  });
});
