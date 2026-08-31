import { render, screen } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { NEVER, of } from 'rxjs';
import { vi } from 'vitest';
import { TeamApiService } from '@app/core/api/team/team-api.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeMatchBase, fakeTeamBase } from '@app/test';
import { TeamSeasonMatchesSectionComponent } from './team-season-matches-section.component';

const mockTeamApiService = { getMatchesByTeamIdAndSeasonId: vi.fn() };
const mockRouterService = { navigateToMatch: vi.fn() };

const providers = [
  { provide: TeamApiService, useValue: mockTeamApiService },
  { provide: RouterService, useValue: mockRouterService },
];

describe('TeamSeasonMatchesSectionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTeamApiService.getMatchesByTeamIdAndSeasonId.mockReturnValue(of([]));
  });

  it('renders Matches header', async () => {
    await render(TeamSeasonMatchesSectionComponent, {
      inputs: { teamId: 1, seasonId: 10 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByTestId('section-header')).toHaveTextContent('Matches');
  });

  describe('loading state', () => {
    it('shows spinner while loading', async () => {
      mockTeamApiService.getMatchesByTeamIdAndSeasonId.mockReturnValue(NEVER);

      const { container } = await render(TeamSeasonMatchesSectionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
    });

    it('hides spinner when loaded', async () => {
      const { container } = await render(TeamSeasonMatchesSectionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).not.toBeInTheDocument();
    });
  });

  describe('loaded state', () => {
    it('renders home team name', async () => {
      const match = { ...fakeMatchBase(), homeTeam: { ...fakeTeamBase(), name: 'Team1' } };
      mockTeamApiService.getMatchesByTeamIdAndSeasonId.mockReturnValue(of([match]));

      await render(TeamSeasonMatchesSectionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Team1')).toBeInTheDocument();
    });

    it('renders away team name', async () => {
      const match = { ...fakeMatchBase(), awayTeam: { ...fakeTeamBase(), name: 'Team2' } };
      mockTeamApiService.getMatchesByTeamIdAndSeasonId.mockReturnValue(of([match]));

      await render(TeamSeasonMatchesSectionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Team2')).toBeInTheDocument();
    });

    it('renders separators between matches', async () => {
      const matches = [1, 2, 3].map((id) => ({ ...fakeMatchBase(), id }));
      mockTeamApiService.getMatchesByTeamIdAndSeasonId.mockReturnValue(of(matches));

      const { container } = await render(TeamSeasonMatchesSectionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(container.querySelectorAll('.app-separator').length).toBe(2);
    });

    describe('highlighted team', () => {
      it('applies app-text-primary to home team name when teamId matches home team', async () => {
        const homeTeam = { ...fakeTeamBase(), id: 1, name: 'Team1' };
        const match = { ...fakeMatchBase(), homeTeam };
        mockTeamApiService.getMatchesByTeamIdAndSeasonId.mockReturnValue(of([match]));

        await render(TeamSeasonMatchesSectionComponent, {
          inputs: { teamId: 1, seasonId: 10 },
          providers,
        });
        TestBed.tick();

        expect(screen.getByText('Team1').classList).toContain('app-text-primary');
      });

      it('does not apply app-text-primary to away team name when teamId matches home team', async () => {
        const homeTeam = { ...fakeTeamBase(), id: 1, name: 'Team1' };
        const awayTeam = { ...fakeTeamBase(), id: 2, name: 'Team2' };
        const match = { ...fakeMatchBase(), homeTeam, awayTeam };
        mockTeamApiService.getMatchesByTeamIdAndSeasonId.mockReturnValue(of([match]));

        await render(TeamSeasonMatchesSectionComponent, {
          inputs: { teamId: 1, seasonId: 10 },
          providers,
        });
        TestBed.tick();

        expect(screen.getByText('Team2').classList).not.toContain('app-text-primary');
      });

      it('applies app-text-primary to away team name when teamId matches away team', async () => {
        const awayTeam = { ...fakeTeamBase(), id: 2, name: 'Team2' };
        const match = { ...fakeMatchBase(), awayTeam };
        mockTeamApiService.getMatchesByTeamIdAndSeasonId.mockReturnValue(of([match]));

        await render(TeamSeasonMatchesSectionComponent, {
          inputs: { teamId: 2, seasonId: 10 },
          providers,
        });
        TestBed.tick();

        expect(screen.getByText('Team2').classList).toContain('app-text-primary');
      });
    });

    it('renders no matches message when empty', async () => {
      await render(TeamSeasonMatchesSectionComponent, {
        inputs: { teamId: 1, seasonId: 10 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('No matches found')).toBeInTheDocument();
    });
  });

  describe('API', () => {
    it('passes teamId and seasonId to the API', async () => {
      await render(TeamSeasonMatchesSectionComponent, {
        inputs: { teamId: 7, seasonId: 42 },
        providers,
      });
      TestBed.tick();

      expect(mockTeamApiService.getMatchesByTeamIdAndSeasonId).toHaveBeenCalledWith(7, 42);
    });

    it('does not call API when seasonId is undefined', async () => {
      await render(TeamSeasonMatchesSectionComponent, {
        inputs: { teamId: 1 },
        providers,
      });
      TestBed.tick();

      expect(mockTeamApiService.getMatchesByTeamIdAndSeasonId).not.toHaveBeenCalled();
    });
  });
});
