import { render } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { D11MatchApiService } from '@app/core/api/d11-match/d11-match-api.service';
import { RouterService } from '@app/core/router/router.service';
import { MatchWeekD11MatchesSectionComponent } from './match-week-d11-matches-section.component';

const mockRouterService = { navigateToD11Match: vi.fn() };

const mockD11MatchApiService = {
  getD11MatchesByMatchWeekId: vi.fn().mockReturnValue(of([])),
  getActiveD11Matches: vi.fn().mockReturnValue(of([])),
};

const providers = [
  { provide: D11MatchApiService, useValue: mockD11MatchApiService },
  { provide: RouterService, useValue: mockRouterService },
];

describe('MatchWeekD11MatchesSectionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockD11MatchApiService.getD11MatchesByMatchWeekId.mockReturnValue(of([]));
    mockD11MatchApiService.getActiveD11Matches.mockReturnValue(of([]));
  });

  it('creates the component', async () => {
    const { fixture } = await render(MatchWeekD11MatchesSectionComponent, { providers });
    TestBed.tick();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the D11 Matches section header', async () => {
    const { container } = await render(MatchWeekD11MatchesSectionComponent, { providers });
    TestBed.tick();

    expect(container.textContent).toContain('D11 Matches');
  });

  it('passes matchWeekId to child when provided', async () => {
    await render(MatchWeekD11MatchesSectionComponent, { inputs: { matchWeekId: 1 }, providers });
    TestBed.tick();

    expect(mockD11MatchApiService.getD11MatchesByMatchWeekId).toHaveBeenCalledWith(1);
  });

  it('passes undefined matchWeekId to child when not provided', async () => {
    await render(MatchWeekD11MatchesSectionComponent, { providers });
    TestBed.tick();

    expect(mockD11MatchApiService.getActiveD11Matches).toHaveBeenCalled();
  });
});
