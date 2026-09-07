import { signal, Signal } from '@angular/core';
import type { Season, Team, TeamSeasonStat } from '@app/core/api';
import { POSITION_IDS, SeasonApiService } from '@app/core/api';
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
import { PRIMARY } from '@app/app.theme';
import { BreakpointService } from '@app/core/breakpoint/breakpoint.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { DeferBlockBehavior } from '@angular/core/testing';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { NEVER, of } from 'rxjs';
import { expect } from 'vitest';
import { TeamPageComponent } from './team-page.component';

const mockRouterService = { navigateToTeam: vi.fn() };
const mockPageContextService = {
  setContext: vi.fn(),
  backgroundColor: signal<string | undefined>(undefined),
};
const mockBreakpointService = { isSmOrUp: signal(false) };

function buildProviders(overrides: {
  teamApi: TeamApiService;
  teamSeasonStatApi: TeamSeasonStatApiService;
  seasonApi: SeasonApiService;
  breakpointService?: { isSmOrUp: Signal<boolean> };
}) {
  return [
    { provide: TeamApiService, useValue: overrides.teamApi },
    { provide: TeamSeasonStatApiService, useValue: overrides.teamSeasonStatApi },
    { provide: SeasonApiService, useValue: overrides.seasonApi },
    { provide: PageContextService, useValue: mockPageContextService },
    { provide: RouterService, useValue: mockRouterService },
    {
      provide: BreakpointService,
      useValue: overrides.breakpointService ?? mockBreakpointService,
    },
  ];
}

function buildApis(
  overrides: {
    team?: Team;
    matches?: ReturnType<typeof fakeMatchBase>[];
    playerSeasonStats?: ReturnType<typeof fakePlayerSeasonStat>[];
    teamSeasonStats?: TeamSeasonStat[];
    seasons?: Season[];
  } = {},
) {
  const team =
    overrides.team ??
    (() => {
      const t = fakeTeam();
      t.dummy = false;
      return t;
    })();
  const season = fakeSeason();

  const teamApi = {
    getById: vi.fn().mockReturnValue(of(team)),
    getMatchesByTeamIdAndSeasonId: vi.fn().mockReturnValue(of(overrides.matches ?? [])),
    getPlayerSeasonStatsByTeamIdAndSeasonId: vi
      .fn()
      .mockReturnValue(of(overrides.playerSeasonStats ?? [])),
  } as unknown as TeamApiService;

  const teamSeasonStatApi = {
    getTeamSeasonStatsByTeamId: vi.fn().mockReturnValue(of(overrides.teamSeasonStats ?? [])),
  } as unknown as TeamSeasonStatApiService;

  const seasonApi = {
    getAll: vi.fn().mockReturnValue(of(overrides.seasons ?? [season])),
  } as unknown as SeasonApiService;

  return { team, season, teamApi, teamSeasonStatApi, seasonApi };
}

describe('TeamPageComponent', () => {
  let team: Team;
  let teamApi: TeamApiService;
  let teamSeasonStatApi: TeamSeasonStatApiService;
  let seasonApi: SeasonApiService;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    ({ team, teamApi, teamSeasonStatApi, seasonApi } = buildApis({
      matches: [fakeMatchBase()],
      playerSeasonStats: [fakePlayerSeasonStat()],
      teamSeasonStats: [fakeTeamSeasonStat()],
    }));

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi }),
    });
  });

  it('renders page', async () => {
    await waitFor(() => {
      expect(document.querySelector('app-hero-container')).toBeInTheDocument();
    });
  });

  it('sets context with PageContextService', () => {
    expect(mockPageContextService.setContext).toHaveBeenCalledOnce();
  });

  it('renders team stadium name in hero', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('stadium-name')).toHaveTextContent(team.stadium.name);
    });
  });

  it('renders team stadium city in hero', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('stadium-city')).toHaveTextContent(team.stadium.city);
    });
  });

  it('renders tabs on mobile layout', async () => {
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Players' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Matches' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'History' })).toBeInTheDocument();
    });
  });
});

describe('TeamPageComponent sm layout', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    const { teamApi, teamSeasonStatApi, seasonApi } = buildApis();

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({
        teamApi,
        teamSeasonStatApi,
        seasonApi,
        breakpointService: { isSmOrUp: signal(true) },
      }),
    });
  });

  it('renders all three sections directly', async () => {
    await waitFor(() => {
      expect(document.querySelector('app-team-player-season-stats-section')).toBeInTheDocument();
      expect(document.querySelector('app-team-season-matches-section')).toBeInTheDocument();
      expect(document.querySelector('app-team-history-stats-section')).toBeInTheDocument();
    });
  });

  it('does not render tabs', async () => {
    await waitFor(() => {
      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });
  });
});

describe('TeamPageComponent context registration', () => {
  let team: Team;
  let season: Season;
  let teamSeasonStat: TeamSeasonStat;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    teamSeasonStat = fakeTeamSeasonStat();
    season = fakeSeason();
    teamSeasonStat.season = season;

    let teamApi: TeamApiService;
    let teamSeasonStatApi: TeamSeasonStatApiService;
    let seasonApi: SeasonApiService;
    ({ team, teamApi, teamSeasonStatApi, seasonApi } = buildApis({
      seasons: [season],
      teamSeasonStats: [teamSeasonStat],
    }));

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi }),
    });
  });

  it('registered title is team name', async () => {
    const context = mockPageContextService.setContext.mock.calls[0][0];
    await waitFor(() => {
      expect(context.title()).toBe(team.name);
    });
  });

  it('registered subtitle is Season {name}', async () => {
    const context = mockPageContextService.setContext.mock.calls[0][0];
    await waitFor(() => {
      expect(context.subtitle()).toBe(`Season ${season.name}`);
    });
  });

  it('registered backgroundColor is team colour', async () => {
    const context = mockPageContextService.setContext.mock.calls[0][0];
    await waitFor(() => {
      expect(context.backgroundColor()).toBe(team.colour);
    });
  });
});

describe('TeamPageComponent ranking and points', () => {
  let season: Season;
  let teamSeasonStat: TeamSeasonStat;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    season = fakeSeason();
    teamSeasonStat = fakeTeamSeasonStat();
    teamSeasonStat.season = season;

    const { teamApi, teamSeasonStatApi, seasonApi } = buildApis({
      seasons: [season],
      teamSeasonStats: [teamSeasonStat],
    });

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi }),
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

describe('TeamPageComponent when loading', () => {
  it('does not render app-team-hero', async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    const teamApi = {
      getById: vi.fn().mockReturnValue(NEVER),
      getMatchesByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      getPlayerSeasonStatsByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as TeamApiService;

    const { teamSeasonStatApi, seasonApi } = buildApis();

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi }),
    });

    expect(document.querySelector('app-team-hero')).toBeNull();
  });
});

describe('TeamPageComponent matches tab', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    const homeTeam = { ...fakeTeamBase(), name: 'Team1' };
    const awayTeam = { ...fakeTeamBase(), name: 'Team2' };
    const match = { ...fakeMatchBase(), homeTeam, awayTeam };

    const { teamApi, teamSeasonStatApi, seasonApi } = buildApis({ matches: [match] });

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi }),
    });
  });

  it('renders home and away team names in the Matches tab', async () => {
    const user = userEvent.setup();

    await waitFor(() => expect(screen.getByRole('tab', { name: 'Matches' })).toBeInTheDocument());
    await user.click(screen.getByRole('tab', { name: 'Matches' }));

    await waitFor(() => {
      expect(screen.getAllByText('Team1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Team2').length).toBeGreaterThan(0);
    });
  });
});

describe('TeamPageComponent history navigation', () => {
  let teamSeasonStat: TeamSeasonStat;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    teamSeasonStat = fakeTeamSeasonStat();

    const { teamApi, teamSeasonStatApi, seasonApi } = buildApis({
      teamSeasonStats: [teamSeasonStat],
    });

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi }),
    });
  });

  it('navigates to team when season row is clicked', async () => {
    const user = userEvent.setup();

    await waitFor(() => expect(screen.getByRole('tab', { name: 'History' })).toBeInTheDocument());
    await user.click(screen.getByRole('tab', { name: 'History' }));

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

describe('TeamPageComponent players tab', () => {
  it('renders player name when Players tab is clicked', async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    const user = userEvent.setup();
    const playerSeasonStat = fakePlayerSeasonStat();
    playerSeasonStat.position.id = POSITION_IDS.KEEPER;

    const { teamApi, teamSeasonStatApi, seasonApi } = buildApis({
      playerSeasonStats: [playerSeasonStat],
    });

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi }),
    });

    await waitFor(() => expect(screen.getByRole('tab', { name: 'Players' })).toBeInTheDocument());
    await user.click(screen.getByRole('tab', { name: 'Players' }));

    await waitFor(() => {
      expect(screen.getByText(playerSeasonStat.player.name)).toBeInTheDocument();
    });
  });
});

describe('TeamPageComponent seasonId input', () => {
  it('uses the season matching seasonId when provided', async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    const season1 = { ...fakeSeason(), id: 1 };
    const season2 = { ...fakeSeason(), id: 2 };

    const { teamApi, teamSeasonStatApi, seasonApi } = buildApis({
      seasons: [season1, season2],
    });

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: season2.id },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi }),
    });

    await waitFor(() => {
      expect(teamApi.getMatchesByTeamIdAndSeasonId).toHaveBeenCalledWith(1, season2.id);
    });
  });

  it('registered backgroundColor is PRIMARY when team is not loaded', async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    const teamApi = {
      getById: vi.fn().mockReturnValue(NEVER),
      getMatchesByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      getPlayerSeasonStatsByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as TeamApiService;

    const { teamSeasonStatApi, seasonApi } = buildApis();

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi }),
    });

    const context = mockPageContextService.setContext.mock.calls[0][0];
    expect(context.backgroundColor()).toBe(PRIMARY);
  });
});
