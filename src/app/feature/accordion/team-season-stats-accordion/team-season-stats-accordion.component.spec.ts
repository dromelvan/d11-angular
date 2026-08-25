import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TeamSeasonStat } from '@app/core/api';
import { TeamSeasonStatApiService } from '@app/core/api/team-season-stat/team-season-stat-api.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeTeamSeasonStat } from '@app/test';
import { provideRouter } from '@angular/router';
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
  formMatchPoints: [3, 1, 0],
  points: 20,
});

const fakeStats = (count: number): TeamSeasonStat[] =>
  Array.from({ length: count }, (_, index) => {
    const stat = fakeStat();
    return {
      ...stat,
      ranking: index + 1,
      previousRanking: index + 1,
      team: { ...stat.team, id: index + 1 },
    };
  });

const mockTeamSeasonStatApi = {
  getTeamSeasonStatsBySeasonId: vi.fn<(id: number) => Observable<TeamSeasonStat[]>>(),
};

const providers = [{ provide: TeamSeasonStatApiService, useValue: mockTeamSeasonStatApi }];

describe('TeamSeasonStatsAccordionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of([fakeStat()]));
  });

  it('calls the API with the provided seasonId', async () => {
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of([]));

    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 5 }, providers });
    TestBed.tick();

    expect(mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId).toHaveBeenCalledWith(5);
  });

  it('shows spinner while loading', async () => {
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(NEVER);

    const { container } = await render(TeamSeasonStatsAccordionComponent, {
      inputs: { seasonId: 1 },
      providers,
    });
    TestBed.tick();

    expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
  });

  it('hides spinner when data loads', async () => {
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of([]));

    const { container } = await render(TeamSeasonStatsAccordionComponent, {
      inputs: { seasonId: 1 },
      providers,
    });
    TestBed.tick();

    expect(container.querySelector('p-progress-spinner')).not.toBeInTheDocument();
  });

  it('renders team names', async () => {
    const stat1 = fakeStat();
    const stat2 = fakeStat();
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of([stat1, stat2]));

    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText(stat1.team.name)).toBeInTheDocument();
    expect(screen.getByText(stat2.team.name)).toBeInTheDocument();
  });

  it('renders column headers', async () => {
    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('GD')).toBeInTheDocument();
    expect(screen.getByText('Pts')).toBeInTheDocument();
  });

  it('renders ranking', async () => {
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), ranking: 5 }]),
    );

    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders positive goal difference with + prefix', async () => {
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), goalDifference: 7 }]),
    );

    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('+7')).toBeInTheDocument();
  });

  it('renders negative goal difference without + prefix', async () => {
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), goalDifference: -3 }]),
    );

    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('-3')).toBeInTheDocument();
  });

  it('renders zero goal difference without + prefix', async () => {
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), goalDifference: 0 }]),
    );

    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders points', async () => {
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), points: 38 }]),
    );

    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('38')).toBeInTheDocument();
  });

  it('renders Played in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('Played')).toBeInTheDocument();
  });

  it('renders Won in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('Won')).toBeInTheDocument();
  });

  it('renders Drawn in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('Drawn')).toBeInTheDocument();
  });

  it('renders Lost in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('Lost')).toBeInTheDocument();
  });

  it('renders match statistics values in accordion body', async () => {
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(
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

    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders Goals for in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('Goals for')).toBeInTheDocument();
  });

  it('renders Goals against in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('Goals against')).toBeInTheDocument();
  });

  it('renders goals for with + prefix in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('+20')).toBeInTheDocument();
  });

  it('renders goals against with - prefix in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('-10')).toBeInTheDocument();
  });

  it('renders Form in accordion body with W/D/L badges', async () => {
    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('Form')).toBeInTheDocument();
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('shows substitution_on icon and positive delta when ranking improved', async () => {
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), ranking: 3, previousRanking: 5 }]),
    );

    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('shows substitution_off icon and negative delta when ranking dropped', async () => {
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), ranking: 4, previousRanking: 2 }]),
    );

    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('-2')).toBeInTheDocument();
  });

  it('shows no ranking change indicator when ranking is unchanged', async () => {
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(
      of([{ ...fakeStat(), ranking: 3, previousRanking: 3, goalDifference: 0 }]),
    );

    const { container } = await render(TeamSeasonStatsAccordionComponent, {
      inputs: { seasonId: 1 },
      providers,
    });
    TestBed.tick();

    expect(container.querySelectorAll('.app-text-detail').length).toBe(0);
  });

  it('renders Team stats button in accordion body', async () => {
    await render(TeamSeasonStatsAccordionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText('Team stats')).toBeInTheDocument();
  });

  it('navigates to team when Team stats button is clicked', async () => {
    const routerService = { navigateToTeam: vi.fn() };
    const stat = fakeStat();
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of([stat]));

    await render(TeamSeasonStatsAccordionComponent, {
      inputs: { seasonId: 1 },
      providers: [
        ...providers,
        provideRouter([]),
        { provide: RouterService, useValue: routerService },
      ],
    });
    TestBed.tick();

    await userEvent.click(screen.getByText('Team stats'));

    expect(routerService.navigateToTeam).toHaveBeenCalledWith(stat.team.id, stat.season.id);
  });

  it('renders separators between stats', async () => {
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(3)));

    const { container } = await render(TeamSeasonStatsAccordionComponent, {
      inputs: { seasonId: 1 },
      providers,
    });
    TestBed.tick();

    expect(container.querySelectorAll('.app-separator').length).toBe(2);
  });

  describe('row background color', () => {
    it('applies first place background color to first row', async () => {
      mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(1)));

      const { container } = await render(TeamSeasonStatsAccordionComponent, {
        inputs: { seasonId: 1 },
        providers,
      });
      TestBed.tick();

      const headers = container.querySelectorAll('p-accordion-header');
      expect(headers[0].getAttribute('style')).toContain('var(--p-primary-color)');
    });

    it('applies promotion zone background color to positions 2 through 4', async () => {
      mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(8)));

      const { container } = await render(TeamSeasonStatsAccordionComponent, {
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
      mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(8)));

      const { container } = await render(TeamSeasonStatsAccordionComponent, {
        inputs: { seasonId: 1 },
        providers,
      });
      TestBed.tick();

      const headers = container.querySelectorAll('p-accordion-header');
      expect(headers[4].getAttribute('style')).not.toContain('background-color');
    });

    it('applies relegation zone background color to bottom 3 positions', async () => {
      mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(8)));

      const { container } = await render(TeamSeasonStatsAccordionComponent, {
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
      mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(8)));

      const { container } = await render(TeamSeasonStatsAccordionComponent, {
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
      mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(8)));

      const { container } = await render(TeamSeasonStatsAccordionComponent, {
        inputs: { seasonId: 1 },
        providers,
      });
      TestBed.tick();

      const headers = container.querySelectorAll('p-accordion-header');
      expect(headers[4].getAttribute('style')).not.toContain('var(--p-primary-contrast-color)');
    });

    it('applies contrast text color to bottom 3 positions', async () => {
      mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of(fakeStats(8)));

      const { container } = await render(TeamSeasonStatsAccordionComponent, {
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
