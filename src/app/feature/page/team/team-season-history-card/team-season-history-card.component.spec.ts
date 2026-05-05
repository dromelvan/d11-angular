import { fakeTeamSeasonStat } from '@app/test';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { TeamSeasonHistoryCardComponent } from './team-season-history-card.component';

describe('TeamSeasonHistoryCardComponent', () => {
  it('renders season history', async () => {
    const teamSeasonStats = [fakeTeamSeasonStat(), fakeTeamSeasonStat()];

    await render(TeamSeasonHistoryCardComponent, {
      inputs: { teamSeasonStats, currentSeasonId: undefined },
    });

    expect(screen.getByText('Season history')).toBeInTheDocument();
    teamSeasonStats.forEach((stat) => {
      expect(screen.getByText(stat.season.shortName)).toBeInTheDocument();
    });
  });

  it('renders ranking for each stat', async () => {
    const teamSeasonStats = [fakeTeamSeasonStat(), fakeTeamSeasonStat()];

    await render(TeamSeasonHistoryCardComponent, {
      inputs: { teamSeasonStats, currentSeasonId: undefined },
    });

    const rankingCells = screen.getAllByTestId('ranking');
    expect(rankingCells).toHaveLength(2);
    expect(rankingCells[0]).toHaveTextContent(String(teamSeasonStats[0].ranking));
    expect(rankingCells[1]).toHaveTextContent(String(teamSeasonStats[1].ranking));
  });

  it('renders goal difference with + prefix for positive values', async () => {
    const teamSeasonStat = fakeTeamSeasonStat();
    teamSeasonStat.goalDifference = 5;

    await render(TeamSeasonHistoryCardComponent, {
      inputs: { teamSeasonStats: [teamSeasonStat], currentSeasonId: undefined },
    });

    expect(screen.getByTestId('goal-difference')).toHaveTextContent('+5');
  });

  it('highlights current season row', async () => {
    const teamSeasonStats = [fakeTeamSeasonStat(), fakeTeamSeasonStat()];
    const currentSeasonId = teamSeasonStats[0].season.id;

    await render(TeamSeasonHistoryCardComponent, {
      inputs: { teamSeasonStats, currentSeasonId },
    });

    expect(document.querySelector('.bg-primary')).toBeInTheDocument();
  });

  it('does not highlight non-current season rows', async () => {
    const teamSeasonStats = [fakeTeamSeasonStat(), fakeTeamSeasonStat()];

    await render(TeamSeasonHistoryCardComponent, {
      inputs: { teamSeasonStats, currentSeasonId: undefined },
    });

    expect(document.querySelector('.bg-primary')).not.toBeInTheDocument();
  });

  it('emits seasonSelected when a row is clicked', async () => {
    const user = userEvent.setup();
    const teamSeasonStats = [fakeTeamSeasonStat()];
    const seasonSelected = vi.fn();

    await render(TeamSeasonHistoryCardComponent, {
      inputs: { teamSeasonStats, currentSeasonId: undefined },
      on: { seasonSelected },
    });

    await user.click(screen.getByTestId('season'));

    expect(seasonSelected).toHaveBeenCalledExactlyOnceWith(teamSeasonStats[0]);
  });

  it('renders empty message when no stats', async () => {
    await render(TeamSeasonHistoryCardComponent, {
      inputs: { teamSeasonStats: [], currentSeasonId: undefined },
    });

    expect(screen.getByText('No season history found')).toBeInTheDocument();
  });
});
