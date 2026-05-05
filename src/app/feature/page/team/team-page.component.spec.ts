import type { Season, Team, TeamSeasonStat } from '@app/core/api';
import { SeasonApiService } from '@app/core/api';
import { TeamSeasonStatApiService } from '@app/core/api/team-season-stat/team-season-stat-api.service';
import { TeamApiService } from '@app/core/api/team/team-api.service';
import {
  fakeMatchBase,
  fakePlayerSeasonStat,
  fakeSeason,
  fakeTeam,
  fakeTeamBase,
  fakeTeamSeasonStat,
} from '@app/test';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DeferBlockBehavior } from '@angular/core/testing';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { of } from 'rxjs';
import { expect } from 'vitest';
import { TeamPageComponent } from './team-page.component';

const mockRouterService = { navigateToTeam: vi.fn() };

function buildProviders(overrides: {
  teamApi: TeamApiService;
  teamSeasonStatApi: TeamSeasonStatApiService;
  seasonApi: SeasonApiService;
  loadingService: LoadingService;
}) {
  return [
    { provide: TeamApiService, useValue: overrides.teamApi },
    { provide: TeamSeasonStatApiService, useValue: overrides.teamSeasonStatApi },
    { provide: SeasonApiService, useValue: overrides.seasonApi },
    { provide: LoadingService, useValue: overrides.loadingService },
    { provide: RouterService, useValue: mockRouterService },
  ];
}

describe('TeamPageComponent', () => {
  let team: Team;
  let season: Season;
  let teamApi: TeamApiService;
  let teamSeasonStatApi: TeamSeasonStatApiService;
  let seasonApi: SeasonApiService;
  let loadingService: LoadingService;

  beforeEach(async () => {
    vi.clearAllMocks();

    team = fakeTeam();
    team.dummy = false;
    season = fakeSeason();

    teamApi = {
      getById: vi.fn().mockReturnValue(of(team)),
      getMatchesByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([fakeMatchBase()])),
      getPlayerSeasonStatsByTeamIdAndSeasonId: vi
        .fn()
        .mockReturnValue(of([fakePlayerSeasonStat()])),
    } as unknown as TeamApiService;

    teamSeasonStatApi = {
      getTeamSeasonStatsByTeamId: vi.fn().mockReturnValue(of([fakeTeamSeasonStat()])),
    } as unknown as TeamSeasonStatApiService;

    seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

    loadingService = {
      isLoading: vi.fn().mockReturnValue(false),
      register: vi.fn(),
    } as unknown as LoadingService;

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi, loadingService }),
    });
  });

  it('renders page', async () => {
    await waitFor(() => {
      expect(document.querySelector('.app-team-page')).toBeInTheDocument();
    });
  });

  it('renders team name in header', async () => {
    await waitFor(() => {
      expect(screen.getByText(team.name)).toBeInTheDocument();
    });
  });

  it('renders team stadium in header', async () => {
    await waitFor(() => {
      expect(screen.getByText(`${team.stadium.name}, ${team.stadium.city}`)).toBeInTheDocument();
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

describe('TeamPageComponent ranking and points', () => {
  let season: Season;
  let teamSeasonStat: TeamSeasonStat;

  beforeEach(async () => {
    vi.clearAllMocks();

    const team = fakeTeam();
    team.dummy = false;
    season = fakeSeason();
    teamSeasonStat = fakeTeamSeasonStat();
    teamSeasonStat.season = season;

    const teamApi = {
      getById: vi.fn().mockReturnValue(of(team)),
      getMatchesByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      getPlayerSeasonStatsByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as TeamApiService;

    const teamSeasonStatApi = {
      getTeamSeasonStatsByTeamId: vi.fn().mockReturnValue(of([teamSeasonStat])),
    } as unknown as TeamSeasonStatApiService;

    const loadingService = {
      isLoading: vi.fn().mockReturnValue(false),
      register: vi.fn(),
    } as unknown as LoadingService;

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi, loadingService }),
    });
  });

  it('renders ranking from matching teamSeasonStat', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('ranking')).toHaveTextContent(String(teamSeasonStat.ranking));
    });
  });

  it('renders points from matching teamSeasonStat', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('points')).toHaveTextContent(String(teamSeasonStat.points));
    });
  });
});

describe('TeamPageComponent matches tab', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    const team = fakeTeam();
    team.dummy = false;
    const season = fakeSeason();
    const homeTeam = { ...fakeTeamBase(), name: 'Team1' };
    const awayTeam = { ...fakeTeamBase(), name: 'Team2' };
    const match = { ...fakeMatchBase(), homeTeam, awayTeam };

    const teamApi = {
      getById: vi.fn().mockReturnValue(of(team)),
      getMatchesByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([match])),
      getPlayerSeasonStatsByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as TeamApiService;

    const teamSeasonStatApi = {
      getTeamSeasonStatsByTeamId: vi.fn().mockReturnValue(of([])),
    } as unknown as TeamSeasonStatApiService;

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

    const loadingService = {
      isLoading: vi.fn().mockReturnValue(false),
      register: vi.fn(),
    } as unknown as LoadingService;

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi, loadingService }),
    });
  });

  it('renders home and away team names in the default Matches tab', async () => {
    await waitFor(() => {
      expect(screen.getByText('Team1')).toBeInTheDocument();
      expect(screen.getByText('Team2')).toBeInTheDocument();
    });
  });
});

describe('TeamPageComponent history navigation', () => {
  let teamSeasonStat: TeamSeasonStat;

  beforeEach(async () => {
    vi.clearAllMocks();

    const team = fakeTeam();
    team.dummy = false;
    const season = fakeSeason();
    teamSeasonStat = fakeTeamSeasonStat();

    const teamApi = {
      getById: vi.fn().mockReturnValue(of(team)),
      getMatchesByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      getPlayerSeasonStatsByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as TeamApiService;

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

    const teamSeasonStatApi = {
      getTeamSeasonStatsByTeamId: vi.fn().mockReturnValue(of([teamSeasonStat])),
    } as unknown as TeamSeasonStatApiService;

    const loadingService = {
      isLoading: vi.fn().mockReturnValue(false),
      register: vi.fn(),
    } as unknown as LoadingService;

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi, loadingService }),
    });
  });

  it('navigates to team when season row is clicked', async () => {
    const user = userEvent.setup();

    await waitFor(() => expect(screen.getByText('History')).toBeInTheDocument());
    await user.click(screen.getByText('History'));

    await waitFor(() => {
      expect(screen.getByTestId('season')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('season'));

    expect(mockRouterService.navigateToTeam).toHaveBeenCalledExactlyOnceWith(
      1,
      teamSeasonStat.season.id,
    );
  });
});

describe('TeamPageComponent when loading', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    const season = fakeSeason();

    const teamApi = {
      getById: vi.fn().mockReturnValue(of(fakeTeam())),
      getMatchesByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      getPlayerSeasonStatsByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as TeamApiService;

    const teamSeasonStatApi = {
      getTeamSeasonStatsByTeamId: vi.fn().mockReturnValue(of([])),
    } as unknown as TeamSeasonStatApiService;

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

    const loadingService = {
      isLoading: vi.fn().mockReturnValue(true),
      register: vi.fn(),
    } as unknown as LoadingService;

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi, loadingService }),
    });
  });

  it('does not render page', () => {
    expect(document.querySelector('.app-team-page')).not.toBeInTheDocument();
  });
});
