import { render, screen } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { TeamApiService } from '@app/core/api/team/team-api.service';
import { RouterService } from '@app/core/router/router.service';
import { TeamPlayerSeasonStatsSectionComponent } from './team-player-season-stats-section.component';

const mockTeamApiService = { getPlayerSeasonStatsByTeamIdAndSeasonId: vi.fn() };
const mockRouterService = { navigateToPlayer: vi.fn() };

const providers = [
  { provide: TeamApiService, useValue: mockTeamApiService },
  { provide: RouterService, useValue: mockRouterService },
];

describe('TeamPlayerSeasonStatsSectionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId.mockReturnValue(of([]));
  });

  it('renders Players header', async () => {
    await render(TeamPlayerSeasonStatsSectionComponent, {
      inputs: { teamId: 1, seasonId: 10 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByTestId('section-header')).toHaveTextContent('Players');
  });

  it('passes teamId and seasonId to accordion', async () => {
    await render(TeamPlayerSeasonStatsSectionComponent, {
      inputs: { teamId: 7, seasonId: 42 },
      providers,
    });
    TestBed.tick();

    expect(mockTeamApiService.getPlayerSeasonStatsByTeamIdAndSeasonId).toHaveBeenCalledWith(7, 42);
  });
});
