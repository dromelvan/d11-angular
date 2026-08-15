import { render, screen } from '@testing-library/angular';
import { fakeD11Match, fakePlayerMatchStat } from '@app/test/faker-util';
import { RouterService } from '@app/core/router/router.service';
import { vi } from 'vitest';
import { D11TeamPlayerMatchStatsSectionComponent } from './d11-team-player-match-stats-section.component';

const mockRouterService = { navigateToPlayer: vi.fn() };

describe('D11TeamPlayerMatchStatsSectionComponent', () => {
  it('renders the D11 team name in the section header', async () => {
    const { homeD11Team } = fakeD11Match();

    await render(D11TeamPlayerMatchStatsSectionComponent, {
      inputs: { d11Team: homeD11Team, playerMatchStats: [] },
      providers: [{ provide: RouterService, useValue: mockRouterService }],
    });

    expect(screen.getByTestId('section-header')).toHaveTextContent(homeD11Team.name);
  });

  it('renders player name from stats', async () => {
    const { homeD11Team } = fakeD11Match();
    const stat = { ...fakePlayerMatchStat(), d11Team: homeD11Team };

    await render(D11TeamPlayerMatchStatsSectionComponent, {
      inputs: { d11Team: homeD11Team, playerMatchStats: [stat] },
      providers: [{ provide: RouterService, useValue: mockRouterService }],
    });

    expect(screen.getByText(stat.player.name)).toBeInTheDocument();
  });
});
