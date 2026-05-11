import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { fakeSeason } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { expect, vi } from 'vitest';
import { TeamPlayerSeasonStatsCardComponent } from './team-player-season-stats-card.component';

const providers = [{ provide: DynamicDialogService, useValue: { openPlayerSeasonStat: vi.fn() } }];

describe('TeamPlayerSeasonStatsCardComponent', () => {
  it('renders "Players <season>" header when season is provided', async () => {
    const season = fakeSeason();

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [], season },
      providers,
    });

    expect(screen.getByText(`Players ${season.name}`)).toBeInTheDocument();
  });

  it('renders "Players" header when no season', async () => {
    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [], season: undefined },
      providers,
    });

    expect(screen.getByText('Players')).toBeInTheDocument();
  });
});
