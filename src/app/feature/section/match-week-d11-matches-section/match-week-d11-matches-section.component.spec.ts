import { ComponentFixture, TestBed } from '@angular/core/testing';
import { D11MatchBase, Status } from '@app/core/api';
import { D11MatchApiService } from '@app/core/api/d11-match/d11-match-api.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeD11MatchBase } from '@app/test';
import { of } from 'rxjs';
import { beforeEach, describe, expect, vi } from 'vitest';
import { MatchWeekD11MatchesSectionComponent } from './match-week-d11-matches-section.component';

const mockRouterService = { navigateToD11Match: vi.fn() };

describe('MatchWeekD11MatchesSectionComponent', () => {
  let fixture: ComponentFixture<MatchWeekD11MatchesSectionComponent>;
  let mockD11MatchApiService: {
    getD11MatchesByMatchWeekId: ReturnType<typeof vi.fn>;
    getActiveD11Matches: ReturnType<typeof vi.fn>;
  };

  async function setup(matchWeekId?: number) {
    fixture = TestBed.createComponent(MatchWeekD11MatchesSectionComponent);
    if (matchWeekId !== undefined) {
      fixture.componentRef.setInput('matchWeekId', matchWeekId);
    }
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    mockD11MatchApiService = {
      getD11MatchesByMatchWeekId: vi.fn().mockReturnValue(of([])),
      getActiveD11Matches: vi.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [MatchWeekD11MatchesSectionComponent],
      providers: [
        { provide: D11MatchApiService, useValue: mockD11MatchApiService },
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
    it('calls getD11MatchesByMatchWeekId when matchWeekId is provided', async () => {
      await setup(1);

      expect(mockD11MatchApiService.getD11MatchesByMatchWeekId).toHaveBeenCalledWith(1);
      expect(mockD11MatchApiService.getActiveD11Matches).not.toHaveBeenCalled();
    });

    it('calls getActiveD11Matches when matchWeekId is not provided', async () => {
      await setup();

      expect(mockD11MatchApiService.getActiveD11Matches).toHaveBeenCalled();
      expect(mockD11MatchApiService.getD11MatchesByMatchWeekId).not.toHaveBeenCalled();
    });

    it('reloads when matchWeekId input changes', async () => {
      await setup(1);
      fixture.componentRef.setInput('matchWeekId', 2);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockD11MatchApiService.getD11MatchesByMatchWeekId).toHaveBeenCalledWith(2);
    });
  });

  // Section rendering ----------------------------------------------------------------------------

  describe('section rendering', () => {
    it('renders D11 Matches section header when there are matches', async () => {
      mockD11MatchApiService.getD11MatchesByMatchWeekId.mockReturnValue(of([fakeD11MatchBase()]));
      await setup(1);

      expect(fixture.nativeElement.textContent).toContain('D11 Matches');
    });

    it('does not render section when there are no matches', async () => {
      await setup(1);

      expect(fixture.nativeElement.querySelector('app-section')).toBeNull();
    });
  });

  // Date grouping --------------------------------------------------------------------------------

  describe('date grouping', () => {
    it('groups matches by date and renders a date header per group', async () => {
      const matches: D11MatchBase[] = [
        { ...fakeD11MatchBase(), datetime: '2025-03-15T15:00:00.000Z', status: Status.FINISHED },
        { ...fakeD11MatchBase(), datetime: '2025-03-16T15:00:00.000Z', status: Status.FINISHED },
      ];
      mockD11MatchApiService.getD11MatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);

      const groups = fixture.nativeElement.querySelectorAll('app-match-week-d11-matches');
      expect(groups.length).toBe(1);
      expect(fixture.nativeElement.textContent).toContain('Saturday');
      expect(fixture.nativeElement.textContent).toContain('Sunday');
    });

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
      mockD11MatchApiService.getD11MatchesByMatchWeekId.mockReturnValue(of([late, early]));
      await setup(1);

      const rows = fixture.nativeElement.querySelectorAll('app-d11-match-result-col');
      expect(rows[0].textContent).toContain('Team1');
      expect(rows[1].textContent).toContain('Team2');
    });
  });

  // Postponed matches ----------------------------------------------------------------------------

  describe('postponed matches', () => {
    it('renders Postponed group header for postponed matches', async () => {
      mockD11MatchApiService.getD11MatchesByMatchWeekId.mockReturnValue(
        of([{ ...fakeD11MatchBase(), status: Status.POSTPONED }]),
      );
      await setup(1);

      expect(fixture.nativeElement.textContent).toContain('Postponed');
    });

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
      mockD11MatchApiService.getD11MatchesByMatchWeekId.mockReturnValue(of([postponed, finished]));
      await setup(1);

      const text = fixture.nativeElement.textContent as string;
      expect(text.indexOf('Saturday')).toBeLessThan(text.indexOf('Postponed'));
    });
  });
});
