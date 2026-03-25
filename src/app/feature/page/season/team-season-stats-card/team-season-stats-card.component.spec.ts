import { Component } from '@angular/core';
import { TeamSeasonStat } from '@app/core/api';
import { fakeTeamBase, fakeTeamSeasonStat } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { TeamSeasonStatsCardComponent } from './team-season-stats-card.component';

let teamSeasonStats: TeamSeasonStat[];

@Component({
  template: ` <app-team-season-stats-card [teamSeasonStats]="teamSeasonStats" />`,
  standalone: true,
  imports: [TeamSeasonStatsCardComponent],
})
class HostComponent {
  teamSeasonStats = teamSeasonStats;
}

function statWithRankings(ranking: number, previousRanking: number): TeamSeasonStat {
  return { ...fakeTeamSeasonStat(), ranking, previousRanking };
}

// Renders ---------------------------------------------------------------------------------------

describe('TeamSeasonStatsCardComponent', () => {
  beforeEach(async () => {
    teamSeasonStats = [
      {
        ...fakeTeamSeasonStat(),
        ranking: 1,
        points: 1,
        team: { ...fakeTeamBase(), name: 'AAAAAA', shortName: 'AAA' },
      },
      {
        ...fakeTeamSeasonStat(),
        ranking: 2,
        points: 2,
        team: { ...fakeTeamBase(), name: 'BBBBBB', shortName: 'BBB' },
      },
    ];
    await render(HostComponent, {});
  });

  it('renders', () => {
    expect(document.querySelector('app-team-season-stats-card')).toBeInTheDocument();
  });

  it('renders team names', () => {
    for (const stat of teamSeasonStats) {
      const expectedName = stat.team.name.length > 22 ? stat.team.shortName : stat.team.name;
      expect(screen.getByText(expectedName)).toBeInTheDocument();
    }
  });

  it('renders ranking numbers in order', () => {
    const rankingCells = screen.getAllByTestId('ranking');
    const renderedRankings = rankingCells.map((el) => Number(el.textContent?.trim()));
    const expectedRankings = teamSeasonStats.map((s) => s.ranking);
    expect(renderedRankings).toEqual(expectedRankings);
  });

  it('renders points in order', () => {
    const pointsCells = screen.getAllByTestId('points');
    const renderedPoints = pointsCells.map((el) => Number(el.textContent?.trim()));
    const expectedPoints = teamSeasonStats.map((s) => s.points);
    expect(renderedPoints).toEqual(expectedPoints);
  });
});

// Goal difference -------------------------------------------------------------------------------

describe('TeamSeasonStatsCardComponent goal difference', () => {
  it('shows positive goal difference', async () => {
    teamSeasonStats = [{ ...fakeTeamSeasonStat(), goalDifference: 5 }];
    await render(HostComponent, {});

    expect(screen.getByText('+5')).toBeInTheDocument();
  });

  it('shows zero goal difference', async () => {
    teamSeasonStats = [{ ...fakeTeamSeasonStat(), goalDifference: 0 }];
    await render(HostComponent, {});

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.queryByText('+0')).not.toBeInTheDocument();
  });

  it('shows negative goal difference', async () => {
    teamSeasonStats = [{ ...fakeTeamSeasonStat(), goalDifference: -3 }];
    await render(HostComponent, {});

    expect(screen.getByText('-3')).toBeInTheDocument();
  });
});

// Ranking change indicator ----------------------------------------------------------------------

describe('TeamSeasonStatsCardComponent ranking change', () => {
  it('does not render no ranking change', async () => {
    teamSeasonStats = [statWithRankings(5, 5)];
    await render(HostComponent, {});

    expect(document.querySelector('app-icon')).not.toBeInTheDocument();
  });

  it('renders ranking change on ranking up', async () => {
    teamSeasonStats = [statWithRankings(3, 6)];
    await render(HostComponent, {});

    const icon = document.querySelector('app-icon');
    expect(icon).toBeInTheDocument();
    expect(screen.getByText('+3', { exact: false })).toBeInTheDocument();
  });

  it('renders ranking change on ranking down', async () => {
    teamSeasonStats = [statWithRankings(8, 5)];
    await render(HostComponent, {});

    const icon = document.querySelector('app-icon');
    expect(icon).toBeInTheDocument();
    expect(screen.getByText('-3', { exact: false })).toBeInTheDocument();
  });
});

// Row background classes ------------------------------------------------------------------------

describe('TeamSeasonStatsCardComponent backgrounds', () => {
  function buildTable(count: number): TeamSeasonStat[] {
    return Array.from({ length: count }, (_, i) => ({
      ...fakeTeamSeasonStat(),
      id: i + 1,
      ranking: i + 1,
      previousRanking: i + 1,
      team: { ...fakeTeamBase(), name: `Team ${i + 1}` },
    }));
  }

  function getRows(): NodeListOf<Element> {
    return document.querySelectorAll('.col-span-4');
  }

  it('first 4 rows have bg-primary class', async () => {
    teamSeasonStats = buildTable(10);
    await render(HostComponent, {});

    const rows = getRows();
    for (let i = 0; i < 4; i++) {
      expect(rows[i]).toHaveClass('bg-primary');
    }
    expect(rows[4]).not.toHaveClass('bg-primary');
  });

  it('row at index 4 has bg-surface-500 class', async () => {
    teamSeasonStats = buildTable(10);
    await render(HostComponent, {});

    const rows = getRows();
    expect(rows[4]).toHaveClass('bg-surface-500');
  });

  it('last 3 rows have bg-surface-500 class', async () => {
    teamSeasonStats = buildTable(10);
    await render(HostComponent, {});

    const rows = getRows();
    const count = rows.length;
    for (let i = count - 3; i < count; i++) {
      expect(rows[i]).toHaveClass('bg-surface-500');
    }
  });

  it('middle rows have neither bg-primary nor bg-surface-500', async () => {
    teamSeasonStats = buildTable(10);
    await render(HostComponent, {});

    const rows = getRows();

    expect(rows[5]).not.toHaveClass('bg-primary');
    expect(rows[5]).not.toHaveClass('bg-surface-500');
    expect(rows[6]).not.toHaveClass('bg-primary');
    expect(rows[6]).not.toHaveClass('bg-surface-500');
  });
});
