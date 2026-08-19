import { render } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { RouterService } from '@app/core/router/router.service';
import { MatchWeekMatchesSectionComponent } from './match-week-matches-section.component';

const mockRouterService = { navigateToMatch: vi.fn() };

const mockMatchApiService = {
  getMatchesByMatchWeekId: vi.fn().mockReturnValue(of([])),
  getActiveMatches: vi.fn().mockReturnValue(of([])),
};

const providers = [
  { provide: MatchApiService, useValue: mockMatchApiService },
  { provide: RouterService, useValue: mockRouterService },
];

describe('MatchWeekMatchesSectionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of([]));
    mockMatchApiService.getActiveMatches.mockReturnValue(of([]));
  });

  it('creates the component', async () => {
    const { fixture } = await render(MatchWeekMatchesSectionComponent, { providers });
    TestBed.tick();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the Premier League Matches section header', async () => {
    const { container } = await render(MatchWeekMatchesSectionComponent, { providers });
    TestBed.tick();

    expect(container.textContent).toContain('Premier League Matches');
  });

  it('passes matchWeekId to child when provided', async () => {
    await render(MatchWeekMatchesSectionComponent, { inputs: { matchWeekId: 1 }, providers });
    TestBed.tick();

    expect(mockMatchApiService.getMatchesByMatchWeekId).toHaveBeenCalledWith(1);
  });

  it('passes undefined matchWeekId to child when not provided', async () => {
    await render(MatchWeekMatchesSectionComponent, { providers });
    TestBed.tick();

    expect(mockMatchApiService.getActiveMatches).toHaveBeenCalled();
  });
});
