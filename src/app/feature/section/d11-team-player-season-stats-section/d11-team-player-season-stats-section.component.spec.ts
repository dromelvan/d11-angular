import { render, screen } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { D11TeamApiService } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
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
});
