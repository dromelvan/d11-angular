import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { NEVER, of } from 'rxjs';
import { vi } from 'vitest';
import { D11TeamSeasonStatApiService } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeD11TeamSeasonStat } from '@app/test';
import { D11TeamHistoryStatsSectionComponent } from './d11-team-history-stats-section.component';

const stat = (overrides = {}) => ({ ...fakeD11TeamSeasonStat(), ...overrides });

const mockApiService = { getD11TeamSeasonStatsByD11TeamId: vi.fn() };
const mockRouterService = { navigateToD11Team: vi.fn() };

const providers = [
  { provide: D11TeamSeasonStatApiService, useValue: mockApiService },
  { provide: RouterService, useValue: mockRouterService },
];

describe('D11TeamHistoryStatsSectionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of([]));
  });

  describe('header', () => {
    it('renders History header', async () => {
      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('section-header')).toHaveTextContent('History');
    });

    it('renders column headers', async () => {
      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
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
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(NEVER);

      const { container } = await render(D11TeamHistoryStatsSectionComponent, {
        inputs: { d11TeamId: 1 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
    });

    it('hides spinner when loaded', async () => {
      const { container } = await render(D11TeamHistoryStatsSectionComponent, {
        inputs: { d11TeamId: 1 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).not.toBeInTheDocument();
    });
  });

  describe('loaded state', () => {
    it('renders season short name', async () => {
      const stat1 = stat();
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of([stat1]));

      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText(stat1.season.shortName)).toBeInTheDocument();
    });

    it('renders ranking with # prefix', async () => {
      const stat1 = stat({ ranking: 5 });
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of([stat1]));

      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText('#5')).toBeInTheDocument();
    });

    it('renders matches won', async () => {
      const stat1 = stat({ matchesWon: 20 });
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of([stat1]));

      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('matches-won')).toHaveTextContent('20');
    });

    it('renders matches drawn', async () => {
      const stat1 = stat({ matchesDrawn: 10 });
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of([stat1]));

      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('matches-drawn')).toHaveTextContent('10');
    });

    it('renders matches lost', async () => {
      const stat1 = stat({ matchesLost: 8 });
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of([stat1]));

      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('matches-lost')).toHaveTextContent('8');
    });

    it('renders goals for', async () => {
      const stat1 = stat({ goalsFor: 55 });
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of([stat1]));

      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('goals-for')).toHaveTextContent('55');
    });

    it('renders goals against', async () => {
      const stat1 = stat({ goalsAgainst: 33 });
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of([stat1]));

      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('goals-against')).toHaveTextContent('33');
    });

    it('renders goal difference', async () => {
      const stat1 = stat({ goalDifference: 22 });
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of([stat1]));

      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('goal-difference')).toHaveTextContent('22');
    });

    it('renders points', async () => {
      const stat1 = stat({ points: 77 });
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of([stat1]));

      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getAllByText('77').length).toBeGreaterThan(0);
    });

    it('renders separators between rows', async () => {
      const stats = [1, 2, 3].map((id) => stat({ id }));
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of(stats));

      const { container } = await render(D11TeamHistoryStatsSectionComponent, {
        inputs: { d11TeamId: 1 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelectorAll('.app-separator').length).toBe(2);
    });

    it('navigates to d11 team page when row is clicked', async () => {
      const stat1 = stat();
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of([stat1]));

      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      await userEvent.click(screen.getByText(stat1.season.shortName));

      expect(mockRouterService.navigateToD11Team).toHaveBeenCalledWith(1, stat1.season.id);
    });
  });

  describe('summary', () => {
    it('renders seasons count', async () => {
      const stats = [stat(), stat(), stat()];
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of(stats));

      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText('3 seasons')).toBeInTheDocument();
    });

    it('renders total points', async () => {
      const stats = [stat({ points: 60 }), stat({ points: 40 })];
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of(stats));

      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByTestId('summary-points')).toHaveTextContent('100');
    });

    it('does not render avg ranking when there are no stats', async () => {
      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      expect(screen.queryByText(/Avg rank/)).not.toBeInTheDocument();
    });

    it('renders avg ranking', async () => {
      const stats = [stat({ ranking: 2 }), stat({ ranking: 4 })];
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of(stats));

      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText('Avg rank 3')).toBeInTheDocument();
    });

    it('renders avg ranking rounded to one decimal', async () => {
      const stats = [stat({ ranking: 1 }), stat({ ranking: 2 })];
      mockApiService.getD11TeamSeasonStatsByD11TeamId.mockReturnValue(of(stats));

      await render(D11TeamHistoryStatsSectionComponent, { inputs: { d11TeamId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText('Avg rank 1.5')).toBeInTheDocument();
    });
  });

  describe('API', () => {
    it('passes d11TeamId to the API', async () => {
      await render(D11TeamHistoryStatsSectionComponent, {
        inputs: { d11TeamId: 42 },
        providers,
      });
      TestBed.tick();

      expect(mockApiService.getD11TeamSeasonStatsByD11TeamId).toHaveBeenCalledWith(42);
    });
  });
});
