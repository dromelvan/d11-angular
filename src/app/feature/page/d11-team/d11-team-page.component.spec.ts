import type { D11TeamSeasonStat } from '@app/core/api';
import { SeasonApiService } from '@app/core/api';
import { D11TeamApiService } from '@app/core/api/d11-team/d11-team-api.service';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { PositionApiService } from '@app/core/api/position/position-api.service';
import { POSITION_IDS } from '@app/core/api';
import {
  fakeD11MatchBase,
  fakeD11TeamBase,
  fakeD11TeamSeasonStat,
  fakePlayerSeasonStat,
  fakeSeason,
} from '@app/test';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DeferBlockBehavior } from '@angular/core/testing';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { of } from 'rxjs';
import { expect } from 'vitest';
import { D11TeamPageComponent } from './d11-team-page.component';

const mockRouterService = { navigateToD11Team: vi.fn() };
const mockDynamicDialogService = { openPlayerSeasonStat: vi.fn() };

function buildProviders(overrides: {
  d11TeamApi: D11TeamApiService;
  d11TeamSeasonStatApi: D11TeamSeasonStatApiService;
  seasonApi: SeasonApiService;
  positionApi: PositionApiService;
  loadingService: LoadingService;
}) {
  return [
    { provide: D11TeamApiService, useValue: overrides.d11TeamApi },
    { provide: D11TeamSeasonStatApiService, useValue: overrides.d11TeamSeasonStatApi },
    { provide: SeasonApiService, useValue: overrides.seasonApi },
    { provide: PositionApiService, useValue: overrides.positionApi },
    { provide: LoadingService, useValue: overrides.loadingService },
    { provide: RouterService, useValue: mockRouterService },
    { provide: DynamicDialogService, useValue: mockDynamicDialogService },
  ];
}

function fakePositionApi(): PositionApiService {
  return { getPositions: vi.fn().mockReturnValue(of([])) } as unknown as PositionApiService;
}

describe('D11TeamPageComponent', () => {
  let d11TeamApi: D11TeamApiService;
  let d11TeamSeasonStatApi: D11TeamSeasonStatApiService;
  let seasonApi: SeasonApiService;
  let loadingService: LoadingService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const d11Team = fakeD11TeamBase();
    const season = fakeSeason();

    d11TeamApi = {
      getById: vi.fn().mockReturnValue(of(d11Team)),
      getD11MatchesByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([fakeD11MatchBase()])),
      getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi
        .fn()
        .mockReturnValue(of([fakePlayerSeasonStat()])),
    } as unknown as D11TeamApiService;

    d11TeamSeasonStatApi = {
      getD11TeamSeasonStatsByD11TeamId: vi.fn().mockReturnValue(of([fakeD11TeamSeasonStat()])),
    } as unknown as D11TeamSeasonStatApiService;

    seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

    loadingService = {
      isLoading: vi.fn().mockReturnValue(false),
      register: vi.fn(),
    } as unknown as LoadingService;

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({
        d11TeamApi,
        d11TeamSeasonStatApi,
        seasonApi,
        positionApi: fakePositionApi(),
        loadingService,
      }),
    });
  });

  it('renders page', async () => {
    await waitFor(() => {
      expect(document.querySelector('.app-d11-team-page')).toBeInTheDocument();
    });
  });

  it('renders tabs', async () => {
    await waitFor(() => {
      expect(screen.getByText('Matches')).toBeInTheDocument();
      expect(screen.getByText('Players')).toBeInTheDocument();
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });
});

describe('D11TeamPageComponent d11 team name', () => {
  it('renders d11 team name in header', async () => {
    vi.clearAllMocks();

    const d11Team = fakeD11TeamBase();
    const season = fakeSeason();

    const d11TeamApi = {
      getById: vi.fn().mockReturnValue(of(d11Team)),
      getD11MatchesByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as D11TeamApiService;

    const d11TeamSeasonStatApi = {
      getD11TeamSeasonStatsByD11TeamId: vi.fn().mockReturnValue(of([])),
    } as unknown as D11TeamSeasonStatApiService;

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

    const loadingService = {
      isLoading: vi.fn().mockReturnValue(false),
      register: vi.fn(),
    } as unknown as LoadingService;

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({
        d11TeamApi,
        d11TeamSeasonStatApi,
        seasonApi,
        positionApi: fakePositionApi(),
        loadingService,
      }),
    });

    await waitFor(() => {
      expect(screen.getByText(d11Team.name)).toBeInTheDocument();
    });
  });
});

describe('D11TeamPageComponent ranking and points', () => {
  let season: ReturnType<typeof fakeSeason>;
  let d11TeamSeasonStat: D11TeamSeasonStat;

  beforeEach(async () => {
    vi.clearAllMocks();

    const d11Team = fakeD11TeamBase();
    season = fakeSeason();
    d11TeamSeasonStat = fakeD11TeamSeasonStat();
    d11TeamSeasonStat.season = season;

    const d11TeamApi = {
      getById: vi.fn().mockReturnValue(of(d11Team)),
      getD11MatchesByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as D11TeamApiService;

    const d11TeamSeasonStatApi = {
      getD11TeamSeasonStatsByD11TeamId: vi.fn().mockReturnValue(of([d11TeamSeasonStat])),
    } as unknown as D11TeamSeasonStatApiService;

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

    const loadingService = {
      isLoading: vi.fn().mockReturnValue(false),
      register: vi.fn(),
    } as unknown as LoadingService;

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({
        d11TeamApi,
        d11TeamSeasonStatApi,
        seasonApi,
        positionApi: fakePositionApi(),
        loadingService,
      }),
    });
  });

  it('renders ranking from matching d11 team season stat', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('ranking')).toHaveTextContent(String(d11TeamSeasonStat.ranking));
    });
  });

  it('renders points from matching d11 team season stat', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('points')).toHaveTextContent(String(d11TeamSeasonStat.points));
    });
  });
});

describe('D11TeamPageComponent matches tab', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    const d11Team = fakeD11TeamBase();
    const season = fakeSeason();
    const homeD11Team = { ...fakeD11TeamBase(), name: 'Team1' };
    const awayD11Team = { ...fakeD11TeamBase(), name: 'Team2' };
    const d11Match = { ...fakeD11MatchBase(), homeD11Team, awayD11Team };

    const d11TeamApi = {
      getById: vi.fn().mockReturnValue(of(d11Team)),
      getD11MatchesByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([d11Match])),
      getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as D11TeamApiService;

    const d11TeamSeasonStatApi = {
      getD11TeamSeasonStatsByD11TeamId: vi.fn().mockReturnValue(of([])),
    } as unknown as D11TeamSeasonStatApiService;

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

    const loadingService = {
      isLoading: vi.fn().mockReturnValue(false),
      register: vi.fn(),
    } as unknown as LoadingService;

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({
        d11TeamApi,
        d11TeamSeasonStatApi,
        seasonApi,
        positionApi: fakePositionApi(),
        loadingService,
      }),
    });
  });

  it('renders home and away d11 team names in the default Matches tab', async () => {
    await waitFor(() => {
      expect(screen.getByText('Team1')).toBeInTheDocument();
      expect(screen.getByText('Team2')).toBeInTheDocument();
    });
  });
});

describe('D11TeamPageComponent players tab', () => {
  it('renders player name when Players tab is clicked', async () => {
    vi.clearAllMocks();

    const user = userEvent.setup();
    const d11Team = fakeD11TeamBase();
    const season = fakeSeason();
    const playerSeasonStat = fakePlayerSeasonStat();
    playerSeasonStat.position.id = POSITION_IDS.KEEPER;

    const d11TeamApi = {
      getById: vi.fn().mockReturnValue(of(d11Team)),
      getD11MatchesByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([playerSeasonStat])),
    } as unknown as D11TeamApiService;

    const d11TeamSeasonStatApi = {
      getD11TeamSeasonStatsByD11TeamId: vi.fn().mockReturnValue(of([])),
    } as unknown as D11TeamSeasonStatApiService;

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

    const loadingService = {
      isLoading: vi.fn().mockReturnValue(false),
      register: vi.fn(),
    } as unknown as LoadingService;

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({
        d11TeamApi,
        d11TeamSeasonStatApi,
        seasonApi,
        positionApi: fakePositionApi(),
        loadingService,
      }),
    });

    await waitFor(() => expect(screen.getByText('Players')).toBeInTheDocument());
    await user.click(screen.getByText('Players'));

    await waitFor(() => {
      expect(screen.getByText(playerSeasonStat.player.name)).toBeInTheDocument();
    });
  });
});

describe('D11TeamPageComponent seasonId input', () => {
  it('uses the season matching seasonId when provided', async () => {
    vi.clearAllMocks();

    const season1 = fakeSeason();
    const season2 = fakeSeason();
    const d11Team = fakeD11TeamBase();

    const d11TeamApi = {
      getById: vi.fn().mockReturnValue(of(d11Team)),
      getD11MatchesByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as D11TeamApiService;

    const d11TeamSeasonStatApi = {
      getD11TeamSeasonStatsByD11TeamId: vi.fn().mockReturnValue(of([])),
    } as unknown as D11TeamSeasonStatApiService;

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season1, season2])),
    } as unknown as SeasonApiService;

    const loadingService = {
      isLoading: vi.fn().mockReturnValue(false),
      register: vi.fn(),
    } as unknown as LoadingService;

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: season2.id },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({
        d11TeamApi,
        d11TeamSeasonStatApi,
        seasonApi,
        positionApi: fakePositionApi(),
        loadingService,
      }),
    });

    await waitFor(() => {
      expect(screen.getByText(`Matches ${season2.name}`)).toBeInTheDocument();
    });
  });
});

describe('D11TeamPageComponent history navigation', () => {
  let d11TeamSeasonStat: D11TeamSeasonStat;

  beforeEach(async () => {
    vi.clearAllMocks();

    const d11Team = fakeD11TeamBase();
    const season = fakeSeason();
    d11TeamSeasonStat = fakeD11TeamSeasonStat();

    const d11TeamApi = {
      getById: vi.fn().mockReturnValue(of(d11Team)),
      getD11MatchesByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as D11TeamApiService;

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

    const d11TeamSeasonStatApi = {
      getD11TeamSeasonStatsByD11TeamId: vi.fn().mockReturnValue(of([d11TeamSeasonStat])),
    } as unknown as D11TeamSeasonStatApiService;

    const loadingService = {
      isLoading: vi.fn().mockReturnValue(false),
      register: vi.fn(),
    } as unknown as LoadingService;

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({
        d11TeamApi,
        d11TeamSeasonStatApi,
        seasonApi,
        positionApi: fakePositionApi(),
        loadingService,
      }),
    });
  });

  it('navigates to d11 team when season row is clicked', async () => {
    const user = userEvent.setup();

    await waitFor(() => expect(screen.getByText('History')).toBeInTheDocument());
    await user.click(screen.getByText('History'));

    await waitFor(() => {
      expect(screen.getByTestId('season')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('season'));

    expect(mockRouterService.navigateToD11Team).toHaveBeenCalledExactlyOnceWith(
      1,
      d11TeamSeasonStat.season.id,
    );
  });
});

describe('D11TeamPageComponent when loading', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    const season = fakeSeason();

    const d11TeamApi = {
      getById: vi.fn().mockReturnValue(of(fakeD11TeamBase())),
      getD11MatchesByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as D11TeamApiService;

    const d11TeamSeasonStatApi = {
      getD11TeamSeasonStatsByD11TeamId: vi.fn().mockReturnValue(of([])),
    } as unknown as D11TeamSeasonStatApiService;

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

    const loadingService = {
      isLoading: vi.fn().mockReturnValue(true),
      register: vi.fn(),
    } as unknown as LoadingService;

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({
        d11TeamApi,
        d11TeamSeasonStatApi,
        seasonApi,
        positionApi: fakePositionApi(),
        loadingService,
      }),
    });
  });

  it('does not render page', () => {
    expect(document.querySelector('.app-d11-team-page')).not.toBeInTheDocument();
  });
});
