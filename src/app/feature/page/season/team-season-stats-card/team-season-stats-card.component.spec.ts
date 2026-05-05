import { TeamSeasonStat } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeTeamBase, fakeTeamSeasonStat } from '@app/test';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { TeamSeasonStatsCardComponent } from './team-season-stats-card.component';

const mockRouterService = { navigateToTeam: vi.fn() };
const providers = [{ provide: RouterService, useValue: mockRouterService }];

function fakeStat(overrides: Partial<TeamSeasonStat> = {}): TeamSeasonStat {
  return { ...fakeTeamSeasonStat(), ...overrides };
}

// Renders ---------------------------------------------------------------------------------------

describe('TeamSeasonStatsCardComponent', () => {
  let teamSeasonStats: TeamSeasonStat[];

  beforeEach(async () => {
    vi.clearAllMocks();

    teamSeasonStats = [
      fakeStat({
        ranking: 1,
        points: 10,
        team: { ...fakeTeamBase(), name: 'Team1', shortName: 'T1' },
      }),
      fakeStat({
        ranking: 2,
        points: 8,
        team: { ...fakeTeamBase(), name: 'Team2', shortName: 'T2' },
      }),
    ];

    await render(TeamSeasonStatsCardComponent, {
      inputs: { teamSeasonStats },
      providers,
    });
  });

  it('renders', () => {
    expect(screen.getByText('Premier League')).toBeInTheDocument();
  });

  it('renders team names', () => {
    expect(screen.getByText('Team1')).toBeInTheDocument();
    expect(screen.getByText('Team2')).toBeInTheDocument();
  });

  it('renders ranking numbers in order', () => {
    const rankingCells = screen.getAllByTestId('ranking');
    expect(rankingCells[0]).toHaveTextContent('1');
    expect(rankingCells[1]).toHaveTextContent('2');
  });

  it('renders points in order', () => {
    const pointsCells = screen.getAllByTestId('points');
    expect(pointsCells[0]).toHaveTextContent('10');
    expect(pointsCells[1]).toHaveTextContent('8');
  });
});

// Navigation ------------------------------------------------------------------------------------

describe('TeamSeasonStatsCardComponent navigation', () => {
  let teamSeasonStat: TeamSeasonStat;

  beforeEach(async () => {
    vi.clearAllMocks();

    teamSeasonStat = fakeStat({
      ranking: 1,
      previousRanking: 1,
      team: { ...fakeTeamBase(), name: 'Team1', shortName: 'T1' },
    });

    await render(TeamSeasonStatsCardComponent, {
      inputs: { teamSeasonStats: [teamSeasonStat] },
      providers,
    });
  });

  it('navigates to team when row is clicked', async () => {
    const user = userEvent.setup();

    await user.click(screen.getByTestId('ranking'));

    expect(mockRouterService.navigateToTeam).toHaveBeenCalledExactlyOnceWith(
      teamSeasonStat.team.id,
      teamSeasonStat.season.id,
    );
  });
});

// Goal difference -------------------------------------------------------------------------------

describe('TeamSeasonStatsCardComponent goal difference positive', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await render(TeamSeasonStatsCardComponent, {
      inputs: {
        teamSeasonStats: [fakeStat({ ranking: 1, previousRanking: 1, goalDifference: 5 })],
      },
      providers,
    });
  });

  it('shows + prefix', () => {
    expect(screen.getByTestId('goal-difference').textContent?.trim()).toBe('+5');
  });
});

describe('TeamSeasonStatsCardComponent goal difference zero', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await render(TeamSeasonStatsCardComponent, {
      inputs: {
        teamSeasonStats: [fakeStat({ ranking: 1, previousRanking: 1, goalDifference: 0 })],
      },
      providers,
    });
  });

  it('shows no prefix', () => {
    expect(screen.getByTestId('goal-difference').textContent?.trim()).toBe('0');
  });
});

describe('TeamSeasonStatsCardComponent goal difference negative', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await render(TeamSeasonStatsCardComponent, {
      inputs: {
        teamSeasonStats: [fakeStat({ ranking: 1, previousRanking: 1, goalDifference: -3 })],
      },
      providers,
    });
  });

  it('shows negative value', () => {
    expect(screen.getByTestId('goal-difference').textContent?.trim()).toBe('-3');
  });
});

// Ranking change indicator ----------------------------------------------------------------------

describe('TeamSeasonStatsCardComponent ranking change unchanged', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await render(TeamSeasonStatsCardComponent, {
      inputs: { teamSeasonStats: [fakeStat({ ranking: 5, previousRanking: 5 })] },
      providers,
    });
  });

  it('does not render ranking change icon', () => {
    expect(document.querySelector('app-icon')).not.toBeInTheDocument();
  });
});

describe('TeamSeasonStatsCardComponent ranking change up', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await render(TeamSeasonStatsCardComponent, {
      inputs: {
        teamSeasonStats: [fakeStat({ ranking: 3, previousRanking: 6, goalDifference: 0 })],
      },
      providers,
    });
  });

  it('renders ranking up icon and delta', () => {
    expect(document.querySelector('app-icon')).toBeInTheDocument();
    expect(screen.getByText('+3', { exact: false })).toBeInTheDocument();
  });
});

describe('TeamSeasonStatsCardComponent ranking change down', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await render(TeamSeasonStatsCardComponent, {
      inputs: {
        teamSeasonStats: [fakeStat({ ranking: 8, previousRanking: 5, goalDifference: 0 })],
      },
      providers,
    });
  });

  it('renders ranking down icon and delta', () => {
    expect(document.querySelector('app-icon')).toBeInTheDocument();
    expect(screen.getByText('-3', { exact: false })).toBeInTheDocument();
  });
});

// Row background classes ------------------------------------------------------------------------

describe('TeamSeasonStatsCardComponent backgrounds', () => {
  let rows: NodeListOf<Element>;

  beforeEach(async () => {
    vi.clearAllMocks();

    const teamSeasonStats = Array.from({ length: 10 }, (_, i) =>
      fakeStat({
        id: i + 1,
        ranking: i + 1,
        previousRanking: i + 1,
        team: { ...fakeTeamBase(), name: `Team${i + 1}` },
      }),
    );

    await render(TeamSeasonStatsCardComponent, {
      inputs: { teamSeasonStats },
      providers,
    });

    rows = document.querySelectorAll('.col-span-4');
  });

  it('first 4 rows have bg-primary class', () => {
    for (let i = 0; i < 4; i++) {
      expect(rows[i]).toHaveClass('bg-primary');
    }
    expect(rows[4]).not.toHaveClass('bg-primary');
  });

  it('row at index 4 has bg-surface-500 class', () => {
    expect(rows[4]).toHaveClass('bg-surface-500');
  });

  it('last 3 rows have bg-surface-500 class', () => {
    const count = rows.length;
    for (let i = count - 3; i < count; i++) {
      expect(rows[i]).toHaveClass('bg-surface-500');
    }
  });

  it('middle rows have neither bg-primary nor bg-surface-500', () => {
    expect(rows[5]).not.toHaveClass('bg-primary');
    expect(rows[5]).not.toHaveClass('bg-surface-500');
    expect(rows[6]).not.toHaveClass('bg-primary');
    expect(rows[6]).not.toHaveClass('bg-surface-500');
  });
});
