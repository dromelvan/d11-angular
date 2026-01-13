import { Component } from '@angular/core';
import { of, throwError } from 'rxjs';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { AuthenticationService, UserSessionModel } from '@app/core/authentication';
import { LoginComponent } from './login.component';
import { expect } from 'vitest';

@Component({
  template: ` <app-login /> `,
  standalone: true,
  imports: [LoginComponent],
})
class HostComponent {}

describe('LoginComponent', () => {
  const USERNAME_LABEL = 'Email Address';
  const PASSWORD_LABEL = 'Password';
  const PERSISTENT_LABEL = 'Remember me';

  const USERNAME = 'foo@bar.com';
  const PASSWORD = 'passw0rd';

  const request = {
    username: USERNAME,
    password: PASSWORD,
    persistent: true,
  };

  const userSession = {
    username: USERNAME,
    token: 'TOKEN',
    persistent: true,
  } as UserSessionModel;

  let username: HTMLInputElement;
  let password: HTMLInputElement;
  let persistent: HTMLElement;
  let button: HTMLButtonElement;
  let user: ReturnType<typeof userEvent.setup>;
  let authenticationService: Pick<AuthenticationService, 'login'>;

  beforeEach(async () => {
    authenticationService = {
      login: vi.fn(),
    };

    await render(HostComponent, {
      componentProviders: [
        {
          provide: AuthenticationService,
          useValue: authenticationService,
        },
      ],
    });

    username = screen.getByRole('textbox', { name: USERNAME_LABEL });
    password = screen.getByLabelText(PASSWORD_LABEL);
    persistent = screen.getByRole('checkbox', { name: PERSISTENT_LABEL });
    button = screen.getByRole('button');
    user = userEvent.setup();
  });

  async function submitCredentials() {
    await user.type(username, USERNAME);
    await user.type(password, PASSWORD);
    await user.click(persistent);
    await user.click(button);
  }

  it('renders', async () => {
    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(persistent).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    // Temporary until real user notification is added
    expect(screen.getByText('Logged in: false')).toBeInTheDocument();
  });

  it('succeeds login with valid credentials', async () => {
    authenticationService.login = vi.fn().mockReturnValue(of(userSession));

    await submitCredentials();

    expect(authenticationService.login).toHaveBeenCalledExactlyOnceWith(request);
    expect(button).toBeDisabled();

    // Temporary until real user notification is added
    expect(screen.getByText('Logged in: true')).toBeInTheDocument();
  });

  it('fails login with invalid credentials', async () => {
    authenticationService.login = vi.fn().mockReturnValue(throwError(() => new Error('INVALID')));

    await submitCredentials();

    expect(authenticationService.login).toHaveBeenCalledExactlyOnceWith(request);
    expect(button).toBeDisabled();

    // Temporary until real user notification is added
    expect(screen.getByText('Logged in: false')).toBeInTheDocument();
  });

  it('does not submit when form is invalid', async () => {
    await user.click(button);

    expect(authenticationService.login).not.toHaveBeenCalled();
  });
});
