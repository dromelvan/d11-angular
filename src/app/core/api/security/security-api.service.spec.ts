import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { ApiService } from '@app/core/api/api.service';
import { PostFn } from '@app/core/api/test/api.mock';
import { userCredentials } from '@app/core/api/test/user-credentials.mock';
import { AuthenticationResponseBody } from './authentication-response-body.model';
import { AuthorizationResponseBody } from './authorization-response-body.model';
import { UnauthorizationResponseBody } from './unauthorization-response-body.model';
import { SecurityApiService } from './security-api.service';

describe('SecurityApiService', () => {
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
      user: { name: 'Foo', administrator: false },
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

    it('maps the result on authenticate', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(authenticationResponse)) as PostFn;

      const jwt = await firstValueFrom(securityApi.authenticate(userCredentials));

      expect(jwt).toBe(authenticationResponse.jwt);
    });

    it('propagates errors on authenticate', async () => {
      const httpError = new Error('INVALID');

      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => httpError)) as PostFn;

      await expect(firstValueFrom(securityApi.authenticate(userCredentials))).rejects.toThrow(
        httpError.message,
      );
    });

    it('does not map the result on authenticate error', async () => {
      apiServiceMock.post = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('INVALID'))) as PostFn;

      await expect(
        firstValueFrom(securityApi.authenticate(userCredentials)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // Authorize -------------------------------------------------------------------------------------

  describe('authorize', () => {
    const authorizationResponse: AuthorizationResponseBody = {
      user: { name: 'Foo', administrator: false },
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

    it('maps the result on authorize', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(authorizationResponse)) as PostFn;

      const jwt = await firstValueFrom(securityApi.authorize());

      expect(jwt).toBe(authorizationResponse.jwt);
    });

    it('propagates errors on authorize', async () => {
      const httpError = new Error('INVALID');

      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => httpError)) as PostFn;

      await expect(firstValueFrom(securityApi.authorize())).rejects.toThrow(httpError.message);
    });

    it('does not map the result on authorize error', async () => {
      apiServiceMock.post = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('INVALID'))) as PostFn;

      await expect(firstValueFrom(securityApi.authorize())).rejects.toBeInstanceOf(Error);
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
});
