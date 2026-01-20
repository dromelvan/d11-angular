import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { SecurityApiService, UserCredentialsModel } from '@app/core/api';
import { ApiService } from '@app/core/api/api.service';
import { PostFn } from '@app/core/api/test';
import { AuthenticationResponseBody } from './authentication-response-body.model';

describe('SecurityApiService', () => {
  const userCredentials: UserCredentialsModel = {
    username: 'foo@bar.com',
    password: 'passw0rd',
    persistent: true,
  };

  const response: AuthenticationResponseBody = {
    user: { name: 'Foo', administrator: false },
    jwt: 'token',
    expiresAt: '1070-01-01T00:00:00',
    persistent: true,
  };

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

    expect(jwt).toBe(response.jwt);
  });

  it('propagates errors on authenticate', async () => {
    const httpError = new Error('INVALID');

    apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => httpError)) as PostFn;

    await expect(firstValueFrom(securityApi.authenticate(userCredentials))).rejects.toThrow(
      httpError.message,
    );
  });

  it('does not map the result on authenticate error', async () => {
    apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => new Error('INVALID'))) as PostFn;

    await expect(firstValueFrom(securityApi.authenticate(userCredentials))).rejects.toBeInstanceOf(
      Error,
    );
  });
});
