import { Component, signal } from '@angular/core';
import { of } from 'rxjs';
import { render, screen, waitFor } from '@testing-library/angular';
import { UserSessionService } from '@app/core/auth/user-session.service';
import { UserSessionComponent } from './user-session.component';

@Component({
  template: ` <app-user-session data-testid="user-session" /> `,
  standalone: true,
  imports: [UserSessionComponent],
})
class HostComponent {}

describe('UserSessionComponent', () => {
  let service: {
    loggedIn: ReturnType<typeof signal<boolean>>;
    unauthorize: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    service = {
      loggedIn: signal(false),
      unauthorize: vi.fn().mockReturnValue(of(true)),
    };

    await render(HostComponent, {
      providers: [{ provide: UserSessionService, useValue: service }],
    });
  });

  it('renders user icon when logged out', async () => {
    service.loggedIn.set(false);

    const component = screen.getByTestId('user-session');
    expect(component).toBeInTheDocument();

    const icon = component.querySelector('app-icon-user-circle');
    expect(icon).toBeInTheDocument();

    const avatar = component.querySelector('app-avatar');
    expect(avatar).not.toBeInTheDocument();

    const menu = component.querySelector('p-menu');
    expect(menu).not.toBeInTheDocument();
  });

  it('renders avatar when logged in', async () => {
    service.loggedIn.set(true);

    const component = screen.getByTestId('user-session');
    expect(component).toBeInTheDocument();

    await waitFor(() => {
      const avatar = component.querySelector('app-avatar');
      expect(avatar).toBeInTheDocument();
    });

    const icon = component.querySelector('app-icon-user-circle');
    expect(icon).not.toBeInTheDocument();
  });

  it('renders menu when logged in', async () => {
    service.loggedIn.set(true);

    const component = screen.getByTestId('user-session');

    await waitFor(() => {
      const menu = component.querySelector('p-menu');
      expect(menu).toBeInTheDocument();
    });
  });
});
