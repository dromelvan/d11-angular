import { render, screen } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { waitFor } from '@testing-library/angular';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { D11TeamApiService, PlayerSeasonStat } from '@app/core/api';
import { Position } from '@app/core/api/model/position.model';
import { RouterService } from '@app/core/router/router.service';
import {
  fakeD11TeamBase,
  fakePlayerBase,
  fakePlayerSeasonStat,
  fakePosition,
  fakeTeamBase,
} from '@app/test';
import { D11TeamPlayerSeasonStatsSectionComponent } from './d11-team-player-season-stats-section.component';

const mockD11TeamApiService = { getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi.fn() };
const mockRouterService = { navigateToPlayer: vi.fn() };

const providers = [
  { provide: D11TeamApiService, useValue: mockD11TeamApiService },
  { provide: RouterService, useValue: mockRouterService },
];

describe('D11TeamPlayerSeasonStatsSectionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockD11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId.mockReturnValue(of([]));
  });

  it('renders Players header', async () => {
    await render(D11TeamPlayerSeasonStatsSectionComponent, {
      inputs: { d11TeamId: 1, seasonId: 10 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByTestId('section-header')).toHaveTextContent('Players');
  });

  it('passes d11TeamId and seasonId to accordion', async () => {
    await render(D11TeamPlayerSeasonStatsSectionComponent, {
      inputs: { d11TeamId: 7, seasonId: 42 },
      providers,
    });
    TestBed.tick();

    expect(mockD11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId).toHaveBeenCalledWith(
      7,
      42,
    );
  });

  it('defaults context to d11-team', async () => {
    const { fixture } = await render(D11TeamPlayerSeasonStatsSectionComponent, {
      inputs: { d11TeamId: 1, seasonId: 10 },
      providers,
    });

    expect(fixture.componentInstance.context()).toBe('d11-team');
  });

  it('passes context to accordion', async () => {
    const { fixture } = await render(D11TeamPlayerSeasonStatsSectionComponent, {
      inputs: { d11TeamId: 1, seasonId: 10, context: 'd11-teams' },
      providers,
    });

    expect(fixture.componentInstance.context()).toBe('d11-teams');
  });

  it('renders d11 team name and image as header when context is d11-teams', async () => {
    const d11Team = { ...fakeD11TeamBase(), name: 'D11Team1' };
    const { container } = await render(D11TeamPlayerSeasonStatsSectionComponent, {
      inputs: { d11TeamId: 1, seasonId: 10, context: 'd11-teams', d11Team },
      providers,
    });
    TestBed.tick();

    expect(screen.getByTestId('section-header')).toHaveTextContent('D11Team1');
    expect(container.querySelector('app-d11-team-img')).toBeInTheDocument();
  });

  it('renders Players header when context is d11-team', async () => {
    await render(D11TeamPlayerSeasonStatsSectionComponent, {
      inputs: { d11TeamId: 1, seasonId: 10, context: 'd11-team' },
      providers,
    });
    TestBed.tick();

    expect(screen.getByTestId('section-header')).toHaveTextContent('Players');
  });

  it('renders Players header when context is d11-teams but d11Team is not provided', async () => {
    await render(D11TeamPlayerSeasonStatsSectionComponent, {
      inputs: { d11TeamId: 1, seasonId: 10, context: 'd11-teams' },
      providers,
    });
    TestBed.tick();

    expect(screen.getByTestId('section-header')).toHaveTextContent('Players');
  });

  describe('summary when context is d11-teams', () => {
    let positionGK: Position;
    let positionMF: Position;
    let playerSeasonStats: PlayerSeasonStat[];
    let positions: Position[];

    beforeEach(() => {
      positionGK = { ...fakePosition(), id: 1, maxCount: 1, sortOrder: 1 };
      positionMF = { ...fakePosition(), id: 2, maxCount: 3, sortOrder: 2 };

      positions = [positionGK, positionMF];

      const team = { ...fakeTeamBase(), dummy: false };

      playerSeasonStats = [
        {
          ...fakePlayerSeasonStat(),
          player: { ...fakePlayerBase(), name: 'Player1' },
          team,
          position: positionGK,
          fee: 50,
        },
        {
          ...fakePlayerSeasonStat(),
          player: { ...fakePlayerBase(), name: 'Player2' },
          team,
          position: positionMF,
          fee: 30,
        },
        {
          ...fakePlayerSeasonStat(),
          player: { ...fakePlayerBase(), name: 'Player3' },
          team,
          position: positionMF,
          fee: 20,
        },
      ];

      mockD11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId.mockReturnValue(
        of(playerSeasonStats),
      );
    });

    it('renders lineup counts, error highlighting, separators, and total fee', async () => {
      const d11Team = fakeD11TeamBase();
      await render(D11TeamPlayerSeasonStatsSectionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10, context: 'd11-teams', d11Team, positions },
        providers,
      });

      await waitFor(() => {
        TestBed.tick();
        const lineupEl = screen.getByText('Lineup');
        const lineupRow = lineupEl.closest('.app-row-1');
        expect(lineupRow?.textContent).toContain('1');
        expect(lineupRow?.textContent).toContain('2');
        const errorSpans = Array.from(lineupRow?.querySelectorAll('.text-error') ?? []);
        expect(errorSpans.some((el) => el.textContent?.trim() === '2')).toBe(true);
        expect(errorSpans.some((el) => el.textContent?.trim() === '1')).toBe(false);
        const separators = Array.from(lineupRow?.querySelectorAll('span') ?? []).filter(
          (el) => el.textContent?.trim() === '-',
        );
        expect(separators.length).toBe(1);
        expect(screen.getByText('Total: 10.0m')).toBeInTheDocument();
      });
    });

    it('excludes positions with maxCount 0 from lineup display', async () => {
      const positionNA = { ...fakePosition(), id: 3, maxCount: 0, sortOrder: 3 };
      const d11Team = fakeD11TeamBase();
      await render(D11TeamPlayerSeasonStatsSectionComponent, {
        inputs: {
          d11TeamId: 1,
          seasonId: 10,
          context: 'd11-teams',
          d11Team,
          positions: [...positions, positionNA],
        },
        providers,
      });

      await waitFor(() => {
        TestBed.tick();
        const lineupEl = screen.getByText('Lineup');
        const lineupRow = lineupEl.closest('.app-row-1');
        const separators = Array.from(lineupRow?.querySelectorAll('span') ?? []).filter(
          (el) => el.textContent?.trim() === '-',
        );
        expect(separators.length).toBe(1);
      });
    });

    it('does not render summary when context is d11-team', async () => {
      await render(D11TeamPlayerSeasonStatsSectionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10, context: 'd11-team', positions },
        providers,
      });
      TestBed.tick();

      await waitFor(() => {
        expect(screen.queryByText('Lineup')).not.toBeInTheDocument();
      });
    });

    it('does not render summary when there are no players', async () => {
      mockD11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId.mockReturnValue(of([]));
      const d11Team = fakeD11TeamBase();
      await render(D11TeamPlayerSeasonStatsSectionComponent, {
        inputs: { d11TeamId: 1, seasonId: 10, context: 'd11-teams', d11Team, positions },
        providers,
      });
      TestBed.tick();

      await waitFor(() => {
        expect(screen.queryByText('Lineup')).not.toBeInTheDocument();
      });
    });
  });
});
