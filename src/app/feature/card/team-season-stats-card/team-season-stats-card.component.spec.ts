import { RouterService } from '@app/core/router/router.service';
import { render, screen } from '@testing-library/angular';
import { expect, vi } from 'vitest';
import { TeamSeasonStatsCardComponent } from './team-season-stats-card.component';

const providers = [{ provide: RouterService, useValue: { navigateToTeam: vi.fn() } }];

describe('TeamSeasonStatsCardComponent', () => {
  it('renders "Premier League" header', async () => {
    await render(TeamSeasonStatsCardComponent, {
      inputs: { teamSeasonStats: [] },
      providers,
    });

    expect(screen.getByText('Premier League')).toBeInTheDocument();
  });
});
