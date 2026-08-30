import { render, screen } from '@testing-library/angular';
import { fakeTeamSeasonStat } from '@app/test';
import { TeamSeasonStatSectionComponent } from './team-season-stat-section.component';

describe('TeamSeasonStatSectionComponent', () => {
  it('renders Season Stats header', async () => {
    const teamSeasonStat = fakeTeamSeasonStat();

    await render(TeamSeasonStatSectionComponent, { inputs: { teamSeasonStat } });

    expect(screen.getByTestId('section-header')).toHaveTextContent('Season Stats');
  });

  it('renders ranking', async () => {
    const teamSeasonStat = { ...fakeTeamSeasonStat(), ranking: 3 };

    await render(TeamSeasonStatSectionComponent, { inputs: { teamSeasonStat } });

    expect(screen.getByTestId('ranking')).toHaveTextContent('#3');
  });

  it('renders points', async () => {
    const teamSeasonStat = { ...fakeTeamSeasonStat(), points: 99 };

    await render(TeamSeasonStatSectionComponent, { inputs: { teamSeasonStat } });

    expect(screen.getByTestId('points')).toHaveTextContent('99');
  });

  it('renders goals for', async () => {
    const teamSeasonStat = { ...fakeTeamSeasonStat(), goalsFor: 45 };

    await render(TeamSeasonStatSectionComponent, { inputs: { teamSeasonStat } });

    expect(screen.getByTestId('goals-for')).toHaveTextContent('45');
  });

  it('renders goals against', async () => {
    const teamSeasonStat = { ...fakeTeamSeasonStat(), goalsAgainst: 22 };

    await render(TeamSeasonStatSectionComponent, { inputs: { teamSeasonStat } });

    expect(screen.getByTestId('goals-against')).toHaveTextContent('22');
  });

  it('renders goal difference', async () => {
    const teamSeasonStat = { ...fakeTeamSeasonStat(), goalDifference: 23 };

    await render(TeamSeasonStatSectionComponent, { inputs: { teamSeasonStat } });

    expect(screen.getByTestId('goal-difference')).toHaveTextContent('23');
  });

  it('renders matches won', async () => {
    const teamSeasonStat = { ...fakeTeamSeasonStat(), matchesWon: 10 };

    await render(TeamSeasonStatSectionComponent, { inputs: { teamSeasonStat } });

    expect(screen.getByTestId('matches-won')).toHaveTextContent('10');
  });

  it('renders matches lost', async () => {
    const teamSeasonStat = { ...fakeTeamSeasonStat(), matchesLost: 3 };

    await render(TeamSeasonStatSectionComponent, { inputs: { teamSeasonStat } });

    expect(screen.getByTestId('matches-lost')).toHaveTextContent('3');
  });

  it('renders matches drawn', async () => {
    const teamSeasonStat = { ...fakeTeamSeasonStat(), matchesDrawn: 5 };

    await render(TeamSeasonStatSectionComponent, { inputs: { teamSeasonStat } });

    expect(screen.getByTestId('matches-drawn')).toHaveTextContent('5');
  });

  it('renders Form label', async () => {
    await render(TeamSeasonStatSectionComponent, {
      inputs: { teamSeasonStat: fakeTeamSeasonStat() },
    });

    expect(screen.getByText('Form')).toBeInTheDocument();
  });
});
