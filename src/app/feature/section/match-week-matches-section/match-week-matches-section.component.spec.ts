import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchBase, Status } from '@app/core/api';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeMatchBase } from '@app/test';
import { of } from 'rxjs';
import { beforeEach, describe, expect, vi } from 'vitest';
import { MatchWeekMatchesSectionComponent } from './match-week-matches-section.component';

const mockRouterService = { navigateToMatch: vi.fn() };

describe('MatchWeekMatchesSectionComponent', () => {
  let fixture: ComponentFixture<MatchWeekMatchesSectionComponent>;
  let mockMatchApiService: {
    getMatchesByMatchWeekId: ReturnType<typeof vi.fn>;
    getActiveMatches: ReturnType<typeof vi.fn>;
  };

  async function setup(matchWeekId?: number) {
    fixture = TestBed.createComponent(MatchWeekMatchesSectionComponent);
    if (matchWeekId !== undefined) {
      fixture.componentRef.setInput('matchWeekId', matchWeekId);
    }
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    mockMatchApiService = {
      getMatchesByMatchWeekId: vi.fn().mockReturnValue(of([])),
      getActiveMatches: vi.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [MatchWeekMatchesSectionComponent],
      providers: [
        { provide: MatchApiService, useValue: mockMatchApiService },
        { provide: RouterService, useValue: mockRouterService },
      ],
    }).compileComponents();
  });

  it('creates the component', async () => {
    await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  // API method selection -------------------------------------------------------------------------

  describe('API method selection', () => {
    it('calls getMatchesByMatchWeekId when matchWeekId is provided', async () => {
      await setup(1);

      expect(mockMatchApiService.getMatchesByMatchWeekId).toHaveBeenCalledWith(1);
      expect(mockMatchApiService.getActiveMatches).not.toHaveBeenCalled();
    });

    it('calls getActiveMatches when matchWeekId is not provided', async () => {
      await setup();

      expect(mockMatchApiService.getActiveMatches).toHaveBeenCalled();
      expect(mockMatchApiService.getMatchesByMatchWeekId).not.toHaveBeenCalled();
    });

    it('reloads when matchWeekId input changes', async () => {
      await setup(1);
      fixture.componentRef.setInput('matchWeekId', 2);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockMatchApiService.getMatchesByMatchWeekId).toHaveBeenCalledWith(2);
    });
  });

  // Section rendering ----------------------------------------------------------------------------

  describe('section rendering', () => {
    it('renders Premier League Matches section header when there are matches', async () => {
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of([fakeMatchBase()]));
      await setup(1);

      expect(fixture.nativeElement.textContent).toContain('Premier League Matches');
    });

    it('does not render section when there are no matches', async () => {
      await setup(1);

      expect(fixture.nativeElement.querySelector('app-section')).toBeNull();
    });
  });

  // Date grouping --------------------------------------------------------------------------------

  describe('date grouping', () => {
    it('groups matches by date and renders a date header per group', async () => {
      const matches: MatchBase[] = [
        { ...fakeMatchBase(), datetime: '2025-03-15T15:00:00.000Z', status: Status.FINISHED },
        { ...fakeMatchBase(), datetime: '2025-03-16T15:00:00.000Z', status: Status.FINISHED },
      ];
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);

      expect(fixture.nativeElement.querySelectorAll('app-match-week-matches').length).toBe(1);
      expect(fixture.nativeElement.textContent).toContain('Saturday');
      expect(fixture.nativeElement.textContent).toContain('Sunday');
    });

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
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of([late, early]));
      await setup(1);

      const rows = fixture.nativeElement.querySelectorAll('app-match-result-col');
      expect(rows[0].textContent).toContain('Team1');
      expect(rows[1].textContent).toContain('Team2');
    });
  });

  // Postponed matches ----------------------------------------------------------------------------

  describe('postponed matches', () => {
    it('renders Postponed group header for postponed matches', async () => {
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(
        of([{ ...fakeMatchBase(), status: Status.POSTPONED }]),
      );
      await setup(1);

      expect(fixture.nativeElement.textContent).toContain('Postponed');
    });

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
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of([postponed, finished]));
      await setup(1);

      const text = fixture.nativeElement.textContent as string;
      expect(text.indexOf('Saturday')).toBeLessThan(text.indexOf('Postponed'));
    });
  });
});
