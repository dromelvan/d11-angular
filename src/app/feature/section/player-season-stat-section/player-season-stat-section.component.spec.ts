import { render, screen } from '@testing-library/angular';
import { fakePlayerSeasonStat } from '@app/test/faker-util';
import { PlayerSeasonStatSectionComponent } from './player-season-stat-section.component';

describe('PlayerSeasonStatSectionComponent', () => {
  it('renders Season Stats header', async () => {
    const playerSeasonStat = fakePlayerSeasonStat();

    await render(PlayerSeasonStatSectionComponent, { inputs: { playerSeasonStat } });

    expect(screen.getByTestId('section-header')).toHaveTextContent('Season Stats');
  });

  it('renders ranking', async () => {
    const playerSeasonStat = { ...fakePlayerSeasonStat(), ranking: 3 };

    await render(PlayerSeasonStatSectionComponent, { inputs: { playerSeasonStat } });

    expect(screen.getByText('#3')).toBeInTheDocument();
  });

  it('renders rating', async () => {
    const playerSeasonStat = { ...fakePlayerSeasonStat(), rating: 750 };

    await render(PlayerSeasonStatSectionComponent, { inputs: { playerSeasonStat } });

    expect(screen.getByText('7.50')).toBeInTheDocument();
  });

  it('renders goals', async () => {
    const playerSeasonStat = { ...fakePlayerSeasonStat(), goals: 33, goalAssists: 7, points: 42 };

    await render(PlayerSeasonStatSectionComponent, { inputs: { playerSeasonStat } });

    expect(screen.getByText('33')).toBeInTheDocument();
  });

  it('renders goal assists', async () => {
    const playerSeasonStat = { ...fakePlayerSeasonStat(), goals: 11, goalAssists: 8, points: 77 };

    await render(PlayerSeasonStatSectionComponent, { inputs: { playerSeasonStat } });

    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('renders points', async () => {
    const playerSeasonStat = { ...fakePlayerSeasonStat(), goals: 14, goalAssists: 6, points: 99 };

    await render(PlayerSeasonStatSectionComponent, { inputs: { playerSeasonStat } });

    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('renders red and yellow cards', async () => {
    const playerSeasonStat = { ...fakePlayerSeasonStat(), redCards: 2, yellowCards: 5 };

    await render(PlayerSeasonStatSectionComponent, { inputs: { playerSeasonStat } });

    expect(screen.getByText('2/5')).toBeInTheDocument();
  });

  it('renders man of the match and shared man of the match', async () => {
    const playerSeasonStat = {
      ...fakePlayerSeasonStat(),
      manOfTheMatch: 4,
      sharedManOfTheMatch: 3,
    };

    await render(PlayerSeasonStatSectionComponent, { inputs: { playerSeasonStat } });

    expect(screen.getByText('4/3')).toBeInTheDocument();
  });

  it('renders games started and substitutions on', async () => {
    const playerSeasonStat = { ...fakePlayerSeasonStat(), gamesStarted: 28, substitutionsOn: 9 };

    await render(PlayerSeasonStatSectionComponent, { inputs: { playerSeasonStat } });

    expect(screen.getByText('28/9')).toBeInTheDocument();
  });
});
