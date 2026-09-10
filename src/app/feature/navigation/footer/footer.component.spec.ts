import { signal } from '@angular/core';
import { render } from '@testing-library/angular';
import { APP_VERSION } from '@app/version';
import { CurrentService } from '@app/core/current/current.service';
import { RouterService } from '@app/core/router/router.service';
import { FooterComponent } from './footer.component';

const mockRouterService = {
  navigateToMatchWeekMatches: vi.fn(),
  navigateToMatches: vi.fn(),
  navigateToPlayers: vi.fn(),
  navigateToSeason: vi.fn(),
  navigateToTransferWindow: vi.fn(),
  navigateToMore: vi.fn(),
};

const mockCurrentService = {
  matchWeek: signal(undefined),
  season: signal(undefined),
  transferWindow: signal(undefined),
};

async function setup() {
  return render(FooterComponent, {
    providers: [
      { provide: RouterService, useValue: mockRouterService },
      { provide: CurrentService, useValue: mockCurrentService },
    ],
  });
}

describe('FooterComponent', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders footer element', async () => {
    const { container } = await setup();

    expect(container.querySelector('footer.app-footer')).toBeInTheDocument();
  });

  it('footer is fixed to bottom below lg breakpoint', async () => {
    const { container } = await setup();

    const footer = container.querySelector('footer.app-footer') as HTMLElement;
    expect(footer).toHaveClass('max-lg:fixed');
    expect(footer).toHaveClass('max-lg:bottom-0');
    expect(footer).toHaveClass('max-lg:left-0');
    expect(footer).toHaveClass('max-lg:right-0');
  });

  it('renders version in info footer', async () => {
    const { container } = await setup();

    const version = container.querySelector('span#version') as HTMLElement;
    expect(version).toHaveTextContent(`D11 ${APP_VERSION}`);
  });

  it('info footer is hidden below lg', async () => {
    const { container } = await setup();

    const infoFooter = container.querySelector('div.app-info-footer') as HTMLElement;
    expect(infoFooter).toHaveClass('hidden');
    expect(infoFooter).toHaveClass('lg:flex');
  });

  it('renders navbar icon', async () => {
    const { container } = await setup();

    expect(container.querySelector('app-navbar-icon')).toBeInTheDocument();
  });
});
