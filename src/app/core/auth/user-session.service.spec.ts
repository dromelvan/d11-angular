import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { SecurityApiService } from '@app/core/api';
import { userCredentials } from '@app/core/api/test';
import { UserSessionService } from './user-session.service';

describe('UserSessionService', () => {
  const TOKEN = 'token';

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
  });

  // Authenticate ----------------------------------------------------------------------------------

  describe('authenticate', () => {
    it('sets jwt on authenticate', async () => {
      securityApi.authenticate.mockReturnValue(of(TOKEN));

      const result = await firstValueFrom(userSession.authenticate(userCredentials));

      expect(result).toBe(TOKEN);
      expect(userSession.jwt()).toBe(TOKEN);
      expect(securityApi.authenticate).toHaveBeenCalledExactlyOnceWith(userCredentials);
    });

    it('does not set jwt on authenticate error', async () => {
      securityApi.authenticate.mockReturnValue(throwError(() => new Error('INVALID')));

      try {
        await firstValueFrom(userSession.authenticate(userCredentials));
      } catch {}

      expect(userSession.jwt()).toBeUndefined();
      expect(securityApi.authenticate).toHaveBeenCalledExactlyOnceWith(userCredentials);
    });
  });

  // Authorize -------------------------------------------------------------------------------------

  describe('authorize', () => {
    it('sets jwt on authorize', async () => {
      securityApi.authorize.mockReturnValue(of(TOKEN));

      const result = await firstValueFrom(userSession.authorize());

      expect(result).toBe(TOKEN);
      expect(userSession.jwt()).toBe(TOKEN);
      expect(securityApi.authorize).toHaveBeenCalledOnce();
    });

    it('does not set jwt on authorize error', async () => {
      securityApi.authenticate.mockReturnValue(throwError(() => new Error('INVALID')));

      try {
        await firstValueFrom(userSession.authenticate(userCredentials));
      } catch {}

      expect(userSession.jwt()).toBeUndefined();
      expect(securityApi.authenticate).toHaveBeenCalledExactlyOnceWith(userCredentials);
    });
  });

  // Unauthorize -----------------------------------------------------------------------------------

  describe('unauthorize', () => {
    beforeEach(() => {
      userSession.jwt.set(TOKEN);
    });

    it('clears jwt on unauthorize', async () => {
      securityApi.unauthorize.mockReturnValue(of(true));

      const result = await firstValueFrom(userSession.unauthorize());

      expect(result).toBe(true);
      expect(userSession.jwt()).toBeUndefined();
      expect(securityApi.unauthorize).toHaveBeenCalledOnce();
    });

    it('does not clear jwt on unauthorize failure', async () => {
      securityApi.unauthorize.mockReturnValue(of(false));

      const result = await firstValueFrom(userSession.unauthorize());

      expect(result).toBe(false);
      expect(userSession.jwt()).toBe(TOKEN);
      expect(securityApi.unauthorize).toHaveBeenCalledOnce();
    });

    it('does not clear jwt on unauthorize error', async () => {
      securityApi.unauthorize.mockReturnValue(throwError(() => new Error('ERROR')));

      try {
        await firstValueFrom(userSession.unauthorize());
      } catch {}

      expect(userSession.jwt()).toBe(TOKEN);
      expect(securityApi.unauthorize).toHaveBeenCalledOnce();
    });
  });
});
