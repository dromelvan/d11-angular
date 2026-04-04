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
import { RatingPipe } from '@app/shared/pipes/rating.pipe';

let playerSeasonStatPage: PlayerSeasonStatPage;
let playerSeasonStatApi: PlayerSeasonStatApiService;
let loadingService: LoadingService;
const seasonId = 1;
const positionIds = [1, 3, 4, 5, 2];

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
          player: { ...fakePlayerBase(), name: 'Player1' },
          team: { ...fakeTeamBase(), shortName: 'Team1' },
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
          player: { ...fakePlayerBase(), name: 'Player2' },
          team: { ...fakeTeamBase(), shortName: 'Team2' },
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
  it('fetches next page', async () => {
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

  it('fetches previous page', async () => {
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
        [3, 4, 5, 2],
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
        [1, 3, 5, 2],
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
        [1, 3, 4, 2],
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

describe('PlayerSeasonStatsCardComponent sort', () => {
  const playerSeasonStats = [
    {
      ...fakePlayerSeasonStat(),
      ranking: 11,
      points: 13,
      goals: 15,
      rating: 170,
      formMatchPoints: [17, -18, 19],
    },
    {
      ...fakePlayerSeasonStat(),
      ranking: 12,
      points: 14,
      goals: 16,
      rating: 180,
      formMatchPoints: [20, -21, 22],
    },
  ];

  beforeEach(async () => {
    playerSeasonStatApi = {
      getPlayerSeasonStatsBySeasonId: vi
        .fn()
        .mockReturnValue(
          of({ page: 0, totalPages: 1, totalElements: 1, elements: playerSeasonStats }),
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

  it('default renders points column', async () => {
    expect(screen.getByText('Pts')).toBeInTheDocument();
    expect(screen.getByText(playerSeasonStats[0].ranking)).toBeInTheDocument();
    expect(screen.getByText(playerSeasonStats[0].points)).toBeInTheDocument();
    expect(screen.getByText(playerSeasonStats[1].ranking)).toBeInTheDocument();
    expect(screen.getByText(playerSeasonStats[1].points)).toBeInTheDocument();
  });

  it('no sort renders points column', async () => {
    await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
    await userEvent.click(screen.getByRole('button', { name: 'Goals' }));

    await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
    await userEvent.click(screen.getByRole('button', { name: 'Goals' }));

    expect(screen.getByText('Pts')).toBeInTheDocument();
    expect(screen.getByText(playerSeasonStats[0].points)).toBeInTheDocument();
    expect(screen.getByText(playerSeasonStats[0].ranking)).toBeInTheDocument();
    expect(screen.getByText(playerSeasonStats[1].points)).toBeInTheDocument();
    expect(screen.getByText(playerSeasonStats[1].ranking)).toBeInTheDocument();
  });

  it('GOALS renders goals column', async () => {
    await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
    await userEvent.click(screen.getByRole('button', { name: 'Goals' }));

    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.getByText(playerSeasonStats[0].goals)).toBeInTheDocument();
    expect(screen.getByText(playerSeasonStats[1].goals)).toBeInTheDocument();
  });

  it('RATING renders ratings column', async () => {
    const pipe = new RatingPipe();

    await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
    await userEvent.click(screen.getByRole('button', { name: 'Rating' }));

    expect(screen.getByText('Rtg')).toBeInTheDocument();
    expect(
      screen.getByText(pipe.transform(playerSeasonStats[0].rating as number) as string),
    ).toBeInTheDocument();
    expect(
      screen.getByText(pipe.transform(playerSeasonStats[1].rating as number) as string),
    ).toBeInTheDocument();
  });

  it('FORM renders form column', async () => {
    await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
    await userEvent.click(screen.getByRole('button', { name: 'Form' }));

    expect(screen.getByText('Form')).toBeInTheDocument();
    for (const pts of [
      ...playerSeasonStats[0].formMatchPoints,
      ...playerSeasonStats[1].formMatchPoints,
    ]) {
      expect(screen.getByText(String(pts))).toBeInTheDocument();
    }
  });
});

describe('PlayerSeasonStatsCardComponent drawer', () => {
  it('closes when availability filter is changed', async () => {
    const api = {
      getPlayerSeasonStatsBySeasonId: vi
        .fn()
        .mockReturnValue(
          of({ page: 0, totalPages: 1, totalElements: 1, elements: [fakePlayerSeasonStat()] }),
        ),
    } as unknown as PlayerSeasonStatApiService;

    await render(HostComponent, {
      providers: [
        { provide: LoadingService, useValue: { register: vi.fn() } },
        { provide: PlayerSeasonStatApiService, useValue: api },
      ],
    });

    await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
    expect(screen.getByText('Filter and Sort')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Available' }));

    await waitFor(() => {
      expect(screen.queryByText('Filter and Sort')).not.toBeInTheDocument();
    });
  });

  it('closes when sort filter is changed', async () => {
    const api = {
      getPlayerSeasonStatsBySeasonId: vi
        .fn()
        .mockReturnValue(
          of({ page: 0, totalElements: 1, totalPages: 1, elements: [fakePlayerSeasonStat()] }),
        ),
    } as unknown as PlayerSeasonStatApiService;

    await render(HostComponent, {
      providers: [
        { provide: PlayerSeasonStatApiService, useValue: api },
        { provide: LoadingService, useValue: { register: vi.fn() } },
      ],
    });

    await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
    expect(screen.getByText('Filter and Sort')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Goals' }));

    await waitFor(() => {
      expect(screen.queryByText('Filter and Sort')).not.toBeInTheDocument();
    });
  });
});

describe('PlayerSeasonStatsCardComponent page reset', () => {
  it('resets to page 0 when filter changes', async () => {
    const api = {
      getPlayerSeasonStatsBySeasonId: vi
        .fn()
        .mockReturnValue(
          of({ page: 0, totalPages: 3, totalElements: 75, elements: [fakePlayerSeasonStat()] }),
        ),
    } as unknown as PlayerSeasonStatApiService;

    await render(HostComponent, {
      providers: [
        { provide: PlayerSeasonStatApiService, useValue: api },
        { provide: LoadingService, useValue: { register: vi.fn() } },
      ],
    });

    const [nextButton] = screen.getAllByRole('button', { name: 'Next Page' });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(api.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        seasonId,
        1,
        positionIds,
        undefined,
        PlayerSeasonStatSort.RANKING,
      );
    });

    await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
    await userEvent.click(screen.getByRole('button', { name: 'Goals' }));

    await waitFor(() => {
      expect(api.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        seasonId,
        0,
        positionIds,
        undefined,
        PlayerSeasonStatSort.GOALS,
      );
    });
  });
});
