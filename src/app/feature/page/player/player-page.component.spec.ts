import { Component } from '@angular/core';
import type { Player, PlayerSeasonStat, Season } from '@app/core/api';
import { PlayerApiService, SeasonApiService } from '@app/core/api';
import { fakePlayer, fakePlayerSeasonStat, fakeSeason } from '@app/test';
import { LoadingService } from '@app/core/loading/loading.service';
import { render, screen, waitFor } from '@testing-library/angular';
import { of } from 'rxjs';
import { expect } from 'vitest';
import { PlayerPageComponent } from './player-page.component';

let player: Player;
let season: Season;
let seasons: Season[];
let playerSeasonStats: PlayerSeasonStat[];

let playerApi: PlayerApiService;
let seasonApi: SeasonApiService;
let loadingService: LoadingService;

@Component({
  template: ` <app-player-page [playerId]="playerId" [seasonId]="seasonId" /> `,
  standalone: true,
  imports: [PlayerPageComponent],
})
class HostComponent {
  playerId = 1;
  seasonId: number | undefined = undefined;
}

describe('PlayerPageComponent', () => {
  beforeEach(async () => {
    player = fakePlayer();
    season = fakeSeason();
    seasons = [season];

    const playerSeasonStat = fakePlayerSeasonStat();
    playerSeasonStat.season = season;
    playerSeasonStat.player = player;
    playerSeasonStats = [playerSeasonStat];

    playerApi = {
      getById: vi.fn().mockReturnValue(of(player)),
      getPlayerSeasonStatsByPlayerId: vi.fn().mockReturnValue(of(playerSeasonStats)),
    } as unknown as PlayerApiService;

    seasonApi = {
      getAll: vi.fn().mockReturnValue(of(seasons)),
    } as unknown as SeasonApiService;

    loadingService = {
      isLoading: vi.fn().mockReturnValue(false),
      register: vi.fn(),
    } as unknown as LoadingService;

    await render(HostComponent, {
      providers: [
        { provide: PlayerApiService, useValue: playerApi },
        { provide: SeasonApiService, useValue: seasonApi },
        { provide: LoadingService, useValue: loadingService },
      ],
    });
  });

  it('renders page', async () => {
    await waitFor(() => {
      const page = document.querySelector('.app-player-page');
      expect(page).toBeInTheDocument();
    });
  });

  it('renders player', async () => {
    await waitFor(() => {
      expect(screen.getByText(player.firstName)).toBeInTheDocument();
      expect(screen.getByText(player.lastName)).toBeInTheDocument();
    });
  });

  it('renders info', async () => {
    await waitFor(() => {
      expect(screen.getByText(player.country.iso)).toBeInTheDocument();
    });
  });

  it('renders season', async () => {
    await waitFor(() => {
      expect(screen.getByText(`Season ${season.name}`)).toBeInTheDocument();
    });
  });

  it('renders tabs', async () => {
    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Matches')).toBeInTheDocument();
      expect(screen.getByText('Stats')).toBeInTheDocument();
      expect(screen.getByText('Career')).toBeInTheDocument();
    });
  });
});

describe('PlayerPageComponent with undefined playerSeasonStat', () => {
  beforeEach(async () => {
    player = fakePlayer();
    season = fakeSeason();
    seasons = [season];
    playerSeasonStats = [];

    playerApi = {
      getById: vi.fn().mockReturnValue(of(player)),
      getPlayerSeasonStatsByPlayerId: vi.fn().mockReturnValue(of([])),
    } as unknown as PlayerApiService;

    loadingService = {
      isLoading: vi.fn().mockReturnValue(false),
      register: vi.fn(),
    } as unknown as LoadingService;

    seasonApi = {
      getAll: vi.fn().mockReturnValue(of(seasons)),
    } as unknown as SeasonApiService;

    await render(HostComponent, {
      providers: [
        { provide: PlayerApiService, useValue: playerApi },
        { provide: SeasonApiService, useValue: seasonApi },
        { provide: LoadingService, useValue: loadingService },
      ],
    });
  });

  it('renders player', async () => {
    await waitFor(() => {
      expect(screen.getByText(player.firstName)).toBeInTheDocument();
      expect(screen.getByText(player.lastName)).toBeInTheDocument();
    });
  });

  it('does not render season', async () => {
    await waitFor(() => {
      expect(screen.queryByText(`Season ${season.name}`)).not.toBeInTheDocument();
    });
  });

  it('renders info', async () => {
    await waitFor(() => {
      expect(screen.getByText(player.country.iso)).toBeInTheDocument();
    });
  });

  it('renders overview and career tabs', async () => {
    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Career')).toBeInTheDocument();
    });
  });

  it('does not render matches and stats tabs', async () => {
    await waitFor(() => {
      expect(screen.queryByText('Matches')).not.toBeInTheDocument();
      expect(screen.queryByText('Stats')).not.toBeInTheDocument();
    });
  });
});

describe('PlayerPageComponent when loading', () => {
  beforeEach(async () => {
    player = fakePlayer();
    season = fakeSeason();
    seasons = [season];

    playerApi = {
      getById: vi.fn().mockReturnValue(of(player)),
      getPlayerSeasonStatsByPlayerId: vi.fn().mockReturnValue(of([])),
    } as unknown as PlayerApiService;

    seasonApi = {
      getAll: vi.fn().mockReturnValue(of(seasons)),
    } as unknown as SeasonApiService;

    loadingService = {
      isLoading: vi.fn().mockReturnValue(true),
      register: vi.fn(),
    } as unknown as LoadingService;

    await render(HostComponent, {
      providers: [
        { provide: PlayerApiService, useValue: playerApi },
        { provide: SeasonApiService, useValue: seasonApi },
        { provide: LoadingService, useValue: loadingService },
      ],
    });
  });

  it('does not render page', async () => {
    const page = document.querySelector('.app-player-page');
    expect(page).not.toBeInTheDocument();
  });
});
