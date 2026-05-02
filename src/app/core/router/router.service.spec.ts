import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Component } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { waitFor } from '@testing-library/angular';
import { EMPTY } from 'rxjs';
import { RouterService } from './router.service';

@Component({ template: '', standalone: true })
class BlankComponent {}

const routes = [
  { path: '', component: BlankComponent },
  { path: 'match-week', component: BlankComponent, data: { section: 'Match Week' } },
  { path: 'players', component: BlankComponent, data: { section: 'Players' } },
];

describe('RouterService', () => {
  let service: RouterService;
  let mockRouter: Partial<Router>;

  beforeEach(() => {
    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
      events: EMPTY,
      url: '/',
      routerState: { snapshot: { root: { firstChild: null, data: {} } } } as Router['routerState'],
    };

    TestBed.configureTestingModule({
      providers: [RouterService, { provide: Router, useValue: mockRouter }],
    });

    service = TestBed.inject(RouterService);
  });

  it('should navigate to match', async () => {
    const matchId = 1;
    const result = await service.navigateToMatch(matchId);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['matches', matchId]);
    expect(result).toBe(true);
  });

  it('should navigate to match week', async () => {
    const matchWeekId = 1;
    const result = await service.navigateToMatchWeek(matchWeekId);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['match-weeks', matchWeekId]);
    expect(result).toBe(true);
  });

  it('should navigate to season', async () => {
    const seasonId = 5;
    const result = await service.navigateToSeason(seasonId);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['seasons', seasonId]);
    expect(result).toBe(true);
  });

  it('should navigate to players', async () => {
    const result = await service.navigateToPlayers();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['players'], {});
    expect(result).toBe(true);
  });

  it('should navigate to players with seasonId', async () => {
    const seasonId = 5;
    const result = await service.navigateToPlayers(seasonId);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['players'], { queryParams: { seasonId } });
    expect(result).toBe(true);
  });

  it('should navigate to player without seasonId', async () => {
    const playerId = 1;
    const result = await service.navigateToPlayer(playerId);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['players', playerId], {});
    expect(result).toBe(true);
  });

  it('should navigate to player with seasonId', async () => {
    const playerId = 1;
    const seasonId = 1;

    const result = await service.navigateToPlayer(playerId, seasonId);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['players', playerId], {
      queryParams: { seasonId },
    });
    expect(result).toBe(true);
  });

  it('should navigate to transfer window with transferWindowId', async () => {
    const transferWindowId = 1;
    const result = await service.navigateToTransferWindow(transferWindowId);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['transfers', transferWindowId]);
    expect(result).toBe(true);
  });

  it('should navigate to current D11 teams', async () => {
    const result = await service.navigateToD11Teams();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['d11-teams'], {});
    expect(result).toBe(true);
  });

  it('should navigate to D11 teams with seasonId', async () => {
    const seasonId = 1;
    const result = await service.navigateToD11Teams(seasonId);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['d11-teams'], {
      queryParams: { seasonId },
    });
    expect(result).toBe(true);
  });

  it('should navigate to matches', async () => {
    const result = await service.navigateToMatches();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['matches']);
    expect(result).toBe(true);
  });

  it('should navigate to match week matches', async () => {
    const matchWeekId = 1;
    const result = await service.navigateToMatchWeekMatches(matchWeekId);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['matches', 'week', matchWeekId]);
    expect(result).toBe(true);
  });

  it('should navigate to login', async () => {
    const result = await service.navigateToLogin();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
    expect(result).toBe(true);
  });

  it('should navigate to more', async () => {
    const result = await service.navigateToMore();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['more']);
    expect(result).toBe(true);
  });

  it('should navigate to rules', async () => {
    const result = await service.navigateToRules();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['rules']);
    expect(result).toBe(true);
  });

  // Section -----------------------------------------------------------------------------------

  describe('section', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [RouterService, provideRouter(routes)],
      });
      service = TestBed.inject(RouterService);
    });

    it('is undefined before any navigation', () => {
      expect(service.section()).toBeUndefined();
    });

    it('returns section from route data after navigation', async () => {
      await TestBed.inject(Router).navigate(['/match-week']);

      await waitFor(() => expect(service.section()).toBe('Match Week'));
    });

    it('updates section when navigating to a different route', async () => {
      const router = TestBed.inject(Router);
      await router.navigate(['/match-week']);
      await router.navigate(['/players']);

      await waitFor(() => expect(service.section()).toBe('Players'));
    });

    it('returns null when navigating to a route without section data', async () => {
      const router = TestBed.inject(Router);
      await router.navigate(['/match-week']);
      await router.navigate(['/']);

      await waitFor(() => expect(service.section()).toBeNull());
    });
  });

  // Route stack -------------------------------------------------------------------------------

  describe('route stack', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          RouterService,
          provideRouter([
            { path: '', component: BlankComponent },
            { path: 'match-weeks', component: BlankComponent },
            { path: 'match-weeks/:id', component: BlankComponent },
            { path: 'matches', component: BlankComponent },
            { path: 'matches/:id', component: BlankComponent },
            { path: 'players/:id', component: BlankComponent },
            { path: 'seasons', component: BlankComponent },
          ]),
        ],
      });
      service = TestBed.inject(RouterService);
    });

    it('hasStack is false', () => {
      expect(service.hasStack()).toBe(false);
    });

    it('pushes to stack on navigation', async () => {
      const router = TestBed.inject(Router);
      await router.navigate(['/match-weeks/1']);

      await service.navigateToMatch(1);

      expect(service.hasStack()).toBe(true);
    });

    it('does not push to stack on navigation to same component', async () => {
      const router = TestBed.inject(Router);
      await router.navigate(['/match-weeks/1']);

      await service.navigateToMatchWeek(2);

      expect(service.hasStack()).toBe(false);
    });

    it('clears the stack when push is false', async () => {
      const router = TestBed.inject(Router);
      await router.navigate(['/match-weeks/1']);
      await service.navigateToMatch(1);

      await service.navigateToMatchWeek(2, false);

      expect(service.hasStack()).toBe(false);
    });

    it('navigates to previous and pops the stack', async () => {
      const router = TestBed.inject(Router);
      await router.navigate(['/match-weeks/1']);
      await service.navigateToMatch(1);

      await service.navigateToPrevious();

      await waitFor(() => expect(router.url).toBe('/match-weeks/1'));
      expect(service.hasStack()).toBe(false);
    });

    it('navigateToPrevious returns false on empty stack', async () => {
      const result = await service.navigateToPrevious();

      expect(result).toBe(false);
    });

    it('clears the stack when navigating to a flat route', async () => {
      const router = TestBed.inject(Router);
      await router.navigate(['/match-weeks/1']);
      await service.navigateToMatch(1);

      await service.navigateToMatches();

      expect(service.hasStack()).toBe(false);
    });

    it('clearStack empties the stack', async () => {
      const router = TestBed.inject(Router);
      await router.navigate(['/match-weeks/1']);
      await service.navigateToMatch(1);

      service.clearStack();

      expect(service.hasStack()).toBe(false);
    });
  });
});
