import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RouterService } from './router.service';

describe('RouterService', () => {
  let service: RouterService;
  let mockRouter: Partial<Router>;

  beforeEach(() => {
    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
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
});
