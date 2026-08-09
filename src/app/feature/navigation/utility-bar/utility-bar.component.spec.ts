import { signal } from '@angular/core';
import { render } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { PlayerApiService } from '@app/core/api';
import { UserActionService } from '@app/core/auth/user-action.service';
import { UserSessionService } from '@app/core/auth/user-session.service';
import { CurrentService } from '@app/core/current/current.service';
import { RouterService } from '@app/core/router/router.service';
import { UtilityBarComponent } from './utility-bar.component';

function setup() {
  return render(UtilityBarComponent, {
    providers: [
      {
        provide: UserSessionService,
        useValue: { loggedIn: signal(false), d11Team: signal(undefined), user: signal(undefined) },
      },
      {
        provide: UserActionService,
        useValue: {
          drawerVisible: signal(false),
          isAdministrator: signal(false),
          open: vi.fn(),
          close: vi.fn(),
          onLogout: vi.fn(),
        },
      },
      {
        provide: RouterService,
        useValue: {
          navigateToPlayer: vi.fn(),
          navigateToLogin: vi.fn(),
          navigateToCreatePlayer: vi.fn(),
          navigateToCreateTransferWindow: vi.fn(),
        },
      },
      { provide: PlayerApiService, useValue: { search: vi.fn() } },
      {
        provide: CurrentService,
        useValue: { season: signal(undefined), transferWindow: signal(undefined) },
      },
    ],
  });
}

describe('UtilityBarComponent', () => {
  it('renders search icon for mobile', async () => {
    const { container } = await setup();
    const searchIcon = container.querySelector('app-svg-icon[name="search"]');
    expect(searchIcon).toBeInTheDocument();
    expect(searchIcon).toHaveClass('sm:hidden!');
  });

  it('renders search autocomplete for desktop', async () => {
    const { container } = await setup();
    const autocomplete = container.querySelector('app-search-autocomplete');
    expect(autocomplete).toBeInTheDocument();
    expect(autocomplete).toHaveClass('hidden sm:block');
  });

  it('renders search drawer for mobile', async () => {
    const { container } = await setup();
    const drawer = container.querySelector('app-search-drawer');
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveClass('sm:hidden!');
  });

  it('renders user session', async () => {
    const { container } = await setup();
    expect(container.querySelector('app-user-session')).toBeInTheDocument();
  });

  it('opens search drawer when search icon is clicked', async () => {
    const { container } = await setup();
    const drawerPanel = container.querySelector('.app-search-drawer') as HTMLElement;
    expect(drawerPanel).toHaveClass('-translate-y-full');

    await userEvent.click(container.querySelector('app-svg-icon[name="search"]')!);

    expect(drawerPanel).toHaveClass('translate-y-0');
  });
});
