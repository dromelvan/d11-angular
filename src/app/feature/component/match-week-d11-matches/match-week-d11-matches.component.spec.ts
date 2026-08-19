import { render } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { D11MatchBase, Status } from '@app/core/api';
import { D11MatchApiService } from '@app/core/api/d11-match/d11-match-api.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeD11MatchBase } from '@app/test';
import { MatchWeekD11MatchesComponent } from './match-week-d11-matches.component';

const mockRouterService = { navigateToD11Match: vi.fn() };

const mockD11MatchApiService = {
  getD11MatchesByMatchWeekId: vi.fn<(id: number) => Observable<D11MatchBase[]>>(),
  getActiveD11Matches: vi.fn<() => Observable<D11MatchBase[]>>(),
};

const providers = [
  { provide: D11MatchApiService, useValue: mockD11MatchApiService },
  { provide: RouterService, useValue: mockRouterService },
];

function formatDateHeader(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));
}

describe('MatchWeekD11MatchesComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockD11MatchApiService.getD11MatchesByMatchWeekId.mockReturnValue(of([]));
    mockD11MatchApiService.getActiveD11Matches.mockReturnValue(of([]));
  });

  it('creates the component', async () => {
    const { fixture } = await render(MatchWeekD11MatchesComponent, { providers });
    TestBed.tick();

    expect(fixture.componentInstance).toBeTruthy();
  });

  // Loading state --------------------------------------------------------------------------------

  describe('loading state', () => {
    it('shows spinner while loading', async () => {
      mockD11MatchApiService.getActiveD11Matches.mockReturnValue(NEVER);

      const { container } = await render(MatchWeekD11MatchesComponent, { providers });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
    });

    it('hides spinner when data loads', async () => {
      const { container } = await render(MatchWeekD11MatchesComponent, { providers });
      TestBed.tick();

      expect(container.querySelector('p-progress-spinner')).not.toBeInTheDocument();
    });
  });

  // API method selection -------------------------------------------------------------------------

  describe('API method selection', () => {
    it('calls getD11MatchesByMatchWeekId when matchWeekId is provided', async () => {
      await render(MatchWeekD11MatchesComponent, { inputs: { matchWeekId: 1 }, providers });
      TestBed.tick();

      expect(mockD11MatchApiService.getD11MatchesByMatchWeekId).toHaveBeenCalledWith(1);
      expect(mockD11MatchApiService.getActiveD11Matches).not.toHaveBeenCalled();
    });

    it('calls getActiveD11Matches when matchWeekId is not provided', async () => {
      await render(MatchWeekD11MatchesComponent, { providers });
      TestBed.tick();

      expect(mockD11MatchApiService.getActiveD11Matches).toHaveBeenCalled();
      expect(mockD11MatchApiService.getD11MatchesByMatchWeekId).not.toHaveBeenCalled();
    });

    it('reloads when matchWeekId input changes', async () => {
      const { fixture } = await render(MatchWeekD11MatchesComponent, {
        inputs: { matchWeekId: 1 },
        providers,
      });
      TestBed.tick();

      fixture.componentRef.setInput('matchWeekId', 2);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockD11MatchApiService.getD11MatchesByMatchWeekId).toHaveBeenCalledWith(2);
    });
  });

  // Date header ----------------------------------------------------------------------------------

  describe('date header', () => {
    it('renders formatted date header for a group', async () => {
      const date = '2025-03-15';
      mockD11MatchApiService.getActiveD11Matches.mockReturnValue(
        of([{ ...fakeD11MatchBase(), datetime: `${date}T15:00:00.000Z`, status: Status.FINISHED }]),
      );

      const { container } = await render(MatchWeekD11MatchesComponent, { providers });
      TestBed.tick();

      expect(container.textContent).toContain(formatDateHeader(date));
    });

    it('renders Postponed header when match is postponed', async () => {
      mockD11MatchApiService.getActiveD11Matches.mockReturnValue(
        of([{ ...fakeD11MatchBase(), status: Status.POSTPONED }]),
      );

      const { container } = await render(MatchWeekD11MatchesComponent, { providers });
      TestBed.tick();

      expect(container.textContent).toContain('Postponed');
    });

    it('renders headers for all groups', async () => {
      const date1 = '2025-03-15';
      const date2 = '2025-03-16';
      mockD11MatchApiService.getD11MatchesByMatchWeekId.mockReturnValue(
        of([
          { ...fakeD11MatchBase(), datetime: `${date1}T15:00:00.000Z`, status: Status.FINISHED },
          { ...fakeD11MatchBase(), datetime: `${date2}T15:00:00.000Z`, status: Status.FINISHED },
        ]),
      );

      const { container } = await render(MatchWeekD11MatchesComponent, {
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
      mockD11MatchApiService.getActiveD11Matches.mockReturnValue(
        of([
          { ...fakeD11MatchBase(), datetime: '2025-03-15T15:00:00.000Z', status: Status.FINISHED },
          { ...fakeD11MatchBase(), datetime: '2025-03-15T17:00:00.000Z', status: Status.FINISHED },
        ]),
      );

      const { container } = await render(MatchWeekD11MatchesComponent, { providers });
      TestBed.tick();

      expect(container.querySelectorAll('app-d11-match-result-col').length).toBe(2);
    });

    it('renders match result cols across multiple groups', async () => {
      mockD11MatchApiService.getActiveD11Matches.mockReturnValue(
        of([
          { ...fakeD11MatchBase(), datetime: '2025-03-15T15:00:00.000Z', status: Status.FINISHED },
          { ...fakeD11MatchBase(), datetime: '2025-03-15T17:00:00.000Z', status: Status.FINISHED },
          { ...fakeD11MatchBase(), datetime: '2025-03-16T15:00:00.000Z', status: Status.FINISHED },
        ]),
      );

      const { container } = await render(MatchWeekD11MatchesComponent, { providers });
      TestBed.tick();

      expect(container.querySelectorAll('app-d11-match-result-col').length).toBe(3);
    });
  });

  // Separators -----------------------------------------------------------------------------------

  describe('separators', () => {
    it('renders a separator between each non-last match in a group', async () => {
      mockD11MatchApiService.getActiveD11Matches.mockReturnValue(
        of([
          { ...fakeD11MatchBase(), datetime: '2025-03-15T13:00:00.000Z', status: Status.FINISHED },
          { ...fakeD11MatchBase(), datetime: '2025-03-15T15:00:00.000Z', status: Status.FINISHED },
          { ...fakeD11MatchBase(), datetime: '2025-03-15T17:00:00.000Z', status: Status.FINISHED },
        ]),
      );

      const { container } = await render(MatchWeekD11MatchesComponent, { providers });
      TestBed.tick();

      expect(container.querySelectorAll('.app-separator').length).toBe(2);
    });

    it('does not render a separator after the last match in a group', async () => {
      mockD11MatchApiService.getActiveD11Matches.mockReturnValue(
        of([
          { ...fakeD11MatchBase(), datetime: '2025-03-15T15:00:00.000Z', status: Status.FINISHED },
        ]),
      );

      const { container } = await render(MatchWeekD11MatchesComponent, { providers });
      TestBed.tick();

      expect(container.querySelectorAll('.app-separator').length).toBe(0);
    });
  });

  // Date grouping --------------------------------------------------------------------------------

  describe('date grouping', () => {
    it('sorts matches by datetime within a group', async () => {
      const early = {
        ...fakeD11MatchBase(),
        datetime: '2025-03-15T12:00:00.000Z',
        status: Status.FINISHED,
        homeD11Team: { ...fakeD11MatchBase().homeD11Team, name: 'Team1' },
      };
      const late = {
        ...fakeD11MatchBase(),
        datetime: '2025-03-15T17:00:00.000Z',
        status: Status.FINISHED,
        homeD11Team: { ...fakeD11MatchBase().homeD11Team, name: 'Team2' },
      };
      mockD11MatchApiService.getActiveD11Matches.mockReturnValue(of([late, early]));

      const { container } = await render(MatchWeekD11MatchesComponent, { providers });
      TestBed.tick();

      const rows = container.querySelectorAll('app-d11-match-result-col');
      expect(rows[0].textContent).toContain('Team1');
      expect(rows[1].textContent).toContain('Team2');
    });
  });

  // Postponed matches ----------------------------------------------------------------------------

  describe('postponed matches', () => {
    it('sorts postponed matches after non-postponed matches', async () => {
      const finished = {
        ...fakeD11MatchBase(),
        datetime: '2025-03-15T15:00:00.000Z',
        status: Status.FINISHED,
      };
      const postponed = {
        ...fakeD11MatchBase(),
        datetime: '2025-03-14T15:00:00.000Z',
        status: Status.POSTPONED,
      };
      mockD11MatchApiService.getActiveD11Matches.mockReturnValue(of([postponed, finished]));

      const { container } = await render(MatchWeekD11MatchesComponent, { providers });
      TestBed.tick();

      const text = container.textContent as string;
      expect(text.indexOf('Saturday')).toBeLessThan(text.indexOf('Postponed'));
    });
  });
});
