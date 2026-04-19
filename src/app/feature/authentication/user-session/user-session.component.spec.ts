import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { userEvent } from '@testing-library/user-event';
import { UserSessionService } from '@app/core/auth/user-session.service';
import { RouterService } from '@app/core/router/router.service';
import { UserSessionComponent } from './user-session.component';

describe('UserSessionComponent', () => {
  let fixture: ComponentFixture<UserSessionComponent>;
  let mockUserSession: {
    loggedIn: ReturnType<typeof signal<boolean>>;
    unauthorize: ReturnType<typeof vi.fn>;
  };
  let mockRouterService: { navigateToLogin: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockUserSession = {
      loggedIn: signal(false),
      unauthorize: vi.fn().mockReturnValue(of(true)),
    };
    mockRouterService = {
      navigateToLogin: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [UserSessionComponent],
      providers: [
        { provide: UserSessionService, useValue: mockUserSession },
        { provide: RouterService, useValue: mockRouterService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSessionComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders user icon when logged out', () => {
    mockUserSession.loggedIn.set(false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const icon = host.querySelector('app-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('icon', 'account_circle');

    expect(host.querySelector('app-avatar')).not.toBeInTheDocument();
    expect(host.querySelector('p-menu')).not.toBeInTheDocument();
  });

  it('renders avatar when logged in', () => {
    mockUserSession.loggedIn.set(true);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('app-avatar')).toBeInTheDocument();
    expect(host.querySelector('app-icon-user-circle')).not.toBeInTheDocument();
  });

  it('renders menu when logged in', () => {
    mockUserSession.loggedIn.set(true);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('p-menu')).toBeInTheDocument();
  });

  it('navigates to login when account icon is clicked while logged out', async () => {
    mockUserSession.loggedIn.set(false);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    await userEvent.click(button);

    expect(mockRouterService.navigateToLogin).toHaveBeenCalled();
  });
});
