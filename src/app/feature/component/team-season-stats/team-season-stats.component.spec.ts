import { TeamSeasonStat } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeTeamBase, fakeTeamSeasonStat } from '@app/test';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, vi } from 'vitest';
import { TeamSeasonStatsComponent } from './team-season-stats.component';

const mockRouterService = { navigateToTeam: vi.fn() };
const providers = [{ provide: RouterService, useValue: mockRouterService }];

function fakeStat(overrides: Partial<TeamSeasonStat> = {}): TeamSeasonStat {
  return { ...fakeTeamSeasonStat(), ...overrides };
}

// Renders ---------------------------------------------------------------------------------------

describe('TeamSeasonStatsComponent', () => {
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

    await render(TeamSeasonStatsComponent, {
      inputs: { teamSeasonStats },
      providers,
    });
  });

  it('renders Premier League heading', () => {
    expect(screen.getByRole('heading', { name: 'Premier League', level: 2 })).toBeInTheDocument();
  });

  it('renders column headers', () => {
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('GD')).toBeInTheDocument();
    expect(screen.getByText('Pts')).toBeInTheDocument();
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

describe('TeamSeasonStatsComponent navigation', () => {
  let teamSeasonStat: TeamSeasonStat;

  beforeEach(async () => {
    vi.clearAllMocks();

    teamSeasonStat = fakeStat({
      ranking: 1,
      previousRanking: 1,
      team: { ...fakeTeamBase(), name: 'Team1', shortName: 'T1' },
    });

    await render(TeamSeasonStatsComponent, {
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

describe('TeamSeasonStatsComponent goal difference positive', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await render(TeamSeasonStatsComponent, {
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

describe('TeamSeasonStatsComponent goal difference zero', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await render(TeamSeasonStatsComponent, {
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

describe('TeamSeasonStatsComponent goal difference negative', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await render(TeamSeasonStatsComponent, {
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

describe('TeamSeasonStatsComponent ranking change unchanged', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await render(TeamSeasonStatsComponent, {
      inputs: { teamSeasonStats: [fakeStat({ ranking: 5, previousRanking: 5 })] },
      providers,
    });
  });

  it('does not render ranking change icon', () => {
    expect(document.querySelector('app-icon')).not.toBeInTheDocument();
  });
});

describe('TeamSeasonStatsComponent ranking change up', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await render(TeamSeasonStatsComponent, {
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

describe('TeamSeasonStatsComponent ranking change down', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await render(TeamSeasonStatsComponent, {
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

describe('TeamSeasonStatsComponent backgrounds', () => {
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

    await render(TeamSeasonStatsComponent, {
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
