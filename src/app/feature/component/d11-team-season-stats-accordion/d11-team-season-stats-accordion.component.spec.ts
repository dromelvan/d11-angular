import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { D11TeamSeasonStat } from '@app/core/api';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
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

const mockD11TeamSeasonStatApi = {
  getD11TeamSeasonStatsBySeasonId: vi.fn<(id: number) => Observable<D11TeamSeasonStat[]>>(),
};

const providers = [{ provide: D11TeamSeasonStatApiService, useValue: mockD11TeamSeasonStatApi }];

describe('D11TeamSeasonStatsAccordionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of([fakeStat()]));
  });

  it('calls the API with the provided seasonId', async () => {
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of([]));

    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 5 }, providers });
    TestBed.tick();

    expect(mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId).toHaveBeenCalledWith(5);
  });

  it('shows spinner while loading', async () => {
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(NEVER);

    const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { seasonId: 1 },
      providers,
    });
    TestBed.tick();

    expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
  });

  it('hides spinner when data loads', async () => {
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of([]));

    const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { seasonId: 1 },
      providers,
    });
    TestBed.tick();

    expect(container.querySelector('p-progress-spinner')).not.toBeInTheDocument();
  });

  it('renders d11 team names', async () => {
    const stat1 = fakeStat();
    const stat2 = fakeStat();
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of([stat1, stat2]));

    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText(stat1.d11Team.name)).toBeInTheDocument();
    expect(screen.getByText(stat2.d11Team.name)).toBeInTheDocument();
  });

  it('renders column headers', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('GD')).toBeInTheDocument();
    expect(screen.getByText('Pts')).toBeInTheDocument();
  });

  it('renders ranking', async () => {
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), ranking: 5 }]),
    );

    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders positive goal difference with + prefix', async () => {
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), goalDifference: 7 }]),
    );

    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('+7')).toBeInTheDocument();
  });

  it('renders negative goal difference without + prefix', async () => {
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), goalDifference: -3 }]),
    );

    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('-3')).toBeInTheDocument();
  });

  it('renders zero goal difference without + prefix', async () => {
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), goalDifference: 0 }]),
    );

    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders points', async () => {
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), points: 38 }]),
    );

    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('38')).toBeInTheDocument();
  });

  it('renders Played in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('Played')).toBeInTheDocument();
  });

  it('renders Won in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('Won')).toBeInTheDocument();
  });

  it('renders Drawn in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('Drawn')).toBeInTheDocument();
  });

  it('renders Lost in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('Lost')).toBeInTheDocument();
  });

  it('renders match statistics values in accordion body', async () => {
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(
      of([
        {
          ...fakeStat(),
          matchesPlayed: 30,
          matchesWon: 15,
          matchesDrawn: 8,
          matchesLost: 7,
        },
      ]),
    );

    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders Goals for in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('Goals for')).toBeInTheDocument();
  });

  it('renders Goals against in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('Goals against')).toBeInTheDocument();
  });

  it('renders goals for with + prefix in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('+20')).toBeInTheDocument();
  });

  it('renders goals against with - prefix in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('-10')).toBeInTheDocument();
  });

  it('renders Form in accordion body with W/D/L badges', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('Form')).toBeInTheDocument();
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('shows substitution_on icon and positive delta when ranking improved', async () => {
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), ranking: 3, previousRanking: 5 }]),
    );

    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('shows substitution_off icon and negative delta when ranking dropped', async () => {
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), ranking: 4, previousRanking: 2 }]),
    );

    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('-2')).toBeInTheDocument();
  });

  it('shows no ranking change indicator when ranking is unchanged', async () => {
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), ranking: 3, previousRanking: 3, goalDifference: 0 }]),
    );

    const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { seasonId: 1 },
      providers,
    });
    TestBed.tick();

    expect(container.querySelectorAll('.app-text-detail').length).toBe(0);
  });

  it('renders D11 team stats button in accordion body', async () => {
    await render(D11TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('D11 team stats')).toBeInTheDocument();
  });

  it('navigates to D11 team when D11 team stats button is clicked', async () => {
    const routerService = { navigateToD11Team: vi.fn() };
    const stat = fakeStat();
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of([stat]));

    await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { seasonId: 1 },
      providers: [
        ...providers,
        provideRouter([]),
        { provide: RouterService, useValue: routerService },
      ],
    });
    TestBed.tick();

    await userEvent.click(screen.getByText('D11 team stats'));

    expect(routerService.navigateToD11Team).toHaveBeenCalledWith(stat.d11Team.id, stat.season.id);
  });

  it('renders separators between stats', async () => {
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(3)));

    const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
      inputs: { seasonId: 1 },
      providers,
    });
    TestBed.tick();

    expect(container.querySelectorAll('.app-separator').length).toBe(2);
  });

  describe('row background color', () => {
    it('applies first place background color to first row', async () => {
      mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(1)));

      const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
        inputs: { seasonId: 1 },
        providers,
      });
      TestBed.tick();

      const headers = container.querySelectorAll('p-accordion-header');
      expect(headers[0].getAttribute('style')).toContain('var(--p-primary-color)');
    });

    it('applies promotion zone background color to positions 2 through 4', async () => {
      mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(8)));

      const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
        inputs: { seasonId: 1 },
        providers,
      });
      TestBed.tick();

      const headers = container.querySelectorAll('p-accordion-header');
      expect(headers[1].getAttribute('style')).toContain('var(--p-primary-300)');
      expect(headers[2].getAttribute('style')).toContain('var(--p-primary-300)');
      expect(headers[3].getAttribute('style')).toContain('var(--p-primary-300)');
    });

    it('applies no background color to middle positions', async () => {
      mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(8)));

      const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
        inputs: { seasonId: 1 },
        providers,
      });
      TestBed.tick();

      const headers = container.querySelectorAll('p-accordion-header');
      expect(headers[4].getAttribute('style')).not.toContain('background-color');
    });

    it('applies relegation zone background color to bottom 3 positions', async () => {
      mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(8)));

      const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
        inputs: { seasonId: 1 },
        providers,
      });
      TestBed.tick();

      const headers = container.querySelectorAll('p-accordion-header');
      expect(headers[5].getAttribute('style')).toContain('var(--p-surface-500)');
      expect(headers[6].getAttribute('style')).toContain('var(--p-surface-500)');
      expect(headers[7].getAttribute('style')).toContain('var(--p-surface-500)');
    });
  });

  describe('row text color', () => {
    it('applies contrast text color to positions 1 through 4', async () => {
      mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(8)));

      const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
        inputs: { seasonId: 1 },
        providers,
      });
      TestBed.tick();

      const headers = container.querySelectorAll('p-accordion-header');
      expect(headers[0].getAttribute('style')).toContain('var(--p-primary-contrast-color)');
      expect(headers[1].getAttribute('style')).toContain('var(--p-primary-contrast-color)');
      expect(headers[2].getAttribute('style')).toContain('var(--p-primary-contrast-color)');
      expect(headers[3].getAttribute('style')).toContain('var(--p-primary-contrast-color)');
    });

    it('applies no text color to middle positions', async () => {
      mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(8)));

      const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
        inputs: { seasonId: 1 },
        providers,
      });
      TestBed.tick();

      const headers = container.querySelectorAll('p-accordion-header');
      expect(headers[4].getAttribute('style')).not.toContain('var(--p-primary-contrast-color)');
    });

    it('applies contrast text color to bottom 3 positions', async () => {
      mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(8)));

      const { container } = await render(D11TeamSeasonStatsAccordionComponent, {
        inputs: { seasonId: 1 },
        providers,
      });
      TestBed.tick();

      const headers = container.querySelectorAll('p-accordion-header');
      expect(headers[5].getAttribute('style')).toContain('var(--p-primary-contrast-color)');
      expect(headers[6].getAttribute('style')).toContain('var(--p-primary-contrast-color)');
      expect(headers[7].getAttribute('style')).toContain('var(--p-primary-contrast-color)');
    });
  });
});
