import { render, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { TeamSeasonStat } from '@app/core/api';
import { fakeTeamSeasonStat } from '@app/test';
import { TeamSeasonStatsAccordionComponent } from './team-season-stats-accordion.component';

const fakeStat = (): TeamSeasonStat => ({
  ...fakeTeamSeasonStat(),
  ranking: 1,
  previousRanking: 1,
  matchesPlayed: 10,
  matchesWon: 6,
  matchesDrawn: 2,
  matchesLost: 2,
  goalsFor: 20,
  goalsAgainst: 10,
  goalDifference: 10,
  points: 20,
});

describe('TeamSeasonStatsAccordionComponent', () => {
  it('renders team names', async () => {
    const stat1 = fakeStat();
    const stat2 = fakeStat();

    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [stat1, stat2] },
    });

    expect(screen.getByText(stat1.team.name)).toBeInTheDocument();
    expect(screen.getByText(stat2.team.name)).toBeInTheDocument();
  });

  it('renders column headers', async () => {
    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('GD')).toBeInTheDocument();
    expect(screen.getByText('Pts')).toBeInTheDocument();
  });

  it('renders ranking', async () => {
    const stat = { ...fakeStat(), ranking: 5 };

    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [stat] },
    });

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders positive goal difference with + prefix', async () => {
    const stat = { ...fakeStat(), goalDifference: 7 };

    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [stat] },
    });

    expect(screen.getByText('+7')).toBeInTheDocument();
  });

  it('renders negative goal difference without + prefix', async () => {
    const stat = { ...fakeStat(), goalDifference: -3 };

    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [stat] },
    });

    expect(screen.getByText('-3')).toBeInTheDocument();
  });

  it('renders zero goal difference without + prefix', async () => {
    const stat = { ...fakeStat(), goalDifference: 0 };

    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [stat] },
    });

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders points', async () => {
    const stat = { ...fakeStat(), points: 38 };

    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [stat] },
    });

    expect(screen.getByText('38')).toBeInTheDocument();
  });

  it('renders Played in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('Played')).toBeInTheDocument();
  });

  it('renders Won in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('Won')).toBeInTheDocument();
  });

  it('renders Drawn in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('Drawn')).toBeInTheDocument();
  });

  it('renders Lost in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('Lost')).toBeInTheDocument();
  });

  it('renders Goals for in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('Goals for')).toBeInTheDocument();
  });

  it('renders Goals against in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('Goals against')).toBeInTheDocument();
  });

  it('renders goals for with + prefix in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('+20')).toBeInTheDocument();
  });

  it('renders goals against with - prefix in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('-10')).toBeInTheDocument();
  });

  it('shows substitution_on icon and positive delta when ranking improved', async () => {
    const stat = { ...fakeStat(), ranking: 3, previousRanking: 5 };

    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [stat] },
    });

    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('shows substitution_off icon and negative delta when ranking dropped', async () => {
    const stat = { ...fakeStat(), ranking: 4, previousRanking: 2 };

    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [stat] },
    });

    expect(screen.getByText('-2')).toBeInTheDocument();
  });

  it('shows no ranking change indicator when ranking is unchanged', async () => {
    const stat = { ...fakeStat(), ranking: 3, previousRanking: 3, goalDifference: 0 };

    const { container } = await render(TeamSeasonStatsAccordionComponent, {
      inputs: { teamSeasonStats: [stat] },
    });

    expect(container.querySelectorAll('.app-text-detail').length).toBe(0);
  });
});
