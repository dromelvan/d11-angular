import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserSessionService } from '@app/core/auth/user-session.service';
import { User } from '@app/core/api/model/user.model';
import { fakeUser } from '@app/test';
import { signal } from '@angular/core';
import { UserActionService } from './user-action.service';

describe('UserActionService', () => {
  let service: UserActionService;
  let mockUserSession: {
    user: ReturnType<typeof signal<User | undefined>>;
    unauthorize: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserSession = {
      user: signal<User | undefined>(undefined),
      unauthorize: vi.fn().mockReturnValue(of(true)),
    };

    TestBed.configureTestingModule({
      providers: [UserActionService, { provide: UserSessionService, useValue: mockUserSession }],
    });

    service = TestBed.inject(UserActionService);
  });

  it('starts with drawer closed', () => {
    expect(service.drawerVisible()).toBe(false);
  });

  it('opens drawer on open()', () => {
    service.open();
    expect(service.drawerVisible()).toBe(true);
  });

  it('closes drawer on close()', () => {
    service.open();
    service.close();
    expect(service.drawerVisible()).toBe(false);
  });

  it('closes drawer and calls unauthorize on onLogout()', () => {
    service.open();
    service.onLogout();
    TestBed.tick();

    expect(service.drawerVisible()).toBe(false);
    expect(mockUserSession.unauthorize).toHaveBeenCalled();
  });

  // isAdministrator -------------------------------------------------------------------------------

  describe('isAdministrator', () => {
    it('is false when user is undefined', () => {
      expect(service.isAdministrator()).toBe(false);
    });

    it('is false when user is not administrator', () => {
      mockUserSession.user.set({ ...fakeUser(), administrator: false });
      expect(service.isAdministrator()).toBe(false);
    });

    it('is true when user is administrator', () => {
      mockUserSession.user.set({ ...fakeUser(), administrator: true });
      expect(service.isAdministrator()).toBe(true);
    });
  });
});
