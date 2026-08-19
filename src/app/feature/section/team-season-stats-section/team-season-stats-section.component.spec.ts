import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { Observable, of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TeamSeasonStat } from '@app/core/api';
import { TeamSeasonStatApiService } from '@app/core/api/team-season-stat/team-season-stat-api.service';
import { fakeTeamSeasonStat } from '@app/test';
import { TeamSeasonStatsSectionComponent } from './team-season-stats-section.component';

const mockTeamSeasonStatApi = {
  getTeamSeasonStatsBySeasonId: vi.fn<(id: number) => Observable<TeamSeasonStat[]>>(),
};

const providers = [{ provide: TeamSeasonStatApiService, useValue: mockTeamSeasonStatApi }];

describe('TeamSeasonStatsSectionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of([]));
  });

  it('renders "Premier League Table" in the section header', async () => {
    await render(TeamSeasonStatsSectionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByTestId('section-header')).toHaveTextContent('Premier League Table');
  });

  it('renders team name from stats', async () => {
    const stat = fakeTeamSeasonStat();
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of([stat]));

    await render(TeamSeasonStatsSectionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText(stat.team.name)).toBeInTheDocument();
  });
});
