import { fakeD11TeamSeasonStat } from '@app/test';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { D11TeamSeasonHistoryComponent } from './d11-team-season-history.component';

describe('D11TeamSeasonHistoryComponent', () => {
  it('renders season short names', async () => {
    const d11TeamSeasonStats = [fakeD11TeamSeasonStat(), fakeD11TeamSeasonStat()];

    await render(D11TeamSeasonHistoryComponent, {
      inputs: { d11TeamSeasonStats, currentSeasonId: undefined },
    });

    d11TeamSeasonStats.forEach((stat) => {
      expect(screen.getByText(stat.season.shortName)).toBeInTheDocument();
    });
  });

  it('renders ranking for each stat', async () => {
    const d11TeamSeasonStats = [fakeD11TeamSeasonStat(), fakeD11TeamSeasonStat()];

    await render(D11TeamSeasonHistoryComponent, {
      inputs: { d11TeamSeasonStats, currentSeasonId: undefined },
    });

    const rankingCells = screen.getAllByTestId('ranking');
    expect(rankingCells).toHaveLength(2);
    expect(rankingCells[0]).toHaveTextContent(String(d11TeamSeasonStats[0].ranking));
    expect(rankingCells[1]).toHaveTextContent(String(d11TeamSeasonStats[1].ranking));
  });

  it('renders column headers', async () => {
    await render(D11TeamSeasonHistoryComponent, {
      inputs: { d11TeamSeasonStats: [fakeD11TeamSeasonStat()], currentSeasonId: undefined },
    });

    expect(screen.getByText('Season')).toBeInTheDocument();
    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('GD')).toBeInTheDocument();
    expect(screen.getByText('Pts')).toBeInTheDocument();
  });

  it('renders match stats for each stat', async () => {
    const stat = fakeD11TeamSeasonStat();
    stat.ranking = 1;
    stat.matchesPlayed = 30;
    stat.matchesWon = 20;
    stat.matchesDrawn = 7;
    stat.matchesLost = 3;
    stat.goalDifference = 50;
    stat.points = 60;

    await render(D11TeamSeasonHistoryComponent, {
      inputs: { d11TeamSeasonStats: [stat], currentSeasonId: undefined },
    });

    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders points for each stat', async () => {
    const stat = fakeD11TeamSeasonStat();
    stat.points = 97;

    await render(D11TeamSeasonHistoryComponent, {
      inputs: { d11TeamSeasonStats: [stat], currentSeasonId: undefined },
    });

    expect(screen.getByTestId('points')).toHaveTextContent('97');
  });

  it('renders goal difference with + prefix for positive values', async () => {
    const stat = fakeD11TeamSeasonStat();
    stat.goalDifference = 5;

    await render(D11TeamSeasonHistoryComponent, {
      inputs: { d11TeamSeasonStats: [stat], currentSeasonId: undefined },
    });

    expect(screen.getByTestId('goal-difference')).toHaveTextContent('+5');
  });

  it('renders goal difference without + prefix for negative values', async () => {
    const stat = fakeD11TeamSeasonStat();
    stat.goalDifference = -3;

    await render(D11TeamSeasonHistoryComponent, {
      inputs: { d11TeamSeasonStats: [stat], currentSeasonId: undefined },
    });

    expect(screen.getByTestId('goal-difference')).toHaveTextContent('-3');
    expect(screen.getByTestId('goal-difference').textContent).not.toContain('+-3');
  });

  it('renders goal difference without + prefix when zero', async () => {
    const stat = fakeD11TeamSeasonStat();
    stat.goalDifference = 0;

    await render(D11TeamSeasonHistoryComponent, {
      inputs: { d11TeamSeasonStats: [stat], currentSeasonId: undefined },
    });

    expect(screen.getByTestId('goal-difference')).toHaveTextContent('0');
    expect(screen.getByTestId('goal-difference').textContent).not.toContain('+');
  });

  it('adds separator to non-last rows', async () => {
    const d11TeamSeasonStats = [fakeD11TeamSeasonStat(), fakeD11TeamSeasonStat()];

    await render(D11TeamSeasonHistoryComponent, {
      inputs: { d11TeamSeasonStats, currentSeasonId: undefined },
    });

    const rows = document.querySelectorAll('.col-span-8');
    expect(rows[0].classList).toContain('app-grid-separator');
    expect(rows[1].classList).not.toContain('app-grid-separator');
  });

  it('highlights current season row', async () => {
    const d11TeamSeasonStats = [fakeD11TeamSeasonStat(), fakeD11TeamSeasonStat()];
    const currentSeasonId = d11TeamSeasonStats[0].season.id;

    await render(D11TeamSeasonHistoryComponent, {
      inputs: { d11TeamSeasonStats, currentSeasonId },
    });

    expect(document.querySelector('.bg-primary')).toBeInTheDocument();
  });

  it('does not highlight non-current season rows', async () => {
    const d11TeamSeasonStats = [fakeD11TeamSeasonStat(), fakeD11TeamSeasonStat()];

    await render(D11TeamSeasonHistoryComponent, {
      inputs: { d11TeamSeasonStats, currentSeasonId: undefined },
    });

    expect(document.querySelector('.bg-primary')).not.toBeInTheDocument();
  });

  it('emits seasonSelected when a row is clicked', async () => {
    const user = userEvent.setup();
    const d11TeamSeasonStats = [fakeD11TeamSeasonStat()];
    const seasonSelected = vi.fn();

    await render(D11TeamSeasonHistoryComponent, {
      inputs: { d11TeamSeasonStats, currentSeasonId: undefined },
      on: { seasonSelected },
    });

    await user.click(screen.getByTestId('season'));

    expect(seasonSelected).toHaveBeenCalledExactlyOnceWith(d11TeamSeasonStats[0]);
  });

  it('renders empty message when no stats', async () => {
    await render(D11TeamSeasonHistoryComponent, {
      inputs: { d11TeamSeasonStats: [], currentSeasonId: undefined },
    });

    expect(screen.getByText('No season history found')).toBeInTheDocument();
  });
});
