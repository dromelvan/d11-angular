import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { expect } from 'vitest';
import { SecurityApiService } from '@app/core/api';
import { userCredentials } from '@app/core/api/test';
import { UserSessionStore } from '@app/core/store';

const securityApiMock = {
  authenticate: vi.fn(),
};

describe('UserSessionStore', () => {
  let userSession: InstanceType<typeof UserSessionStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserSessionStore, { provide: SecurityApiService, useValue: securityApiMock }],
    });

    userSession = TestBed.inject(UserSessionStore);
    vi.clearAllMocks();
  });

  it('initializes with jwt undefined', () => {
    expect(userSession.jwt()).toBeUndefined();
  });

  it('patches jwt on successful authentication', async () => {
    securityApiMock.authenticate.mockReturnValue(of('token'));

    await firstValueFrom(userSession.authenticate(userCredentials));

    expect(userSession.jwt()).toBe('token');
    expect(securityApiMock.authenticate).toHaveBeenCalledExactlyOnceWith(userCredentials);
  });

  it('does not patch jwt on authentication error', async () => {
    const authenticationError = new Error('error');
    let caughtError = undefined;
    securityApiMock.authenticate.mockReturnValue(throwError(() => authenticationError));

    try {
      await firstValueFrom(userSession.authenticate(userCredentials));
    } catch (error) {
      caughtError = error;
    }

    expect(userSession.jwt()).toBeUndefined();
    expect(caughtError).toBe(authenticationError);
    expect(securityApiMock.authenticate).toHaveBeenCalledExactlyOnceWith(userCredentials);
  });
});
