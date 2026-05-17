import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { SecurityApiService } from '@app/core/api';
import { AuthenticationResponseBody } from '@app/core/api/security/authentication-response-body.model';
import { AuthorizationResponseBody } from '@app/core/api/security/authorization-response-body.model';
import { fakeD11TeamBase, fakeUser, userCredentials } from '@app/test';
import { UserSessionService } from './user-session.service';

describe('UserSessionService', () => {
  const TOKEN = 'token';
  const EXPIRES_FUTURE = new Date(Date.now() + 60_000).toISOString();
  const EXPIRES_PAST = new Date(Date.now() - 60_000).toISOString();
  const user = fakeUser();
  const d11TeamBase = fakeD11TeamBase();
  const authenticateResponse: AuthenticationResponseBody = {
    user,
    d11Team: d11TeamBase,
    jwt: TOKEN,
    expiresAt: EXPIRES_FUTURE,
    persistent: false,
  };
  const authorizeResponse: AuthorizationResponseBody = {
    user,
    d11Team: d11TeamBase,
    jwt: TOKEN,
    expiresAt: EXPIRES_FUTURE,
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

  it('is created with all signals undefined and loggedIn false', () => {
    expect(userSession).toBeTruthy();
    expect(userSession.jwt()).toBeUndefined();
    expect(userSession.expiresAt()).toBeUndefined();
    expect(userSession.user()).toBeUndefined();
    expect(userSession.d11Team()).toBeUndefined();
    expect(userSession.loggedIn()).toBe(false);
  });

  // loggedIn --------------------------------------------------------------------------------------

  describe('loggedIn', () => {
    it('is false when jwt is undefined', () => {
      expect(userSession.loggedIn()).toBe(false);
    });

    it('is true when jwt is set', () => {
      userSession.jwt.set(TOKEN);

      expect(userSession.loggedIn()).toBe(true);
    });

    it('is false when jwt is cleared', () => {
      userSession.jwt.set(TOKEN);
      userSession.jwt.set(undefined);

      expect(userSession.loggedIn()).toBe(false);
    });
  });

  // isJwtExpired ----------------------------------------------------------------------------------

  describe('isJwtExpired', () => {
    it('returns false when expiresAt is not set', () => {
      expect(userSession.isJwtExpired()).toBe(false);
    });

    it('returns false when expiresAt is more than 10 seconds away', () => {
      userSession.expiresAt.set(EXPIRES_FUTURE);

      expect(userSession.isJwtExpired()).toBe(false);
    });

    it('returns true when expiresAt is within 10 seconds', () => {
      userSession.expiresAt.set(new Date(Date.now() + 5_000).toISOString());

      expect(userSession.isJwtExpired()).toBe(true);
    });

    it('returns true when expiresAt is in the past', () => {
      userSession.expiresAt.set(EXPIRES_PAST);

      expect(userSession.isJwtExpired()).toBe(true);
    });
  });

  // authenticate ----------------------------------------------------------------------------------

  describe('authenticate', () => {
    it('sets all signals on success', async () => {
      securityApi.authenticate.mockReturnValue(of(authenticateResponse));

      const result = await firstValueFrom(userSession.authenticate(userCredentials));

      expect(result).toBe(TOKEN);
      expect(userSession.jwt()).toBe(TOKEN);
      expect(userSession.expiresAt()).toBe(EXPIRES_FUTURE);
      expect(userSession.user()).toEqual(user);
      expect(userSession.d11Team()).toEqual(d11TeamBase);
      expect(securityApi.authenticate).toHaveBeenCalledExactlyOnceWith(userCredentials);
    });

    it('does not set any signals on error', async () => {
      securityApi.authenticate.mockReturnValue(throwError(() => new Error('INVALID')));

      try {
        await firstValueFrom(userSession.authenticate(userCredentials));
      } catch {}

      expect(userSession.jwt()).toBeUndefined();
      expect(userSession.expiresAt()).toBeUndefined();
      expect(userSession.user()).toBeUndefined();
      expect(userSession.d11Team()).toBeUndefined();
    });
  });

  // authorize -------------------------------------------------------------------------------------

  describe('authorize', () => {
    it('sets all signals on success', async () => {
      securityApi.authorize.mockReturnValue(of(authorizeResponse));

      const result = await firstValueFrom(userSession.authorize());

      expect(result).toBe(TOKEN);
      expect(userSession.jwt()).toBe(TOKEN);
      expect(userSession.expiresAt()).toBe(EXPIRES_FUTURE);
      expect(userSession.user()).toEqual(user);
      expect(userSession.d11Team()).toEqual(d11TeamBase);
      expect(securityApi.authorize).toHaveBeenCalledOnce();
    });

    it('does not set any signals on error', async () => {
      securityApi.authorize.mockReturnValue(throwError(() => new Error('INVALID')));

      try {
        await firstValueFrom(userSession.authorize());
      } catch {}

      expect(userSession.jwt()).toBeUndefined();
      expect(userSession.expiresAt()).toBeUndefined();
      expect(userSession.user()).toBeUndefined();
      expect(userSession.d11Team()).toBeUndefined();
    });
  });

  // unauthorize -----------------------------------------------------------------------------------

  describe('unauthorize', () => {
    beforeEach(() => {
      userSession.jwt.set(TOKEN);
      userSession.expiresAt.set(EXPIRES_FUTURE);
      userSession.user.set(user);
      userSession.d11Team.set(d11TeamBase);
    });

    it('clears all signals on success', async () => {
      securityApi.unauthorize.mockReturnValue(of(true));

      const result = await firstValueFrom(userSession.unauthorize());

      expect(result).toBe(true);
      expect(userSession.jwt()).toBeUndefined();
      expect(userSession.expiresAt()).toBeUndefined();
      expect(userSession.user()).toBeUndefined();
      expect(userSession.d11Team()).toBeUndefined();
      expect(securityApi.unauthorize).toHaveBeenCalledOnce();
    });

    it('does not clear any signals on failure', async () => {
      securityApi.unauthorize.mockReturnValue(of(false));

      const result = await firstValueFrom(userSession.unauthorize());

      expect(result).toBe(false);
      expect(userSession.jwt()).toBe(TOKEN);
      expect(userSession.expiresAt()).toBe(EXPIRES_FUTURE);
      expect(userSession.user()).toEqual(user);
      expect(userSession.d11Team()).toEqual(d11TeamBase);
      expect(securityApi.unauthorize).toHaveBeenCalledOnce();
    });

    it('does not clear any signals on error', async () => {
      securityApi.unauthorize.mockReturnValue(throwError(() => new Error('ERROR')));

      try {
        await firstValueFrom(userSession.unauthorize());
      } catch {}

      expect(userSession.jwt()).toBe(TOKEN);
      expect(userSession.expiresAt()).toBe(EXPIRES_FUTURE);
      expect(userSession.user()).toEqual(user);
      expect(userSession.d11Team()).toEqual(d11TeamBase);
      expect(securityApi.unauthorize).toHaveBeenCalledOnce();
    });
  });
});
