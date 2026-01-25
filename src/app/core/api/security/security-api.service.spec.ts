import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { SecurityApiService } from '@app/core/api';
import { ApiService } from '@app/core/api/api.service';
import { PostFn, userCredentials } from '@app/core/api/test';
import { AuthenticationResponseBody } from './authentication-response-body.model';
import { AuthorizationResponseBody } from './authorization-response-body.model';

describe('SecurityApiService', () => {
  let response: AuthenticationResponseBody | AuthorizationResponseBody;
  let securityApi: SecurityApiService;
  let apiServiceMock: { post: PostFn };

  beforeEach(() => {
    apiServiceMock = {
      post: vi.fn().mockReturnValue(of(response)) as PostFn,
    };

    TestBed.configureTestingModule({
      providers: [SecurityApiService, { provide: ApiService, useValue: apiServiceMock }],
    });

    securityApi = TestBed.inject(SecurityApiService);
  });

  it('is created', () => {
    expect(securityApi).toBeTruthy();
  });

  // Authenticate ----------------------------------------------------------------------------------

  describe('authenticate', () => {
    const authenticationResponse: AuthenticationResponseBody = {
      user: { name: 'Foo', administrator: false },
      jwt: 'token',
      expiresAt: '1070-01-01T00:00:00',
      persistent: true,
    };

    response = authenticationResponse;

    it('calls post on authenticate', async () => {
      await firstValueFrom(securityApi.authenticate(userCredentials));

      expect(apiServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        securityApi.namespace,
        'authenticate',
        userCredentials,
      );
    });

    it('maps the result on authenticate', async () => {
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
      jwt: 'token',
      expiresAt: '1070-01-01T00:00:00',
      persistent: true,
    };

    response = authorizationResponse;

    it('calls post on authorize', async () => {
      await firstValueFrom(securityApi.authorize());

      expect(apiServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        securityApi.namespace,
        'authorize',
        {},
      );
    });

    it('maps the result on authorize', async () => {
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
});
