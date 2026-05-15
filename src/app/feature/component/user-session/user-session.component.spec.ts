import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { userEvent } from '@testing-library/user-event';
import { UserActionService } from '@app/core/auth/user-action.service';
import { UserSessionService } from '@app/core/auth/user-session.service';
import { RouterService } from '@app/core/router/router.service';
import { UserSessionComponent } from './user-session.component';

describe('UserSessionComponent', () => {
  let fixture: ComponentFixture<UserSessionComponent>;
  let mockUserSession: { loggedIn: ReturnType<typeof signal<boolean>> };
  let mockUserActionService: {
    drawerVisible: ReturnType<typeof signal<boolean>>;
    open: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
    onLogout: ReturnType<typeof vi.fn>;
  };
  let mockRouterService: { navigateToLogin: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockUserSession = { loggedIn: signal(false) };
    mockUserActionService = {
      drawerVisible: signal(false),
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
