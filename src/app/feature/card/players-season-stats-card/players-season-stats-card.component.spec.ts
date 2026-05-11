import { PlayerSeasonStatApiService } from '@app/core/api/player-season-stat/player-season-stat-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { fakeSeason } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { PlayersSeasonStatsCardComponent } from './players-season-stats-card.component';

describe('PlayersSeasonStatsCardComponent', () => {
  beforeEach(async () => {
    await render(PlayersSeasonStatsCardComponent, {
      inputs: { seasonId: fakeSeason().id },
      providers: [
        {
          provide: PlayerSeasonStatApiService,
          useValue: {
            getPlayerSeasonStatsBySeasonId: vi
              .fn()
              .mockReturnValue(of({ page: 0, totalPages: 0, totalElements: 0, elements: [] })),
          },
        },
        { provide: LoadingService, useValue: { register: vi.fn() } },
        { provide: DynamicDialogService, useValue: { openPlayerSeasonStat: vi.fn() } },
      ],
    });
  });

  it('renders Statistics header', () => {
    expect(screen.getByText('Statistics')).toBeInTheDocument();
  });
});
