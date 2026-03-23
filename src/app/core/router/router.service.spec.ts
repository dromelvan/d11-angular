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

  // section -----------------------------------------------------------------------------------

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
});
