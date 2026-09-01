import { render, screen } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { NEVER, of } from 'rxjs';
import { vi } from 'vitest';
import { D11TeamApiService } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeD11MatchBase, fakeD11TeamBase } from '@app/test';
import { D11TeamSeasonMatchesSectionComponent } from './d11-team-season-matches-section.component';

const mockD11TeamApiService = { getD11MatchesByD11TeamIdAndSeasonId: vi.fn() };
const mockRouterService = { navigateToD11Match: vi.fn() };

const providers = [
  { provide: D11TeamApiService, useValue: mockD11TeamApiService },
  { provide: RouterService, useValue: mockRouterService },
];

describe('D11TeamSeasonMatchesSectionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockD11TeamApiService.getD11MatchesByD11TeamIdAndSeasonId.mockReturnValue(of([]));
  });

  it('renders Matches header', async () => {
    await render(D11TeamSeasonMatchesSectionComponent, {
      inputs: { d11TeamId: 1, seasonId: 10 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByTestId('section-header')).toHaveTextContent('Matches');
  });

  describe('loading state', () => {
    it('shows spinner while loading', async () => {
      mockD11TeamApiService.getD11MatchesByD11TeamIdAndSeasonId.mockReturnValue(NEVER);

      const { container } = await render(D11TeamSeasonMatchesSectionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
    });

    it('hides spinner when loaded', async () => {
      const { container } = await render(D11TeamSeasonMatchesSectionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).not.toBeInTheDocument();
    });
  });

  describe('loaded state', () => {
    it('renders home d11 team name', async () => {
      const d11Match = {
        ...fakeD11MatchBase(),
        homeD11Team: { ...fakeD11TeamBase(), name: 'Team1' },
      };
      mockD11TeamApiService.getD11MatchesByD11TeamIdAndSeasonId.mockReturnValue(of([d11Match]));

      await render(D11TeamSeasonMatchesSectionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Team1')).toBeInTheDocument();
    });

    it('renders away d11 team name', async () => {
      const d11Match = {
        ...fakeD11MatchBase(),
        awayD11Team: { ...fakeD11TeamBase(), name: 'Team2' },
      };
      mockD11TeamApiService.getD11MatchesByD11TeamIdAndSeasonId.mockReturnValue(of([d11Match]));

      await render(D11TeamSeasonMatchesSectionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Team2')).toBeInTheDocument();
    });

    it('applies app-text-primary to home d11 team name when d11TeamId matches', async () => {
      const homeD11Team = { ...fakeD11TeamBase(), id: 99, name: 'Team1' };
      const d11Match = { ...fakeD11MatchBase(), homeD11Team };
      mockD11TeamApiService.getD11MatchesByD11TeamIdAndSeasonId.mockReturnValue(of([d11Match]));

      await render(D11TeamSeasonMatchesSectionComponent, {
        inputs: { d11TeamId: 99, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      const spans = Array.from<HTMLElement>(document.querySelectorAll('span'));
      const homeSpan = spans.find((span) => span.textContent?.trim() === 'Team1');
      expect(homeSpan?.classList).toContain('app-text-primary');
    });

    it('applies app-text-primary to away d11 team name when d11TeamId matches', async () => {
      const awayD11Team = { ...fakeD11TeamBase(), id: 99, name: 'Team2' };
      const d11Match = { ...fakeD11MatchBase(), awayD11Team };
      mockD11TeamApiService.getD11MatchesByD11TeamIdAndSeasonId.mockReturnValue(of([d11Match]));

      await render(D11TeamSeasonMatchesSectionComponent, {
        inputs: { d11TeamId: 99, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      const spans = Array.from<HTMLElement>(document.querySelectorAll('span'));
      const awaySpan = spans.find((span) => span.textContent?.trim() === 'Team2');
      expect(awaySpan?.classList).toContain('app-text-primary');
    });

    it('renders separators between matches', async () => {
      const d11Matches = [1, 2, 3].map((id) => ({ ...fakeD11MatchBase(), id }));
      mockD11TeamApiService.getD11MatchesByD11TeamIdAndSeasonId.mockReturnValue(of(d11Matches));

      const { container } = await render(D11TeamSeasonMatchesSectionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelectorAll('.app-separator').length).toBe(2);
    });

    it('renders no matches message when empty', async () => {
      await render(D11TeamSeasonMatchesSectionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('No matches found')).toBeInTheDocument();
    });
  });

  describe('API', () => {
    it('passes d11TeamId and seasonId to the API', async () => {
      await render(D11TeamSeasonMatchesSectionComponent, {
        inputs: { d11TeamId: 7, seasonId: 42 },
        providers,
      });
      TestBed.tick();

      expect(mockD11TeamApiService.getD11MatchesByD11TeamIdAndSeasonId).toHaveBeenCalledWith(7, 42);
    });

    it('does not call API when seasonId is undefined', async () => {
      await render(D11TeamSeasonMatchesSectionComponent, {
        inputs: { d11TeamId: 1 },
        providers,
      });
      TestBed.tick();

      expect(mockD11TeamApiService.getD11MatchesByD11TeamIdAndSeasonId).not.toHaveBeenCalled();
    });
  });
});
