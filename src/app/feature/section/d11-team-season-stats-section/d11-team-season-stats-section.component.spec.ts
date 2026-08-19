import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { Observable, of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { D11TeamSeasonStat } from '@app/core/api';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { fakeD11TeamSeasonStat } from '@app/test';
import { D11TeamSeasonStatsSectionComponent } from './d11-team-season-stats-section.component';

const mockD11TeamSeasonStatApi = {
  getD11TeamSeasonStatsBySeasonId: vi.fn<(id: number) => Observable<D11TeamSeasonStat[]>>(),
};

const providers = [{ provide: D11TeamSeasonStatApiService, useValue: mockD11TeamSeasonStatApi }];

describe('D11TeamSeasonStatsSectionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of([]));
  });

  it('renders "D11 Table" in the section header', async () => {
    await render(D11TeamSeasonStatsSectionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByTestId('section-header')).toHaveTextContent('D11 Table');
  });

  it('renders d11 team name from stats', async () => {
    const stat = fakeD11TeamSeasonStat();
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of([stat]));

    await render(D11TeamSeasonStatsSectionComponent, { inputs: { seasonId: 1 }, providers });
    TestBed.tick();

    expect(screen.getByText(stat.d11Team.name)).toBeInTheDocument();
  });
});
