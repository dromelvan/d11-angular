import { Component } from '@angular/core';
import { PlayerSeasonStatApiService, PlayerSeasonStatPage } from '@app/core/api';
import { PlayerSeasonStatSort } from '@app/core/api/model/player-season-stat-sort.model';
import { LoadingService } from '@app/core/loading/loading.service';
import { render, screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { expect, vi } from 'vitest';
import {
  fakeD11TeamBase,
  fakePlayerBase,
  fakePlayerSeasonStat,
  fakePosition,
  fakeSeason,
  fakeTeamBase,
} from '@app/test';
import { of } from 'rxjs';
import { PlayerSeasonStatsCardComponent } from './player-season-stats-card.component';

let playerSeasonStatPage: PlayerSeasonStatPage;
let playerSeasonStatApi: PlayerSeasonStatApiService;
let loadingService: LoadingService;
const seasonId = 1;
const positionIds = [1, 2, 3, 4, 5];

@Component({
  template: ` <app-player-season-stats-card [seasonId]="seasonId" />`,
  standalone: true,
  imports: [PlayerSeasonStatsCardComponent],
})
class HostComponent {
  seasonId = seasonId;
}

describe('PlayerSeasonStatsCardComponent', () => {
  beforeEach(async () => {
    playerSeasonStatPage = {
      page: 0,
      totalPages: 2,
      totalElements: 50,
      elements: [
        {
          ...fakePlayerSeasonStat(),
          ranking: 1,
          points: 10,
          rating: 750,
          goals: 3,
          player: { ...fakePlayerBase(), name: 'Alice Smith' },
          team: { ...fakeTeamBase(), shortName: 'ARS' },
          d11Team: fakeD11TeamBase(),
          position: fakePosition(),
          season: fakeSeason(),
        },
        {
          ...fakePlayerSeasonStat(),
          ranking: 2,
          points: 6,
          rating: 700,
          goals: 1,
          player: { ...fakePlayerBase(), name: 'Bob Jones' },
          team: { ...fakeTeamBase(), shortName: 'CHE' },
          d11Team: fakeD11TeamBase(),
          position: fakePosition(),
          season: fakeSeason(),
        },
      ],
    };

    playerSeasonStatApi = {
      getPlayerSeasonStatsBySeasonId: vi.fn().mockReturnValue(of(playerSeasonStatPage)),
    } as unknown as PlayerSeasonStatApiService;

    loadingService = { register: vi.fn() } as unknown as LoadingService;

    await render(HostComponent, {
      providers: [
        { provide: PlayerSeasonStatApiService, useValue: playerSeasonStatApi },
        { provide: LoadingService, useValue: loadingService },
      ],
    });
  });

  it('renders', () => {
    expect(document.querySelector('app-player-season-stats-card')).toBeInTheDocument();
  });

  it('fetches player season stats', () => {
    expect(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
      seasonId,
      0,
      positionIds,
      undefined,
      PlayerSeasonStatSort.RANKING,
    );
  });

  it('renders player names', async () => {
    await waitFor(() => {
      for (const stat of playerSeasonStatPage.elements) {
        expect(screen.getByText(stat.player.name)).toBeInTheDocument();
      }
    });
  });

  it('renders ranking numbers in order', async () => {
    await waitFor(() => {
      const rankingCells = screen.getAllByTestId('ranking');
      const renderedRankings = rankingCells.map((el) => Number(el.textContent?.trim()));
      expect(renderedRankings).toEqual(playerSeasonStatPage.elements.map((s) => s.ranking));
    });
  });

  it('renders points', async () => {
    await waitFor(() => {
      for (const stat of playerSeasonStatPage.elements) {
        expect(screen.getByText(String(stat.points))).toBeInTheDocument();
      }
    });
  });
});

describe('PlayerSeasonStatsCardComponent pagination', () => {
  it('fetches next page when next paginator button is clicked', async () => {
    playerSeasonStatApi = {
      getPlayerSeasonStatsBySeasonId: vi
        .fn()
        .mockReturnValue(
          of({ page: 0, totalPages: 2, totalElements: 50, elements: [fakePlayerSeasonStat()] }),
        ),
    } as unknown as PlayerSeasonStatApiService;
    await render(HostComponent, {
      providers: [
        { provide: PlayerSeasonStatApiService, useValue: playerSeasonStatApi },
        { provide: LoadingService, useValue: { register: vi.fn() } },
      ],
    });

    const [nextButton] = screen.getAllByRole('button', { name: 'Next Page' });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        seasonId,
        1,
        positionIds,
        undefined,
        PlayerSeasonStatSort.RANKING,
      );
    });
  });

  it('fetches previous page when previous paginator button is clicked', async () => {
    playerSeasonStatApi = {
      getPlayerSeasonStatsBySeasonId: vi
        .fn()
        .mockReturnValue(
          of({ page: 1, totalPages: 2, totalElements: 50, elements: [fakePlayerSeasonStat()] }),
        ),
    } as unknown as PlayerSeasonStatApiService;
    await render(HostComponent, {
      providers: [
        { provide: PlayerSeasonStatApiService, useValue: playerSeasonStatApi },
        { provide: LoadingService, useValue: { register: vi.fn() } },
      ],
    });

    const [prevButton] = screen.getAllByRole('button', { name: 'Previous Page' });
    await userEvent.click(prevButton);

    await waitFor(() => {
      expect(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        seasonId,
        0,
        positionIds,
        undefined,
        PlayerSeasonStatSort.RANKING,
      );
    });
  });
});

describe('PlayerSeasonStatsCardComponent filters', () => {
  beforeEach(async () => {
    playerSeasonStatApi = {
      getPlayerSeasonStatsBySeasonId: vi
        .fn()
        .mockReturnValue(
          of({ page: 0, totalPages: 1, totalElements: 1, elements: [fakePlayerSeasonStat()] }),
        ),
    } as unknown as PlayerSeasonStatApiService;
    await render(HostComponent, {
      providers: [
        { provide: PlayerSeasonStatApiService, useValue: playerSeasonStatApi },
        { provide: LoadingService, useValue: { register: vi.fn() } },
      ],
    });

    await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
  });

  it('calls api with dummy=true', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Available' }));
    await waitFor(() => {
      expect(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        seasonId,
        0,
        positionIds,
        true,
        PlayerSeasonStatSort.RANKING,
      );
    });
  });

  it('calls api with dummy=false', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Unavailable' }));
    await waitFor(() => {
      expect(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        seasonId,
        0,
        positionIds,
        false,
        PlayerSeasonStatSort.RANKING,
      );
    });
  });

  it('calls api without Keeper positionId', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Keeper' }));
    await waitFor(() => {
      expect(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        seasonId,
        0,
        [2, 3, 4, 5],
        undefined,
        PlayerSeasonStatSort.RANKING,
      );
    });
  });

  it('calls api without Defender positionIds', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Defender' }));
    await waitFor(() => {
      expect(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        seasonId,
        0,
        [1, 4, 5],
        undefined,
        PlayerSeasonStatSort.RANKING,
      );
    });
  });

  it('calls api without Midfielder positionId', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Midfielder' }));
    await waitFor(() => {
      expect(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        seasonId,
        0,
        [1, 2, 3, 5],
        undefined,
        PlayerSeasonStatSort.RANKING,
      );
    });
  });

  it('calls api without Forward positionId', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Forward' }));
    await waitFor(() => {
      expect(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        seasonId,
        0,
        [1, 2, 3, 4],
        undefined,
        PlayerSeasonStatSort.RANKING,
      );
    });
  });

  it('calls api with GOALS sort', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Goals' }));
    await waitFor(() => {
      expect(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        seasonId,
        0,
        positionIds,
        undefined,
        PlayerSeasonStatSort.GOALS,
      );
    });
  });

  it('calls api with RATING', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Rating' }));
    await waitFor(() => {
      expect(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        seasonId,
        0,
        positionIds,
        undefined,
        PlayerSeasonStatSort.RATING,
      );
    });
  });

  it('calls api with FORM', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Form' }));
    await waitFor(() => {
      expect(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        seasonId,
        0,
        positionIds,
        undefined,
        PlayerSeasonStatSort.FORM,
      );
    });
  });
});
