import { Component, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { UserCredentialsModel } from '@app/core/api';
import { UserSessionService } from '@app/core/auth/user-session.service';
import { userCredentials } from '@app/core/api/test/user-credentials.mock';
import { LoginComponent } from './login.component';

@Component({
  template: ` <app-login /> `,
  standalone: true,
  imports: [LoginComponent],
})
class HostComponent {}

describe('LoginComponent', () => {
  let username: HTMLInputElement;
  let password: HTMLInputElement;
  let persistent: HTMLElement;
  let button: HTMLButtonElement;
  let user: ReturnType<typeof userEvent.setup>;
  let userSession: Partial<UserSessionService>;

  async function submitCredentials() {
    await user.type(username, userCredentials.username);
    await user.type(password, userCredentials.password);
    await user.click(persistent);
    await user.click(button);
  }

  beforeEach(async () => {
    userSession = {
      jwt: signal<string | undefined>(undefined),
      authenticate: vi.fn<(userCredentials: UserCredentialsModel) => Observable<string>>(),
    };

    await render(HostComponent, {
      componentProviders: [{ provide: UserSessionService, useValue: userSession }],
    });

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

    // Temporary until real user notification is added
    expect(screen.queryByText(/^jwt:/)).not.toBeInTheDocument();
  });

  it('succeeds login with valid credentials', async () => {
    const TOKEN = 'token';

    userSession.authenticate = vi.fn().mockImplementation(() => {
      userSession.jwt?.set(TOKEN);
      return of(TOKEN);
    });

    await submitCredentials();

    expect(userSession.authenticate).toHaveBeenCalledExactlyOnceWith(userCredentials);
    expect(button).toBeDisabled();

    // Temporary until real user notification is added
    expect(screen.getByText(`jwt: ${TOKEN}`)).toBeInTheDocument();
  });

  it('fails login with invalid credentials', async () => {
    userSession.authenticate = vi.fn().mockReturnValue(throwError(() => new Error('INVALID')));

    await submitCredentials();

    expect(userSession.authenticate).toHaveBeenCalledExactlyOnceWith(userCredentials);
    expect(button).toBeDisabled();

    // Temporary until real user notification is added
    expect(screen.queryByText(/^jwt:/)).not.toBeInTheDocument();
  });

  it('does not submit when form is invalid', async () => {
    await user.click(button);

    expect(userSession.authenticate).not.toHaveBeenCalled();
  });
});
