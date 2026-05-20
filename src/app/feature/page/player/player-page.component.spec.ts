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

function buildProviders() {
  return [
    { provide: PlayerApiService, useValue: playerApi },
    { provide: SeasonApiService, useValue: seasonApi },
    { provide: LoadingService, useValue: loadingService },
  ];
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
      getPlayerTransferContextByPlayerId: vi.fn().mockReturnValue(of(null)),
    } as unknown as PlayerApiService;

    seasonApi = {
      getAll: vi.fn().mockReturnValue(of(seasons)),
    } as unknown as SeasonApiService;

    loadingService = { register: vi.fn() } as unknown as LoadingService;

    await render(PlayerPageComponent, {
      inputs: { playerId: 1 },
      providers: buildProviders(),
    });
  });

  it('renders page', async () => {
    await waitFor(() => {
      expect(document.querySelector('.app-player-page')).toBeInTheDocument();
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

    playerApi = {
      getById: vi.fn().mockReturnValue(of(player)),
      getPlayerSeasonStatsByPlayerId: vi.fn().mockReturnValue(of([])),
      getPlayerTransferContextByPlayerId: vi.fn().mockReturnValue(of(null)),
    } as unknown as PlayerApiService;

    seasonApi = {
      getAll: vi.fn().mockReturnValue(of(seasons)),
    } as unknown as SeasonApiService;

    loadingService = { register: vi.fn() } as unknown as LoadingService;

    await render(PlayerPageComponent, {
      inputs: { playerId: 1 },
      providers: buildProviders(),
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

describe('PlayerPageComponent with seasonId', () => {
  let season2: Season;

  beforeEach(async () => {
    player = fakePlayer();
    season = fakeSeason();
    season2 = fakeSeason();

    const playerSeasonStat1 = fakePlayerSeasonStat();
    playerSeasonStat1.season = season;
    playerSeasonStat1.player = player;

    const playerSeasonStat2 = fakePlayerSeasonStat();
    playerSeasonStat2.season = season2;
    playerSeasonStat2.player = player;

    playerApi = {
      getById: vi.fn().mockReturnValue(of(player)),
      getPlayerSeasonStatsByPlayerId: vi
        .fn()
        .mockReturnValue(of([playerSeasonStat1, playerSeasonStat2])),
      getPlayerTransferContextByPlayerId: vi.fn().mockReturnValue(of(null)),
    } as unknown as PlayerApiService;

    seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season, season2])),
    } as unknown as SeasonApiService;

    loadingService = { register: vi.fn() } as unknown as LoadingService;

    await render(PlayerPageComponent, {
      inputs: { playerId: 1, seasonId: season2.id },
      providers: buildProviders(),
    });
  });

  it('renders the season matching seasonId', async () => {
    await waitFor(() => {
      expect(screen.getByText(`Season ${season2.name}`)).toBeInTheDocument();
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
      getPlayerTransferContextByPlayerId: vi.fn().mockReturnValue(of(null)),
    } as unknown as PlayerApiService;

    seasonApi = {
      getAll: vi.fn().mockReturnValue(of(seasons)),
    } as unknown as SeasonApiService;

    loadingService = { register: vi.fn() } as unknown as LoadingService;

    await render(PlayerPageComponent, {
      inputs: { playerId: 1 },
      providers: buildProviders(),
    });
  });

  it('does not render page', () => {
    expect(document.querySelector('.app-player-page')).not.toBeInTheDocument();
  });
});
