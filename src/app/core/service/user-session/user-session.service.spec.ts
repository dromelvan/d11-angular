import { TestBed } from '@angular/core/testing';

import { UserSessionService } from '@app/core/service';
import { SecurityApiService } from '@app/core/api';
import { firstValueFrom, of, throwError } from 'rxjs';
import { userCredentials } from '@app/core/api/test';

describe('UserSessionService', () => {
  let userSession: UserSessionService;
  let securityApi: {
    authenticate: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    securityApi = {
      authenticate: vi.fn(),
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

  it('sets jwt on successful authentication', async () => {
    const TOKEN = 'token';

    securityApi.authenticate.mockReturnValue(of(TOKEN));

    const result = await firstValueFrom(userSession.authenticate(userCredentials));

    expect(result).toBe(TOKEN);
    expect(userSession.jwt()).toBe(TOKEN);
    expect(securityApi.authenticate).toHaveBeenCalledExactlyOnceWith(userCredentials);
  });

  it('does not set jwt on failed authentication', async () => {
    securityApi.authenticate.mockReturnValue(throwError(() => new Error('INVALID')));

    try {
      await firstValueFrom(userSession.authenticate(userCredentials));
    } catch {}

    expect(userSession.jwt()).toBeUndefined();
    expect(securityApi.authenticate).toHaveBeenCalledExactlyOnceWith(userCredentials);
  });
});
