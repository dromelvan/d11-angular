import { render, screen } from '@testing-library/angular';
import { fakeD11TeamSeasonStat } from '@app/test';
import { D11TeamSeasonStatSectionComponent } from './d11-team-season-stat-section.component';

describe('D11TeamSeasonStatSectionComponent', () => {
  it('renders Season Stats header', async () => {
    const d11TeamSeasonStat = fakeD11TeamSeasonStat();

    await render(D11TeamSeasonStatSectionComponent, { inputs: { d11TeamSeasonStat } });

    expect(screen.getByTestId('section-header')).toHaveTextContent('Season Stats');
  });

  it('renders ranking', async () => {
    const d11TeamSeasonStat = { ...fakeD11TeamSeasonStat(), ranking: 3 };

    await render(D11TeamSeasonStatSectionComponent, { inputs: { d11TeamSeasonStat } });

    expect(screen.getByTestId('ranking')).toHaveTextContent('#3');
  });

  it('renders points', async () => {
    const d11TeamSeasonStat = { ...fakeD11TeamSeasonStat(), points: 99 };

    await render(D11TeamSeasonStatSectionComponent, { inputs: { d11TeamSeasonStat } });

    expect(screen.getByTestId('points')).toHaveTextContent('99');
  });

  it('renders goals for', async () => {
    const d11TeamSeasonStat = { ...fakeD11TeamSeasonStat(), goalsFor: 45 };

    await render(D11TeamSeasonStatSectionComponent, { inputs: { d11TeamSeasonStat } });

    expect(screen.getByTestId('goals-for')).toHaveTextContent('45');
  });

  it('renders goals against', async () => {
    const d11TeamSeasonStat = { ...fakeD11TeamSeasonStat(), goalsAgainst: 22 };

    await render(D11TeamSeasonStatSectionComponent, { inputs: { d11TeamSeasonStat } });

    expect(screen.getByTestId('goals-against')).toHaveTextContent('22');
  });

  it('renders goal difference', async () => {
    const d11TeamSeasonStat = { ...fakeD11TeamSeasonStat(), goalDifference: 23 };

    await render(D11TeamSeasonStatSectionComponent, { inputs: { d11TeamSeasonStat } });

    expect(screen.getByTestId('goal-difference')).toHaveTextContent('23');
  });

  it('renders matches won', async () => {
    const d11TeamSeasonStat = { ...fakeD11TeamSeasonStat(), matchesWon: 10 };

    await render(D11TeamSeasonStatSectionComponent, { inputs: { d11TeamSeasonStat } });

    expect(screen.getByTestId('matches-won')).toHaveTextContent('10');
  });

  it('renders matches lost', async () => {
    const d11TeamSeasonStat = { ...fakeD11TeamSeasonStat(), matchesLost: 3 };

    await render(D11TeamSeasonStatSectionComponent, { inputs: { d11TeamSeasonStat } });

    expect(screen.getByTestId('matches-lost')).toHaveTextContent('3');
  });

  it('renders matches drawn', async () => {
    const d11TeamSeasonStat = { ...fakeD11TeamSeasonStat(), matchesDrawn: 5 };

    await render(D11TeamSeasonStatSectionComponent, { inputs: { d11TeamSeasonStat } });

    expect(screen.getByTestId('matches-drawn')).toHaveTextContent('5');
  });

  it('renders Form label', async () => {
    await render(D11TeamSeasonStatSectionComponent, {
      inputs: { d11TeamSeasonStat: fakeD11TeamSeasonStat() },
    });

    expect(screen.getByText('Form')).toBeInTheDocument();
  });
});
