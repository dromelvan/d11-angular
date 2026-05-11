import { PlayerApiService, type PlayerSeasonStat } from '@app/core/api';
import { fakePlayerSeasonStat } from '@app/test';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { render, screen, waitFor } from '@testing-library/angular';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { PlayerMatchStatsCardComponent } from './player-match-stats-card.component';

describe('PlayerMatchStatsCardComponent', () => {
  let playerSeasonStat: PlayerSeasonStat;

  beforeEach(async () => {
    playerSeasonStat = fakePlayerSeasonStat();

    await render(PlayerMatchStatsCardComponent, {
      inputs: { playerSeasonStat },
      providers: [
        {
          provide: PlayerApiService,
          useValue: {
            getPlayerMatchStatsByPlayerIdAndSeasonId: vi.fn().mockReturnValue(of([])),
          },
        },
        { provide: LoadingService, useValue: { register: vi.fn() } },
        { provide: RouterService, useValue: { navigateToMatch: vi.fn() } },
        { provide: DynamicDialogService, useValue: { openPlayerMatchStat: vi.fn() } },
      ],
    });
  });

  it('renders', async () => {
    await waitFor(() => {
      expect(document.querySelector('.app-player-match-stats-card')).toBeInTheDocument();
    });
  });

  it('renders header with season name', async () => {
    await waitFor(() => {
      expect(screen.getByText(`Matches ${playerSeasonStat.season.name}`)).toBeInTheDocument();
    });
  });
});
