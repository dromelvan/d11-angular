import { Component, computed, signal, Signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { UserCredentialsModel } from '@app/core/api';
import { UserSessionStore } from '@app/core/store';
import { LoginComponent } from './login.component';

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

  const TOKEN = 'token';

  const userCredentials = {
    username: USERNAME,
    password: PASSWORD,
    persistent: true,
  } as UserCredentialsModel;

  const jwtSignal = signal<string | undefined>(undefined);

  interface UserSessionStoreMock {
    authenticate: (userCredentials: UserCredentialsModel) => Observable<string>;
    jwt: Signal<string | undefined>;
  }

  let username: HTMLInputElement;
  let password: HTMLInputElement;
  let persistent: HTMLElement;
  let button: HTMLButtonElement;
  let user: ReturnType<typeof userEvent.setup>;
  let userSession: Partial<UserSessionStoreMock>;

  async function submitCredentials() {
    await user.type(username, USERNAME);
    await user.type(password, PASSWORD);
    await user.click(persistent);
    await user.click(button);
  }

  beforeEach(async () => {
    jwtSignal.set(undefined);

    userSession = {
      authenticate: vi.fn(),
      jwt: computed(() => jwtSignal()),
    };

    await render(HostComponent, {
      componentProviders: [{ provide: UserSessionStore, useValue: userSession }],
    });

    username = screen.getByRole('textbox', { name: USERNAME_LABEL });
    password = screen.getByLabelText(PASSWORD_LABEL);
    persistent = screen.getByRole('checkbox', { name: PERSISTENT_LABEL });
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
    userSession.authenticate = vi.fn().mockImplementation(() => {
      jwtSignal.set(TOKEN);
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
