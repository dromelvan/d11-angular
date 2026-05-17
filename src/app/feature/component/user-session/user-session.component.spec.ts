import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { userEvent } from '@testing-library/user-event';
import { UserActionService } from '@app/core/auth/user-action.service';
import { D11TeamBase } from '@app/core/api/model/d11-team-base.model';
import { UserSessionService } from '@app/core/auth/user-session.service';
import { fakeD11TeamBase } from '@app/test';
import { RouterService } from '@app/core/router/router.service';
import { UserSessionComponent } from './user-session.component';

describe('UserSessionComponent', () => {
  let fixture: ComponentFixture<UserSessionComponent>;
  let mockUserSession: {
    loggedIn: ReturnType<typeof signal<boolean>>;
    d11Team: ReturnType<typeof signal<D11TeamBase | undefined>>;
  };
  let mockUserActionService: {
    drawerVisible: ReturnType<typeof signal<boolean>>;
    isAdministrator: ReturnType<typeof signal<boolean>>;
    open: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
    onLogout: ReturnType<typeof vi.fn>;
  };
  let mockRouterService: { navigateToLogin: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockUserSession = {
      loggedIn: signal(false),
      d11Team: signal<D11TeamBase | undefined>(undefined),
    };
    mockUserActionService = {
      drawerVisible: signal(false),
      isAdministrator: signal(false),
      open: vi.fn(),
      close: vi.fn(),
      onLogout: vi.fn(),
    };
    mockRouterService = { navigateToLogin: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [UserSessionComponent],
      providers: [
        { provide: UserSessionService, useValue: mockUserSession },
        { provide: UserActionService, useValue: mockUserActionService },
        { provide: RouterService, useValue: mockRouterService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSessionComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders user icon when logged out', () => {
    const host = fixture.nativeElement as HTMLElement;
    const icon = host.querySelector('app-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('icon', 'account_circle');
    expect(host.querySelector('app-avatar')).not.toBeInTheDocument();
  });

  it('renders avatar when logged in', () => {
    mockUserSession.loggedIn.set(true);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('app-avatar')).toBeInTheDocument();
    expect(host.querySelector('app-icon')).not.toBeInTheDocument();
  });

  it('d11TeamId uses d11Team id when d11Team is set', () => {
    const d11Team = fakeD11TeamBase();
    mockUserSession.d11Team.set(d11Team);

    expect(fixture.componentInstance['d11TeamId']()).toBe(d11Team.id);
  });

  it('d11TeamId falls back to 1 when d11Team is not set', () => {
    expect(fixture.componentInstance['d11TeamId']()).toBe(1);
  });

  it('calls userActionService.open() when avatar is clicked', async () => {
    mockUserSession.loggedIn.set(true);
    fixture.detectChanges();

    await userEvent.click(fixture.nativeElement.querySelector('button'));

    expect(mockUserActionService.open).toHaveBeenCalled();
  });

  it('navigates to login when icon button is clicked while logged out', async () => {
    await userEvent.click(fixture.nativeElement.querySelector('button'));

    expect(mockRouterService.navigateToLogin).toHaveBeenCalled();
  });
});
