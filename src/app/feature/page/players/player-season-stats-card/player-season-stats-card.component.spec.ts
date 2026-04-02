import { Component } from '@angular/core';
import { PlayerSeasonStatApiService, PlayerSeasonStatPage } from '@app/core/api';
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
      );
    });
  });
});
