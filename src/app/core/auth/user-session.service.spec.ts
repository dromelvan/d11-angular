import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { SecurityApiService } from '@app/core/api';
import { AuthenticationResponseBody } from '@app/core/api/security/authentication-response-body.model';
import { AuthorizationResponseBody } from '@app/core/api/security/authorization-response-body.model';
import { fakeD11TeamBase, fakeUser, userCredentials } from '@app/test';
import { UserSessionService } from './user-session.service';

describe('UserSessionService', () => {
  const TOKEN = 'token';
  const user = fakeUser();
  const d11TeamBase = fakeD11TeamBase();
  const authenticateResponse: AuthenticationResponseBody = {
    user: user,
    d11Team: d11TeamBase,
    jwt: TOKEN,
    expiresAt: '1970-01-01T00:00:00',
    persistent: false,
  };
  const authorizeResponse: AuthorizationResponseBody = {
    user: user,
    d11Team: d11TeamBase,
    jwt: TOKEN,
    expiresAt: '1970-01-01T00:00:00',
    persistent: false,
  };

  let userSession: UserSessionService;
  let securityApi: {
    authenticate: ReturnType<typeof vi.fn>;
    authorize: ReturnType<typeof vi.fn>;
    unauthorize: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    securityApi = {
      authenticate: vi.fn(),
      authorize: vi.fn(),
      unauthorize: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [UserSessionService, { provide: SecurityApiService, useValue: securityApi }],
    });

    userSession = TestBed.inject(UserSessionService);
  });

  it('is created', () => {
    expect(userSession).toBeTruthy();
    expect(userSession.jwt()).toBeUndefined();
    expect(userSession.user()).toBeUndefined();
    expect(userSession.d11Team()).toBeUndefined();
    expect(userSession.loggedIn()).toBe(false);
  });

  // Logged In -------------------------------------------------------------------------------------

  describe('loggedIn', () => {
    it('is false on undefined jwt', () => {
      expect(userSession.jwt()).toBeUndefined();
      expect(userSession.loggedIn()).toBe(false);
    });

    it('is true on set jwt', () => {
      userSession.jwt.set(TOKEN);

      expect(userSession.jwt()).toBe(TOKEN);
      expect(userSession.loggedIn()).toBe(true);
    });

    it('is false on cleared jwt', () => {
      userSession.jwt.set(TOKEN);
      userSession.jwt.set(undefined);

      expect(userSession.jwt()).toBeUndefined();
      expect(userSession.loggedIn()).toBe(false);
    });
  });

  // Authenticate ----------------------------------------------------------------------------------

  describe('authenticate', () => {
    it('sets jwt, user and d11Team on authenticate', async () => {
      securityApi.authenticate.mockReturnValue(of(authenticateResponse));

      const result = await firstValueFrom(userSession.authenticate(userCredentials));

      expect(result).toBe(TOKEN);
      expect(userSession.jwt()).toBe(TOKEN);
      expect(userSession.user()).toEqual(user);
      expect(userSession.d11Team()).toEqual(d11TeamBase);
      expect(securityApi.authenticate).toHaveBeenCalledExactlyOnceWith(userCredentials);
    });

    it('does not set jwt, user or d11Team on authenticate error', async () => {
      securityApi.authenticate.mockReturnValue(throwError(() => new Error('INVALID')));

      try {
        await firstValueFrom(userSession.authenticate(userCredentials));
      } catch {}

      expect(userSession.jwt()).toBeUndefined();
      expect(userSession.user()).toBeUndefined();
      expect(userSession.d11Team()).toBeUndefined();
      expect(securityApi.authenticate).toHaveBeenCalledExactlyOnceWith(userCredentials);
    });
  });

  // Authorize -------------------------------------------------------------------------------------

  describe('authorize', () => {
    it('sets jwt, user and d11Team on authorize', async () => {
      securityApi.authorize.mockReturnValue(of(authorizeResponse));

      const result = await firstValueFrom(userSession.authorize());

      expect(result).toBe(TOKEN);
      expect(userSession.jwt()).toBe(TOKEN);
      expect(userSession.user()).toEqual(user);
      expect(userSession.d11Team()).toEqual(d11TeamBase);
      expect(securityApi.authorize).toHaveBeenCalledOnce();
    });

    it('does not set jwt, user or d11Team on authorize error', async () => {
      securityApi.authorize.mockReturnValue(throwError(() => new Error('INVALID')));

      try {
        await firstValueFrom(userSession.authorize());
      } catch {}

      expect(userSession.jwt()).toBeUndefined();
      expect(userSession.user()).toBeUndefined();
      expect(userSession.d11Team()).toBeUndefined();
      expect(securityApi.authorize).toHaveBeenCalledOnce();
    });
  });

  // Unauthorize -----------------------------------------------------------------------------------

  describe('unauthorize', () => {
    beforeEach(() => {
      userSession.jwt.set(TOKEN);
      userSession.user.set(user);
      userSession.d11Team.set(d11TeamBase);
    });

    it('clears jwt, user and d11Team on unauthorize', async () => {
      securityApi.unauthorize.mockReturnValue(of(true));

      const result = await firstValueFrom(userSession.unauthorize());

      expect(result).toBe(true);
      expect(userSession.jwt()).toBeUndefined();
      expect(userSession.user()).toBeUndefined();
      expect(userSession.d11Team()).toBeUndefined();
      expect(securityApi.unauthorize).toHaveBeenCalledOnce();
    });

    it('does not clear jwt, user or d11Team on unauthorize failure', async () => {
      securityApi.unauthorize.mockReturnValue(of(false));

      const result = await firstValueFrom(userSession.unauthorize());

      expect(result).toBe(false);
      expect(userSession.jwt()).toBe(TOKEN);
      expect(userSession.user()).toEqual(user);
      expect(userSession.d11Team()).toEqual(d11TeamBase);
      expect(securityApi.unauthorize).toHaveBeenCalledOnce();
    });

    it('does not clear jwt, user or d11Team on unauthorize error', async () => {
      securityApi.unauthorize.mockReturnValue(throwError(() => new Error('ERROR')));

      try {
        await firstValueFrom(userSession.unauthorize());
      } catch {}

      expect(userSession.jwt()).toBe(TOKEN);
      expect(userSession.user()).toEqual(user);
      expect(userSession.d11Team()).toEqual(d11TeamBase);
      expect(securityApi.unauthorize).toHaveBeenCalledOnce();
    });
  });
});
