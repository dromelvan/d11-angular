import { signal } from '@angular/core';
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
import { PageContextService } from '@app/core/page-context/page-context.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { RouterService } from '@app/core/router/router.service';
import { DeferBlockBehavior } from '@angular/core/testing';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { NEVER, of } from 'rxjs';
import { expect } from 'vitest';
import { TeamPageComponent } from './team-page.component';

const mockRouterService = { navigateToTeam: vi.fn() };
const mockDynamicDialogService = { openPlayerSeasonStat: vi.fn() };
const mockPageContextService = {
  register: vi.fn(),
  backgroundColor: signal<string | undefined>(undefined),
};

function buildProviders(overrides: {
  teamApi: TeamApiService;
  teamSeasonStatApi: TeamSeasonStatApiService;
  seasonApi: SeasonApiService;
}) {
  return [
    { provide: TeamApiService, useValue: overrides.teamApi },
    { provide: TeamSeasonStatApiService, useValue: overrides.teamSeasonStatApi },
    { provide: SeasonApiService, useValue: overrides.seasonApi },
    { provide: PageContextService, useValue: mockPageContextService },
    { provide: RouterService, useValue: mockRouterService },
    { provide: DynamicDialogService, useValue: mockDynamicDialogService },
  ];
}

describe('TeamPageComponent', () => {
  let team: Team;
  let season: Season;
  let teamApi: TeamApiService;
  let teamSeasonStatApi: TeamSeasonStatApiService;
  let seasonApi: SeasonApiService;

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

  it('registers context with PageContextService', () => {
    expect(mockPageContextService.register).toHaveBeenCalledOnce();
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

  it('renders tabs', async () => {
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Matches' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Players' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'History' })).toBeInTheDocument();
    });
  });
});

describe('TeamPageComponent context registration', () => {
  let team: Team;
  let season: Season;
  let teamSeasonStat: TeamSeasonStat;

  beforeEach(async () => {
    vi.clearAllMocks();

    team = fakeTeam();
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

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi }),
    });
  });

  it('registered title is team name', async () => {
    const context = mockPageContextService.register.mock.calls[0][1];
    await waitFor(() => {
      expect(context.title()).toBe(team.name);
    });
  });

  it('registered subtitle is Season {name}', async () => {
    const context = mockPageContextService.register.mock.calls[0][1];
    await waitFor(() => {
      expect(context.subtitle()).toBe(`Season ${season.name}`);
    });
  });

  it('registered backgroundColor is team colour', async () => {
    const context = mockPageContextService.register.mock.calls[0][1];
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

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

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

    const season = fakeSeason();

    const teamApi = {
      getById: vi.fn().mockReturnValue(NEVER),
      getMatchesByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      getPlayerSeasonStatsByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as TeamApiService;

    const teamSeasonStatApi = {
      getTeamSeasonStatsByTeamId: vi.fn().mockReturnValue(of([])),
    } as unknown as TeamSeasonStatApiService;

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

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

    const user = userEvent.setup();
    const team = fakeTeam();
    team.dummy = false;
    const season = fakeSeason();
    const playerSeasonStat = fakePlayerSeasonStat();
    playerSeasonStat.position.id = POSITION_IDS.KEEPER;

    const teamApi = {
      getById: vi.fn().mockReturnValue(of(team)),
      getMatchesByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      getPlayerSeasonStatsByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([playerSeasonStat])),
    } as unknown as TeamApiService;

    const teamSeasonStatApi = {
      getTeamSeasonStatsByTeamId: vi.fn().mockReturnValue(of([])),
    } as unknown as TeamSeasonStatApiService;

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

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

    const season1 = { ...fakeSeason(), id: 1 };
    const season2 = { ...fakeSeason(), id: 2 };
    const team = fakeTeam();
    team.dummy = false;

    const teamApi = {
      getById: vi.fn().mockReturnValue(of(team)),
      getMatchesByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      getPlayerSeasonStatsByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as TeamApiService;

    const teamSeasonStatApi = {
      getTeamSeasonStatsByTeamId: vi.fn().mockReturnValue(of([])),
    } as unknown as TeamSeasonStatApiService;

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season1, season2])),
    } as unknown as SeasonApiService;

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

    const season = fakeSeason();

    const teamApi = {
      getById: vi.fn().mockReturnValue(NEVER),
      getMatchesByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      getPlayerSeasonStatsByTeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
    } as unknown as TeamApiService;

    const teamSeasonStatApi = {
      getTeamSeasonStatsByTeamId: vi.fn().mockReturnValue(of([])),
    } as unknown as TeamSeasonStatApiService;

    const seasonApi = {
      getAll: vi.fn().mockReturnValue(of([season])),
    } as unknown as SeasonApiService;

    await render(TeamPageComponent, {
      inputs: { teamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ teamApi, teamSeasonStatApi, seasonApi }),
    });

    const context = mockPageContextService.register.mock.calls[0][1];
    expect(context.backgroundColor()).toBe(PRIMARY);
  });
});
