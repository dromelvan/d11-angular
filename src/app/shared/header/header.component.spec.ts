import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { PlayerApiService } from '@app/core/api';
import { UserActionService } from '@app/core/auth/user-action.service';
import { UserSessionService } from '@app/core/auth/user-session.service';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { HeaderComponent } from './header.component';

function mockPageContextService(
  overrides?: Partial<{
    title: string;
    subtitle: string;
    textClass: string | undefined;
    backgroundColor: string | undefined;
  }>,
) {
  return {
    title: signal(overrides?.title ?? 'D11'),
    subtitle: signal(overrides?.subtitle ?? 'Season 2025-2026'),
    textClass: signal<string | undefined>(overrides?.textClass),
    backgroundColor: signal<string | undefined>(overrides?.backgroundColor),
  };
}

function mockRouterService(hasStack = true) {
  return {
    hasStack: signal(hasStack),
    navigateToPrevious: vi.fn(),
    navigateToPlayer: vi.fn(),
    navigateToLogin: vi.fn(),
    navigateToCreatePlayer: vi.fn(),
    navigateToCreateTransferWindow: vi.fn(),
  };
}

function childProviders() {
  return [
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
    { provide: PlayerApiService, useValue: { search: vi.fn() } },
    {
      provide: CurrentService,
      useValue: { season: signal(undefined), transferWindow: signal(undefined) },
    },
  ];
}

describe('HeaderComponent', () => {
  it('renders title from PageContextService', async () => {
    await render(`<app-header></app-header>`, {
      imports: [HeaderComponent],
      providers: [
        {
          provide: PageContextService,
          useValue: mockPageContextService({ title: 'Match Week 1' }),
        },
        { provide: RouterService, useValue: mockRouterService() },
        ...childProviders(),
      ],
    });

    expect(screen.getByText('Match Week 1')).toBeInTheDocument();
  });

  it('renders subtitle from PageContextService', async () => {
    await render(`<app-header></app-header>`, {
      imports: [HeaderComponent],
      providers: [
        {
          provide: PageContextService,
          useValue: mockPageContextService({ subtitle: 'Season 2025-2026' }),
        },
        { provide: RouterService, useValue: mockRouterService() },
        ...childProviders(),
      ],
    });

    expect(screen.getByText('Season 2025-2026')).toBeInTheDocument();
  });

  it('applies textClass to header div', async () => {
    await render(`<app-header></app-header>`, {
      imports: [HeaderComponent],
      providers: [
        {
          provide: PageContextService,
          useValue: mockPageContextService({
            textClass: 'text-black',
            title: 'Title',
            backgroundColor: '#000000',
          }),
        },
        { provide: RouterService, useValue: mockRouterService() },
        ...childProviders(),
      ],
    });

    expect(screen.getByText('Title').closest('.app-hero-background')).toHaveClass('text-black');
  });

  it('applies background color to header div', async () => {
    const { container } = await render(`<app-header></app-header>`, {
      imports: [HeaderComponent],
      providers: [
        {
          provide: PageContextService,
          useValue: mockPageContextService({ backgroundColor: '#ff0000' }),
        },
        { provide: RouterService, useValue: mockRouterService() },
        ...childProviders(),
      ],
    });

    const headerDiv = container.querySelector('.app-hero-background') as HTMLElement;
    expect(headerDiv.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('when no background color in context service should have non transparent BACKGROUND color', async () => {
    const { container } = await render(`<app-header></app-header>`, {
      imports: [HeaderComponent],
      providers: [
        { provide: PageContextService, useValue: mockPageContextService() },
        { provide: RouterService, useValue: mockRouterService() },
        ...childProviders(),
      ],
    });

    const headerDiv = container.querySelector('div') as HTMLElement;
    expect(headerDiv.style.backgroundColor).toBe('rgb(242, 241, 238)');
  });

  it('does not apply app-hero-background class when backgroundColor is undefined', async () => {
    const { container } = await render(`<app-header></app-header>`, {
      imports: [HeaderComponent],
      providers: [
        { provide: PageContextService, useValue: mockPageContextService() },
        { provide: RouterService, useValue: mockRouterService() },
        ...childProviders(),
      ],
    });

    expect(container.querySelector('.app-hero-background')).toBeNull();
  });

  it('applies no text class when textClass is undefined', async () => {
    await render(`<app-header></app-header>`, {
      imports: [HeaderComponent],
      providers: [
        { provide: PageContextService, useValue: mockPageContextService({ title: 'Title' }) },
        { provide: RouterService, useValue: mockRouterService() },
        ...childProviders(),
      ],
    });

    const headerDiv = screen.getByText('Title').closest('div') as HTMLElement;
    expect(headerDiv).not.toHaveClass('text-white!');
    expect(headerDiv).not.toHaveClass('text-black!');
  });

  it('shows back button when router has stack', async () => {
    const { container } = await render(`<app-header></app-header>`, {
      imports: [HeaderComponent],
      providers: [
        { provide: PageContextService, useValue: mockPageContextService() },
        { provide: RouterService, useValue: mockRouterService(true) },
        ...childProviders(),
      ],
    });

    expect(container.querySelector('app-svg-icon[name="chevron-left"]')).toBeInTheDocument();
    expect(container.querySelector('app-d11-lion-light-img')).toBeNull();
  });

  it('shows D11 lion icon when router has no stack', async () => {
    const { container } = await render(`<app-header></app-header>`, {
      imports: [HeaderComponent],
      providers: [
        { provide: PageContextService, useValue: mockPageContextService() },
        { provide: RouterService, useValue: mockRouterService(false) },
        ...childProviders(),
      ],
    });

    expect(container.querySelector('app-d11-lion-light-img')).toBeInTheDocument();
    expect(container.querySelector('app-svg-icon[name="chevron-left"]')).toBeNull();
  });

  it('calls routerService.navigateToPrevious when back button is clicked', async () => {
    const routerService = mockRouterService(true);

    const { container } = await render(`<app-header></app-header>`, {
      imports: [HeaderComponent],
      providers: [
        { provide: PageContextService, useValue: mockPageContextService() },
        { provide: RouterService, useValue: routerService },
        ...childProviders(),
      ],
    });

    const backButton = container
      .querySelector('app-svg-icon[name="chevron-left"]')
      ?.closest('button') as HTMLElement;
    await userEvent.click(backButton);
    expect(routerService.navigateToPrevious).toHaveBeenCalledOnce();
  });
});
