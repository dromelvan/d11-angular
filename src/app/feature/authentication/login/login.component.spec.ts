import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { UserCredentialsModel } from '@app/core/api';
import { UserSessionService } from '@app/core/auth/user-session.service';
import { RouterService } from '@app/core/router/router.service';
import { MessageService } from 'primeng/api';
import { userCredentials } from '@app/test';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let username: HTMLInputElement;
  let password: HTMLInputElement;
  let persistent: HTMLElement;
  let button: HTMLButtonElement;
  let user: ReturnType<typeof userEvent.setup>;
  let mockUserSession: { authenticate: ReturnType<typeof vi.fn> };
  let mockRouterService: { navigateToCurrentMatchWeek: ReturnType<typeof vi.fn> };
  let mockMessageService: { add: ReturnType<typeof vi.fn> };

  async function submitCredentials() {
    await user.type(username, userCredentials.username);
    await user.type(password, userCredentials.password);
    await user.click(persistent);
    await user.click(button);
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    mockUserSession = {
      authenticate: vi.fn<(userCredentials: UserCredentialsModel) => Observable<string>>(),
    };
    mockRouterService = {
      navigateToCurrentMatchWeek: vi.fn().mockResolvedValue(true),
    };
    mockMessageService = {
      add: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: UserSessionService, useValue: mockUserSession },
        { provide: RouterService, useValue: mockRouterService },
        { provide: MessageService, useValue: mockMessageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    username = screen.getByRole('textbox', { name: 'Email Address' });
    password = screen.getByLabelText('Password');
    persistent = screen.getByRole('checkbox', { name: 'Remember me' });
    button = screen.getByRole('button');
    user = userEvent.setup();
  });

  it('renders', () => {
    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(persistent).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('navigates to root on successful login', async () => {
    mockUserSession.authenticate = vi.fn().mockReturnValue(of('token'));

    await submitCredentials();

    expect(mockUserSession.authenticate).toHaveBeenCalledExactlyOnceWith(userCredentials);
    expect(mockRouterService.navigateToCurrentMatchWeek).toHaveBeenCalled();
  });

  it('shows error toast on 401', async () => {
    mockUserSession.authenticate = vi
      .fn()
      .mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

    await submitCredentials();

    expect(mockRouterService.navigateToCurrentMatchWeek).not.toHaveBeenCalled();
    expect(mockMessageService.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error' }),
    );
  });

  it('does not show toast on non-401 error', async () => {
    mockUserSession.authenticate = vi
      .fn()
      .mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    await submitCredentials();

    expect(mockMessageService.add).not.toHaveBeenCalled();
  });

  it('does not submit when form is invalid', async () => {
    await user.click(button);

    expect(mockUserSession.authenticate).not.toHaveBeenCalled();
  });
});
