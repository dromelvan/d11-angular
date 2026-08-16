import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { D11TeamSeasonStat } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeD11TeamSeasonStat } from '@app/test';
import { provideRouter } from '@angular/router';
import { D11TeamSeasonStatsAccordionComponent } from './d11-team-season-stats-accordion.component';

const fakeStat = (): D11TeamSeasonStat => ({
  ...fakeD11TeamSeasonStat(),
  ranking: 1,
  previousRanking: 1,
  matchesPlayed: 10,
  matchesWon: 6,
  matchesDrawn: 2,
  matchesLost: 2,
  goalsFor: 20,
  goalsAgainst: 10,
  goalDifference: 10,
  formMatchPoints: [3, 1, 0],
  points: 20,
});

const fakeStats = (count: number): D11TeamSeasonStat[] =>
  Array.from({ length: count }, (_, index) => {
    const stat = fakeStat();
    return {
      ...stat,
      ranking: index + 1,
      previousRanking: index + 1,
      d11Team: { ...stat.d11Team, id: index + 1 },
    };
  });

describe('D11TeamSeasonStatsAccordionComponent', () => {
  it('renders d11 team names', async () => {
    const stat1 = fakeStat();
    const stat2 = fakeStat();

    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [stat1, stat2] },
    });

    expect(screen.getByText(stat1.d11Team.name)).toBeInTheDocument();
    expect(screen.getByText(stat2.d11Team.name)).toBeInTheDocument();
  });

  it('renders column headers', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('GD')).toBeInTheDocument();
    expect(screen.getByText('Pts')).toBeInTheDocument();
  });

  it('renders ranking', async () => {
    const stat = { ...fakeStat(), ranking: 5 };

    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [stat] },
    });

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders positive goal difference with + prefix', async () => {
    const stat = { ...fakeStat(), goalDifference: 7 };

    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [stat] },
    });

    expect(screen.getByText('+7')).toBeInTheDocument();
  });

  it('renders negative goal difference without + prefix', async () => {
    const stat = { ...fakeStat(), goalDifference: -3 };

    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [stat] },
    });

    expect(screen.getByText('-3')).toBeInTheDocument();
  });

  it('renders zero goal difference without + prefix', async () => {
    const stat = { ...fakeStat(), goalDifference: 0 };

    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [stat] },
    });

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders points', async () => {
    const stat = { ...fakeStat(), points: 38 };

    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [stat] },
    });

    expect(screen.getByText('38')).toBeInTheDocument();
  });

  it('renders Played in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('Played')).toBeInTheDocument();
  });

  it('renders Won in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('Won')).toBeInTheDocument();
  });

  it('renders Drawn in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('Drawn')).toBeInTheDocument();
  });

  it('renders Lost in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('Lost')).toBeInTheDocument();
  });

  it('renders match statistics values in accordion body', async () => {
    const stat = {
      ...fakeStat(),
      matchesPlayed: 30,
      matchesWon: 15,
      matchesDrawn: 8,
      matchesLost: 7,
    };

    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [stat] },
    });

    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders Goals for in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('Goals for')).toBeInTheDocument();
  });

  it('renders Goals against in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('Goals against')).toBeInTheDocument();
  });

  it('renders goals for with + prefix in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('+20')).toBeInTheDocument();
  });

  it('renders goals against with - prefix in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('-10')).toBeInTheDocument();
  });

  it('renders Form in accordion body with W/D/L badges', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('Form')).toBeInTheDocument();
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('shows substitution_on icon and positive delta when ranking improved', async () => {
    const stat = { ...fakeStat(), ranking: 3, previousRanking: 5 };

    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [stat] },
    });

    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('shows substitution_off icon and negative delta when ranking dropped', async () => {
    const stat = { ...fakeStat(), ranking: 4, previousRanking: 2 };

    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [stat] },
    });

    expect(screen.getByText('-2')).toBeInTheDocument();
  });

  it('shows no ranking change indicator when ranking is unchanged', async () => {
    const stat = { ...fakeStat(), ranking: 3, previousRanking: 3, goalDifference: 0 };

    const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [stat] },
    });

    expect(container.querySelectorAll('.app-text-detail').length).toBe(0);
  });

  it('renders D11 team stats button in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [fakeStat()] },
    });

    expect(screen.getByText('D11 team stats')).toBeInTheDocument();
  });

  it('navigates to D11 team when D11 team stats button is clicked', async () => {
    const routerService = { navigateToD11Team: vi.fn() };
    const stat = fakeStat();

    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: [stat] },
      providers: [provideRouter([]), { provide: RouterService, useValue: routerService }],
    });

    await userEvent.click(screen.getByText('D11 team stats'));

    expect(routerService.navigateToD11Team).toHaveBeenCalledWith(stat.d11Team.id, stat.season.id);
  });

  it('renders separators between stats', async () => {
    const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { d11TeamSeasonStats: fakeStats(3) },
    });

    expect(container.querySelectorAll('.app-separator').length).toBe(2);
  });

  describe('row background color', () => {
    it('applies first place background color to first row', async () => {
      const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
        inputs: { d11TeamSeasonStats: fakeStats(1) },
      });

      const headers = container.querySelectorAll('p-accordion-header');
      expect(headers[0].getAttribute('style')).toContain('var(--p-primary-color)');
    });

    it('applies promotion zone background color to positions 2 through 4', async () => {
      const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
        inputs: { d11TeamSeasonStats: fakeStats(8) },
      });

      const headers = container.querySelectorAll('p-accordion-header');
      expect(headers[1].getAttribute('style')).toContain('var(--p-primary-300)');
      expect(headers[2].getAttribute('style')).toContain('var(--p-primary-300)');
      expect(headers[3].getAttribute('style')).toContain('var(--p-primary-300)');
    });

    it('applies no background color to middle positions', async () => {
      const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
        inputs: { d11TeamSeasonStats: fakeStats(8) },
      });

      const headers = container.querySelectorAll('p-accordion-header');
      expect(headers[4].getAttribute('style')).not.toContain('background-color');
    });

    it('applies relegation zone background color to bottom 3 positions', async () => {
      const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
        inputs: { d11TeamSeasonStats: fakeStats(8) },
      });

      const headers = container.querySelectorAll('p-accordion-header');
      expect(headers[5].getAttribute('style')).toContain('var(--p-surface-500)');
      expect(headers[6].getAttribute('style')).toContain('var(--p-surface-500)');
      expect(headers[7].getAttribute('style')).toContain('var(--p-surface-500)');
    });
  });
});
