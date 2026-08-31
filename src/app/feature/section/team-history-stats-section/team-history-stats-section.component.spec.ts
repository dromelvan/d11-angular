import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { NEVER, of } from 'rxjs';
import { vi } from 'vitest';
import { TeamSeasonStatApiService } from '@app/core/api/team-season-stat/team-season-stat-api.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeTeamSeasonStat } from '@app/test';
import { TeamHistoryStatsSectionComponent } from './team-history-stats-section.component';

const stat = (overrides = {}) => ({ ...fakeTeamSeasonStat(), ...overrides });

const mockApiService = { getTeamSeasonStatsByTeamId: vi.fn() };
const mockRouterService = { navigateToTeam: vi.fn() };

const providers = [
  { provide: TeamSeasonStatApiService, useValue: mockApiService },
  { provide: RouterService, useValue: mockRouterService },
];

describe('TeamHistoryStatsSectionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(of([]));
  });

  describe('header', () => {
    it('renders History header', async () => {
      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('section-header')).toHaveTextContent('History');
    });

    it('renders column headers', async () => {
      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText('Season')).toBeInTheDocument();
      expect(screen.getByText('Rank')).toBeInTheDocument();
      expect(screen.getByText('W')).toBeInTheDocument();
      expect(screen.getByText('D')).toBeInTheDocument();
      expect(screen.getByText('L')).toBeInTheDocument();
      expect(screen.getByText('G+')).toBeInTheDocument();
      expect(screen.getByText('G-')).toBeInTheDocument();
      expect(screen.getByText('GD')).toBeInTheDocument();
      expect(screen.getByText('Pts')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows spinner while loading', async () => {
      mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(NEVER);

      const { container } = await render(TeamHistoryStatsSectionComponent, {
        inputs: { teamId: 1 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
    });

    it('hides spinner when loaded', async () => {
      const { container } = await render(TeamHistoryStatsSectionComponent, {
        inputs: { teamId: 1 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).not.toBeInTheDocument();
    });
  });

  describe('loaded state', () => {
    it('renders season short name', async () => {
      const stat1 = stat();
      mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(of([stat1]));

      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText(stat1.season.shortName)).toBeInTheDocument();
    });

    it('renders ranking with # prefix', async () => {
      const stat1 = stat({ ranking: 5 });
      mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(of([stat1]));

      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText('#5')).toBeInTheDocument();
    });

    it('renders matches won', async () => {
      const stat1 = stat({ matchesWon: 20 });
      mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(of([stat1]));

      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('matches-won')).toHaveTextContent('20');
    });

    it('renders matches drawn', async () => {
      const stat1 = stat({ matchesDrawn: 10 });
      mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(of([stat1]));

      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('matches-drawn')).toHaveTextContent('10');
    });

    it('renders matches lost', async () => {
      const stat1 = stat({ matchesLost: 8 });
      mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(of([stat1]));

      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('matches-lost')).toHaveTextContent('8');
    });

    it('renders goals for', async () => {
      const stat1 = stat({ goalsFor: 55 });
      mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(of([stat1]));

      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('goals-for')).toHaveTextContent('55');
    });

    it('renders goals against', async () => {
      const stat1 = stat({ goalsAgainst: 33 });
      mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(of([stat1]));

      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('goals-against')).toHaveTextContent('33');
    });

    it('renders goal difference', async () => {
      const stat1 = stat({ goalDifference: 22 });
      mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(of([stat1]));

      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('goal-difference')).toHaveTextContent('22');
    });

    it('renders points', async () => {
      const stat1 = stat({ points: 77 });
      mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(of([stat1]));

      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getAllByText('77').length).toBeGreaterThan(0);
    });

    it('renders separators between rows', async () => {
      const stats = [1, 2, 3].map((id) => stat({ id }));
      mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(of(stats));

      const { container } = await render(TeamHistoryStatsSectionComponent, {
        inputs: { teamId: 1 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelectorAll('.app-separator').length).toBe(2);
    });

    it('navigates to team page when row is clicked', async () => {
      const stat1 = stat();
      mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(of([stat1]));

      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 1 }, providers });
      TestBed.tick();

      await userEvent.click(screen.getByText(stat1.season.shortName));

      expect(mockRouterService.navigateToTeam).toHaveBeenCalledWith(1, stat1.season.id);
    });
  });

  describe('summary', () => {
    it('renders seasons count', async () => {
      const stats = [stat(), stat(), stat()];
      mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(of(stats));

      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText('3 seasons')).toBeInTheDocument();
    });

    it('renders total points', async () => {
      const stats = [stat({ points: 60 }), stat({ points: 40 })];
      mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(of(stats));

      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('renders avg ranking', async () => {
      const stats = [stat({ ranking: 2 }), stat({ ranking: 4 })];
      mockApiService.getTeamSeasonStatsByTeamId.mockReturnValue(of(stats));

      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText('Avg rank 3')).toBeInTheDocument();
    });
  });

  describe('API', () => {
    it('passes teamId to the API', async () => {
      await render(TeamHistoryStatsSectionComponent, { inputs: { teamId: 42 }, providers });
      TestBed.tick();

      expect(mockApiService.getTeamSeasonStatsByTeamId).toHaveBeenCalledWith(42);
    });
  });
});
