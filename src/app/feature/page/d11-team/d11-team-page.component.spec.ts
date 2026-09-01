import { signal, Signal } from '@angular/core';
import type { D11TeamSeasonStat } from '@app/core/api';
import { SeasonApiService } from '@app/core/api';
import { D11TeamApiService } from '@app/core/api/d11-team/d11-team-api.service';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { PRIMARY } from '@app/app.theme';
import { BreakpointService } from '@app/core/breakpoint/breakpoint.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import {
  fakeD11MatchBase,
  fakeD11TeamBase,
  fakeD11TeamSeasonStat,
  fakePlayerSeasonStat,
  fakeSeason,
} from '@app/test';
import { DeferBlockBehavior } from '@angular/core/testing';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { of } from 'rxjs';
import { expect } from 'vitest';
import { D11TeamPageComponent } from './d11-team-page.component';

const mockRouterService = { navigateToD11Team: vi.fn() };
const mockPageContextService = {
  register: vi.fn(),
  backgroundColor: signal<string | undefined>(undefined),
};
const mockBreakpointService = { isSmOrUp: signal(false) };

function buildProviders(overrides: {
  d11TeamApi: D11TeamApiService;
  d11TeamSeasonStatApi: D11TeamSeasonStatApiService;
  seasonApi: SeasonApiService;
  breakpointService?: { isSmOrUp: Signal<boolean> };
}) {
  return [
    { provide: D11TeamApiService, useValue: overrides.d11TeamApi },
    { provide: D11TeamSeasonStatApiService, useValue: overrides.d11TeamSeasonStatApi },
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
    d11TeamSeasonStats?: D11TeamSeasonStat[];
    seasons?: ReturnType<typeof fakeSeason>[];
    d11Matches?: ReturnType<typeof fakeD11MatchBase>[];
    playerSeasonStats?: ReturnType<typeof fakePlayerSeasonStat>[];
  } = {},
) {
  const d11Team = fakeD11TeamBase();
  const season = fakeSeason();

  const d11TeamApi = {
    getById: vi.fn().mockReturnValue(of(d11Team)),
    getD11MatchesByD11TeamIdAndSeasonId: vi
      .fn()
      .mockReturnValue(of(overrides.d11Matches ?? [fakeD11MatchBase()])),
    getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi
      .fn()
      .mockReturnValue(of(overrides.playerSeasonStats ?? [fakePlayerSeasonStat()])),
  } as unknown as D11TeamApiService;

  const d11TeamSeasonStatApi = {
    getD11TeamSeasonStatsByD11TeamId: vi
      .fn()
      .mockReturnValue(of(overrides.d11TeamSeasonStats ?? [])),
  } as unknown as D11TeamSeasonStatApiService;

  const seasonApi = {
    getAll: vi.fn().mockReturnValue(of(overrides.seasons ?? [season])),
  } as unknown as SeasonApiService;

  return { d11Team, season, d11TeamApi, d11TeamSeasonStatApi, seasonApi };
}

describe('D11TeamPageComponent', () => {
  let d11TeamApi: D11TeamApiService;
  let d11TeamSeasonStatApi: D11TeamSeasonStatApiService;
  let seasonApi: SeasonApiService;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    ({ d11TeamApi, d11TeamSeasonStatApi, seasonApi } = buildApis({
      d11TeamSeasonStats: [fakeD11TeamSeasonStat()],
    }));

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ d11TeamApi, d11TeamSeasonStatApi, seasonApi }),
    });
  });

  it('renders hero container', async () => {
    await waitFor(() => {
      expect(document.querySelector('app-hero-container')).toBeInTheDocument();
    });
  });

  it('registers context with PageContextService', () => {
    expect(mockPageContextService.register).toHaveBeenCalledOnce();
  });

  it('renders tabs on mobile layout', async () => {
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Players' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Matches' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'History' })).toBeInTheDocument();
    });
  });
});

describe('D11TeamPageComponent sm layout', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    const { d11TeamApi, d11TeamSeasonStatApi, seasonApi } = buildApis();

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({
        d11TeamApi,
        d11TeamSeasonStatApi,
        seasonApi,
        breakpointService: { isSmOrUp: signal(true) },
      }),
    });
  });

  it('renders all three sections directly', async () => {
    await waitFor(() => {
      expect(
        document.querySelector('app-d11-team-player-season-stats-section'),
      ).toBeInTheDocument();
      expect(document.querySelector('app-d11-team-season-matches-section')).toBeInTheDocument();
      expect(document.querySelector('app-d11-team-history-stats-section')).toBeInTheDocument();
    });
  });

  it('does not render tabs', async () => {
    await waitFor(() => {
      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });
  });
});

describe('D11TeamPageComponent context registration', () => {
  let d11Team: ReturnType<typeof fakeD11TeamBase>;
  let season: ReturnType<typeof fakeSeason>;
  let d11TeamSeasonStat: D11TeamSeasonStat;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    d11TeamSeasonStat = fakeD11TeamSeasonStat();
    season = fakeSeason();
    d11TeamSeasonStat.season = season;

    let d11TeamApi: D11TeamApiService;
    let d11TeamSeasonStatApi: D11TeamSeasonStatApiService;
    let seasonApi: SeasonApiService;
    ({ d11Team, d11TeamApi, d11TeamSeasonStatApi, seasonApi } = buildApis({
      seasons: [season],
      d11TeamSeasonStats: [d11TeamSeasonStat],
    }));

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ d11TeamApi, d11TeamSeasonStatApi, seasonApi }),
    });
  });

  it('registered title is d11 team name', async () => {
    const context = mockPageContextService.register.mock.calls[0][1];
    await waitFor(() => {
      expect(context.title()).toBe(d11Team.name);
    });
  });

  it('registered subtitle is Season {name}', async () => {
    const context = mockPageContextService.register.mock.calls[0][1];
    await waitFor(() => {
      expect(context.subtitle()).toBe(`Season ${season.name}`);
    });
  });

  it('registered backgroundColor is PRIMARY', async () => {
    const context = mockPageContextService.register.mock.calls[0][1];
    await waitFor(() => {
      expect(context.backgroundColor()).toBe(PRIMARY);
    });
  });
});

describe('D11TeamPageComponent ranking and points', () => {
  let season: ReturnType<typeof fakeSeason>;
  let d11TeamSeasonStat: D11TeamSeasonStat;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    season = fakeSeason();
    d11TeamSeasonStat = fakeD11TeamSeasonStat();
    d11TeamSeasonStat.season = season;

    const { d11TeamApi, d11TeamSeasonStatApi, seasonApi } = buildApis({
      seasons: [season],
      d11TeamSeasonStats: [d11TeamSeasonStat],
    });

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ d11TeamApi, d11TeamSeasonStatApi, seasonApi }),
    });
  });

  it('renders ranking from matching d11TeamSeasonStat', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('ranking')).toHaveTextContent(String(d11TeamSeasonStat.ranking));
    });
  });

  it('renders points from matching d11TeamSeasonStat', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('points')).toHaveTextContent(String(d11TeamSeasonStat.points));
    });
  });
});

describe('D11TeamPageComponent season stat section', () => {
  it('does not render season stat section when no matching season stat', async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    const { d11TeamApi, d11TeamSeasonStatApi, seasonApi } = buildApis({
      d11TeamSeasonStats: [],
    });

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ d11TeamApi, d11TeamSeasonStatApi, seasonApi }),
    });

    expect(document.querySelector('app-d11-team-season-stat-section')).toBeNull();
  });
});

describe('D11TeamPageComponent matches tab', () => {
  it('renders home and away d11 team names in the Matches tab', async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    const user = userEvent.setup();
    const homeD11Team = { ...fakeD11TeamBase(), name: 'Team1' };
    const awayD11Team = { ...fakeD11TeamBase(), name: 'Team2' };
    const d11Match = { ...fakeD11MatchBase(), homeD11Team, awayD11Team };

    const { d11TeamApi, d11TeamSeasonStatApi, seasonApi } = buildApis({ d11Matches: [d11Match] });

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ d11TeamApi, d11TeamSeasonStatApi, seasonApi }),
    });

    await waitFor(() => expect(screen.getByRole('tab', { name: 'Matches' })).toBeInTheDocument());
    await user.click(screen.getByRole('tab', { name: 'Matches' }));

    await waitFor(() => {
      expect(screen.getAllByText('Team1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Team2').length).toBeGreaterThan(0);
    });
  });
});

describe('D11TeamPageComponent history navigation', () => {
  let d11TeamSeasonStat: D11TeamSeasonStat;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    d11TeamSeasonStat = fakeD11TeamSeasonStat();

    const { d11TeamApi, d11TeamSeasonStatApi, seasonApi } = buildApis({
      d11TeamSeasonStats: [d11TeamSeasonStat],
    });

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ d11TeamApi, d11TeamSeasonStatApi, seasonApi }),
    });
  });

  it('navigates to d11 team when season row is clicked', async () => {
    const user = userEvent.setup();

    await waitFor(() => expect(screen.getByRole('tab', { name: 'History' })).toBeInTheDocument());
    await user.click(screen.getByRole('tab', { name: 'History' }));

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

describe('D11TeamPageComponent players tab', () => {
  it('renders player name when Players tab is clicked', async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    const user = userEvent.setup();
    const playerSeasonStat = fakePlayerSeasonStat();

    const { d11TeamApi, d11TeamSeasonStatApi, seasonApi } = buildApis({
      playerSeasonStats: [playerSeasonStat],
    });

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: undefined },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ d11TeamApi, d11TeamSeasonStatApi, seasonApi }),
    });

    await waitFor(() => expect(screen.getByRole('tab', { name: 'Players' })).toBeInTheDocument());
    await user.click(screen.getByRole('tab', { name: 'Players' }));

    await waitFor(() => {
      expect(screen.getByText(playerSeasonStat.player.name)).toBeInTheDocument();
    });
  });
});

describe('D11TeamPageComponent seasonId input', () => {
  it('uses the season matching seasonId when provided', async () => {
    vi.clearAllMocks();
    mockBreakpointService.isSmOrUp.set(false);

    const season1 = { ...fakeSeason(), id: 1 };
    const season2 = { ...fakeSeason(), id: 2 };

    const { d11TeamApi, d11TeamSeasonStatApi, seasonApi } = buildApis({
      seasons: [season1, season2],
    });

    await render(D11TeamPageComponent, {
      inputs: { d11TeamId: 1, seasonId: season2.id },
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      providers: buildProviders({ d11TeamApi, d11TeamSeasonStatApi, seasonApi }),
    });

    await waitFor(() => {
      expect(d11TeamApi.getPlayerSeasonStatsByD11TeamIdAndSeasonId).toHaveBeenCalledWith(
        1,
        season2.id,
      );
    });
  });
});
