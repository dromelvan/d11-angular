import { render, screen } from '@testing-library/angular';
import { Status } from '@app/core/api';
import { fakeMatch } from '@app/test/faker-util';
import { MatchHeroComponent } from './match-hero.component';

describe('MatchHeroComponent', () => {
  it('renders home and away team names', async () => {
    const match = { ...fakeMatch(), status: Status.FINISHED };

    await render(MatchHeroComponent, { inputs: { match } });

    expect(screen.getAllByText(match.homeTeam.name).length).toBeGreaterThan(0);
    expect(screen.getAllByText(match.awayTeam.name).length).toBeGreaterThan(0);
  });

  it('renders score when match is active or finished', async () => {
    const match = {
      ...fakeMatch(),
      status: Status.FINISHED,
      homeTeamGoalsScored: 2,
      awayTeamGoalsScored: 1,
    };

    await render(MatchHeroComponent, { inputs: { match } });

    expect(screen.getByTestId('score')).toHaveTextContent('2');
    expect(screen.getByTestId('score')).toHaveTextContent('1');
  });

  it('renders vs when match is pending', async () => {
    const match = { ...fakeMatch(), status: Status.PENDING };

    await render(MatchHeroComponent, { inputs: { match } });

    expect(screen.getByText('vs')).toBeInTheDocument();
  });

  it('renders stadium name and city', async () => {
    const match = { ...fakeMatch(), status: Status.FINISHED };

    await render(MatchHeroComponent, { inputs: { match } });

    expect(screen.getByTestId('stadium')).toHaveTextContent(match.stadium.name);
    expect(screen.getByTestId('stadium')).toHaveTextContent(match.stadium.city);
  });

  it('renders Postponed when match is postponed', async () => {
    const match = { ...fakeMatch(), status: Status.POSTPONED };

    await render(MatchHeroComponent, { inputs: { match } });

    expect(screen.getByTestId('datetime')).toHaveTextContent('Postponed');
  });

  it('does not render Postponed when match is not postponed', async () => {
    const match = { ...fakeMatch(), status: Status.FINISHED };

    await render(MatchHeroComponent, { inputs: { match } });

    expect(screen.getByTestId('datetime')).not.toHaveTextContent('Postponed');
  });
});
