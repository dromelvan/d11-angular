import { render } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MatchBase, Status } from '@app/core/api';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeMatchBase } from '@app/test';
import { MatchWeekMatchesComponent } from './match-week-matches.component';

const mockRouterService = { navigateToMatch: vi.fn() };

const mockMatchApiService = {
  getMatchesByMatchWeekId: vi.fn<(id: number) => Observable<MatchBase[]>>(),
  getActiveMatches: vi.fn<() => Observable<MatchBase[]>>(),
};

const providers = [
  { provide: MatchApiService, useValue: mockMatchApiService },
  { provide: RouterService, useValue: mockRouterService },
];

function formatDateHeader(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));
}

describe('MatchWeekMatchesComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of([]));
    mockMatchApiService.getActiveMatches.mockReturnValue(of([]));
  });

  it('creates the component', async () => {
    const { fixture } = await render(MatchWeekMatchesComponent, { providers });
    TestBed.tick();

    expect(fixture.componentInstance).toBeTruthy();
  });

  // Loading state --------------------------------------------------------------------------------

  describe('loading state', () => {
    it('shows spinner while loading', async () => {
      mockMatchApiService.getActiveMatches.mockReturnValue(NEVER);

      const { container } = await render(MatchWeekMatchesComponent, { providers });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
    });

    it('hides spinner when data loads', async () => {
      const { container } = await render(MatchWeekMatchesComponent, { providers });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).not.toBeInTheDocument();
    });
  });

  // API method selection -------------------------------------------------------------------------

  describe('API method selection', () => {
    it('calls getMatchesByMatchWeekId when matchWeekId is provided', async () => {
      await render(MatchWeekMatchesComponent, { inputs: { matchWeekId: 1 }, providers });
      TestBed.tick();

      expect(mockMatchApiService.getMatchesByMatchWeekId).toHaveBeenCalledWith(1);
      expect(mockMatchApiService.getActiveMatches).not.toHaveBeenCalled();
    });

    it('calls getActiveMatches when matchWeekId is not provided', async () => {
      await render(MatchWeekMatchesComponent, { providers });
      TestBed.tick();

      expect(mockMatchApiService.getActiveMatches).toHaveBeenCalled();
      expect(mockMatchApiService.getMatchesByMatchWeekId).not.toHaveBeenCalled();
    });

    it('reloads when matchWeekId input changes', async () => {
      const { fixture } = await render(MatchWeekMatchesComponent, {
        inputs: { matchWeekId: 1 },
        providers,
      });
      TestBed.tick();

      fixture.componentRef.setInput('matchWeekId', 2);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockMatchApiService.getMatchesByMatchWeekId).toHaveBeenCalledWith(2);
    });
  });

  // Date header ----------------------------------------------------------------------------------

  describe('date header', () => {
    it('renders formatted date header for a group', async () => {
      const date = '2025-03-15';
      mockMatchApiService.getActiveMatches.mockReturnValue(
        of([{ ...fakeMatchBase(), datetime: `${date}T15:00:00.000Z`, status: Status.FINISHED }]),
      );

      const { container } = await render(MatchWeekMatchesComponent, { providers });
      TestBed.tick();

      expect(container.textContent).toContain(formatDateHeader(date));
    });

    it('renders Postponed header when match is postponed', async () => {
      mockMatchApiService.getActiveMatches.mockReturnValue(
        of([{ ...fakeMatchBase(), status: Status.POSTPONED }]),
      );

      const { container } = await render(MatchWeekMatchesComponent, { providers });
      TestBed.tick();

      expect(container.textContent).toContain('Postponed');
    });

    it('renders headers for all groups', async () => {
      const date1 = '2025-03-15';
      const date2 = '2025-03-16';
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(
        of([
          { ...fakeMatchBase(), datetime: `${date1}T15:00:00.000Z`, status: Status.FINISHED },
          { ...fakeMatchBase(), datetime: `${date2}T15:00:00.000Z`, status: Status.FINISHED },
        ]),
      );

      const { container } = await render(MatchWeekMatchesComponent, {
        inputs: { matchWeekId: 1 },
        providers,
      });
      TestBed.tick();

      expect(container.textContent).toContain(formatDateHeader(date1));
      expect(container.textContent).toContain(formatDateHeader(date2));
    });
  });

  // Match rows -----------------------------------------------------------------------------------

  describe('match rows', () => {
    it('renders a match result col for each match in a group', async () => {
      mockMatchApiService.getActiveMatches.mockReturnValue(
        of([
          { ...fakeMatchBase(), datetime: '2025-03-15T15:00:00.000Z', status: Status.FINISHED },
          { ...fakeMatchBase(), datetime: '2025-03-15T17:00:00.000Z', status: Status.FINISHED },
        ]),
      );

      const { container } = await render(MatchWeekMatchesComponent, { providers });
      TestBed.tick();

      expect(container.querySelectorAll('app-match-result-col').length).toBe(2);
    });

    it('renders match result cols across multiple groups', async () => {
      mockMatchApiService.getActiveMatches.mockReturnValue(
        of([
          { ...fakeMatchBase(), datetime: '2025-03-15T15:00:00.000Z', status: Status.FINISHED },
          { ...fakeMatchBase(), datetime: '2025-03-15T17:00:00.000Z', status: Status.FINISHED },
          { ...fakeMatchBase(), datetime: '2025-03-16T15:00:00.000Z', status: Status.FINISHED },
        ]),
      );

      const { container } = await render(MatchWeekMatchesComponent, { providers });
      TestBed.tick();

      expect(container.querySelectorAll('app-match-result-col').length).toBe(3);
    });
  });

  // Separators -----------------------------------------------------------------------------------

  describe('separators', () => {
    it('renders a separator between each non-last match in a group', async () => {
      mockMatchApiService.getActiveMatches.mockReturnValue(
        of([
          { ...fakeMatchBase(), datetime: '2025-03-15T13:00:00.000Z', status: Status.FINISHED },
          { ...fakeMatchBase(), datetime: '2025-03-15T15:00:00.000Z', status: Status.FINISHED },
          { ...fakeMatchBase(), datetime: '2025-03-15T17:00:00.000Z', status: Status.FINISHED },
        ]),
      );

      const { container } = await render(MatchWeekMatchesComponent, { providers });
      TestBed.tick();

      expect(container.querySelectorAll('.app-separator').length).toBe(2);
    });

    it('does not render a separator after the last match in a group', async () => {
      mockMatchApiService.getActiveMatches.mockReturnValue(
        of([{ ...fakeMatchBase(), datetime: '2025-03-15T15:00:00.000Z', status: Status.FINISHED }]),
      );

      const { container } = await render(MatchWeekMatchesComponent, { providers });
      TestBed.tick();

      expect(container.querySelectorAll('.app-separator').length).toBe(0);
    });
  });

  // Date grouping --------------------------------------------------------------------------------

  describe('date grouping', () => {
    it('sorts matches by datetime within a group', async () => {
      const early = {
        ...fakeMatchBase(),
        datetime: '2025-03-15T12:00:00.000Z',
        status: Status.FINISHED,
        homeTeam: { ...fakeMatchBase().homeTeam, name: 'Team1' },
      };
      const late = {
        ...fakeMatchBase(),
        datetime: '2025-03-15T17:00:00.000Z',
        status: Status.FINISHED,
        homeTeam: { ...fakeMatchBase().homeTeam, name: 'Team2' },
      };
      mockMatchApiService.getActiveMatches.mockReturnValue(of([late, early]));

      const { container } = await render(MatchWeekMatchesComponent, { providers });
      TestBed.tick();

      const rows = container.querySelectorAll('app-match-result-col');
      expect(rows[0].textContent).toContain('Team1');
      expect(rows[1].textContent).toContain('Team2');
    });
  });

  // Postponed matches ----------------------------------------------------------------------------

  describe('postponed matches', () => {
    it('sorts postponed matches after non-postponed matches', async () => {
      const finished = {
        ...fakeMatchBase(),
        datetime: '2025-03-15T15:00:00.000Z',
        status: Status.FINISHED,
      };
      const postponed = {
        ...fakeMatchBase(),
        datetime: '2025-03-14T15:00:00.000Z',
        status: Status.POSTPONED,
      };
      mockMatchApiService.getActiveMatches.mockReturnValue(of([postponed, finished]));

      const { container } = await render(MatchWeekMatchesComponent, { providers });
      TestBed.tick();

      const text = container.textContent as string;
      expect(text.indexOf('Saturday')).toBeLessThan(text.indexOf('Postponed'));
    });
  });
});
