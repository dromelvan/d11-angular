import { render, screen } from '@testing-library/angular';
import { Status } from '@app/core/api';
import { fakeD11Match, fakeD11MatchBase } from '@app/test/faker-util';
import { D11MatchHeroComponent } from './d11-match-hero.component';

describe('D11MatchHeroComponent', () => {
  it('renders home and away D11 team names', async () => {
    const match = { ...fakeD11Match(), status: Status.FINISHED };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.getAllByText(match.homeD11Team.name).length).toBeGreaterThan(0);
    expect(screen.getAllByText(match.awayD11Team.name).length).toBeGreaterThan(0);
  });

  it('renders home and away D11 team short names', async () => {
    const match = { ...fakeD11Match(), status: Status.FINISHED };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.getAllByText(match.homeD11Team.shortName).length).toBeGreaterThan(0);
    expect(screen.getAllByText(match.awayD11Team.shortName).length).toBeGreaterThan(0);
  });

  it('renders score when match is active', async () => {
    const match = {
      ...fakeD11Match(),
      status: Status.ACTIVE,
      homeTeamGoalsScored: 2,
      awayTeamGoalsScored: 1,
    };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.getByTestId('score')).toHaveTextContent('2');
    expect(screen.getByTestId('score')).toHaveTextContent('1');
  });

  it('renders home and away team points when match is active', async () => {
    const match = {
      ...fakeD11Match(),
      status: Status.ACTIVE,
      homeTeamPoints: 3,
      awayTeamPoints: 1,
    };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.getByTestId('home-team-points')).toHaveTextContent('3');
    expect(screen.getByTestId('away-team-points')).toHaveTextContent('1');
  });

  it('renders home and away team points when match is finished', async () => {
    const match = {
      ...fakeD11Match(),
      status: Status.FINISHED,
      homeTeamPoints: 6,
      awayTeamPoints: 0,
    };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.getByTestId('home-team-points')).toHaveTextContent('6');
    expect(screen.getByTestId('away-team-points')).toHaveTextContent('0');
  });

  it('does not render home and away team points when match is pending', async () => {
    const match = { ...fakeD11Match(), status: Status.PENDING };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.queryByTestId('home-team-points')).toBeNull();
    expect(screen.queryByTestId('away-team-points')).toBeNull();
  });

  it('does not render home and away team points when match is postponed', async () => {
    const match = { ...fakeD11Match(), status: Status.POSTPONED };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.queryByTestId('home-team-points')).toBeNull();
    expect(screen.queryByTestId('away-team-points')).toBeNull();
  });

  it('renders elapsed when match is active', async () => {
    const match = { ...fakeD11Match(), status: Status.ACTIVE, elapsed: '45+2' };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.getByText('45+2')).toBeInTheDocument();
  });

  it('renders elapsed when match is finished', async () => {
    const match = { ...fakeD11Match(), status: Status.FINISHED, elapsed: 'FT' };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.getByText('FT')).toBeInTheDocument();
  });

  it('renders score when match is finished', async () => {
    const match = {
      ...fakeD11Match(),
      status: Status.FINISHED,
      homeTeamGoalsScored: 3,
      awayTeamGoalsScored: 0,
    };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.getByTestId('score')).toHaveTextContent('3');
    expect(screen.getByTestId('score')).toHaveTextContent('0');
  });

  it('does not render score when match is pending', async () => {
    const match = { ...fakeD11Match(), status: Status.PENDING };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.queryByTestId('score')).toBeNull();
  });

  it('does not render score when match is postponed', async () => {
    const match = { ...fakeD11Match(), status: Status.POSTPONED };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.queryByTestId('score')).toBeNull();
  });

  it('renders vs when match is pending', async () => {
    const match = { ...fakeD11Match(), status: Status.PENDING };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.getByText('vs')).toBeInTheDocument();
  });

  it('renders vs when match is postponed', async () => {
    const match = { ...fakeD11Match(), status: Status.POSTPONED };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.getByText('vs')).toBeInTheDocument();
  });

  it('renders Postponed when match is postponed', async () => {
    const match = { ...fakeD11Match(), status: Status.POSTPONED };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.getByTestId('datetime')).toHaveTextContent('Postponed');
  });

  it('does not render Postponed when match is not postponed', async () => {
    const match = { ...fakeD11Match(), status: Status.FINISHED };

    await render(D11MatchHeroComponent, { inputs: { match } });

    expect(screen.getByTestId('datetime')).not.toHaveTextContent('Postponed');
  });

  describe('with D11MatchBase input', () => {
    it('renders home and away D11 team names', async () => {
      const match = { ...fakeD11MatchBase(), status: Status.FINISHED };

      await render(D11MatchHeroComponent, { inputs: { match } });

      expect(screen.getAllByText(match.homeD11Team.name).length).toBeGreaterThan(0);
      expect(screen.getAllByText(match.awayD11Team.name).length).toBeGreaterThan(0);
    });

    it('renders score when match is finished', async () => {
      const match = {
        ...fakeD11MatchBase(),
        status: Status.FINISHED,
        homeTeamGoalsScored: 101,
        awayTeamGoalsScored: 103,
      };

      await render(D11MatchHeroComponent, { inputs: { match } });

      expect(screen.getByTestId('score')).toHaveTextContent('101');
      expect(screen.getByTestId('score')).toHaveTextContent('103');
    });

    it('renders home and away team points when match is finished', async () => {
      const match = {
        ...fakeD11MatchBase(),
        status: Status.FINISHED,
        homeTeamPoints: 6,
        awayTeamPoints: 0,
      };

      await render(D11MatchHeroComponent, { inputs: { match } });

      expect(screen.getByTestId('home-team-points')).toHaveTextContent('6');
      expect(screen.getByTestId('away-team-points')).toHaveTextContent('0');
    });

    it('renders vs when match is pending', async () => {
      const match = { ...fakeD11MatchBase(), status: Status.PENDING };

      await render(D11MatchHeroComponent, { inputs: { match } });

      expect(screen.getByText('vs')).toBeInTheDocument();
    });

    it('renders Postponed when match is postponed', async () => {
      const match = { ...fakeD11MatchBase(), status: Status.POSTPONED };

      await render(D11MatchHeroComponent, { inputs: { match } });

      expect(screen.getByTestId('datetime')).toHaveTextContent('Postponed');
    });
  });
});
