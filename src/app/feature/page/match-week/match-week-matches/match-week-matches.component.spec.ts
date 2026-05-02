import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchBase, Status } from '@app/core/api';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeMatch, fakeMatchBase } from '@app/test';
import { of } from 'rxjs';
import { beforeEach, describe, expect, vi } from 'vitest';
import { MatchWeekMatchesComponent } from './match-week-matches.component';

const mockRouterService = { navigateToMatch: vi.fn() };
const mockMatchApiService = { getMatchesByMatchWeekId: vi.fn(), getActiveMatches: vi.fn() };

describe('MatchWeekMatchesComponent', () => {
  let fixture: ComponentFixture<MatchWeekMatchesComponent>;
  let matches: MatchBase[];

  async function setup(matchWeekId?: number) {
    fixture = TestBed.createComponent(MatchWeekMatchesComponent);
    if (matchWeekId !== undefined) {
      fixture.componentRef.setInput('matchWeekId', matchWeekId);
    }
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    const [m1, m2] = [fakeMatch(), fakeMatch()];
    matches = [
      {
        ...m1,
        homeTeam: { ...m1.homeTeam, code: 'AAA' },
        awayTeam: { ...m1.awayTeam, code: 'BBB' },
      },
      {
        ...m2,
        homeTeam: { ...m2.homeTeam, code: 'CCC' },
        awayTeam: { ...m2.awayTeam, code: 'DDD' },
      },
    ];
    mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
    mockMatchApiService.getActiveMatches.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [MatchWeekMatchesComponent],
      providers: [
        { provide: RouterService, useValue: mockRouterService },
        { provide: MatchApiService, useValue: mockMatchApiService },
      ],
    }).compileComponents();

    await setup(1);
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('calls getMatchesByMatchWeekId with the provided matchWeekId', () => {
    expect(mockMatchApiService.getMatchesByMatchWeekId).toHaveBeenCalledWith(1);
    expect(mockMatchApiService.getActiveMatches).not.toHaveBeenCalled();
  });

  it('renders home team code for each match', () => {
    for (const match of matches) {
      expect(fixture.nativeElement.textContent).toContain(match.homeTeam.code);
    }
  });

  it('renders away team code for each match', () => {
    for (const match of matches) {
      expect(fixture.nativeElement.textContent).toContain(match.awayTeam.code);
    }
  });

  it('navigates to match on row click', () => {
    const rows = Array.from<HTMLElement>(
      fixture.nativeElement.querySelectorAll('.col-span-3.grid'),
    );
    const row = rows.find((element) => element.textContent?.includes(matches[0].homeTeam.code))!;
    row.click();
    expect(mockRouterService.navigateToMatch).toHaveBeenCalledExactlyOnceWith(matches[0].id);
  });

  // Kickoff time ---------------------------------------------------------------------------------

  describe('kickoff time', () => {
    beforeEach(async () => {
      matches = [{ ...fakeMatchBase(), status: Status.PENDING }];
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);
    });

    it('renders in HH:mm format', () => {
      const formatted = new DatePipe('en-US').transform(matches[0].datetime, 'HH:mm');
      expect(fixture.nativeElement.textContent).toContain(formatted!);
    });
  });

  // Elapsed time ---------------------------------------------------------------------------------

  describe('elapsed time', () => {
    it('renders for active match', async () => {
      matches = [{ ...fakeMatchBase(), status: Status.ACTIVE, elapsed: '45' }];
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);

      expect(fixture.nativeElement.textContent).toContain(matches[0].elapsed);
    });

    it('renders for full time match', async () => {
      matches = [{ ...fakeMatchBase(), status: Status.FULL_TIME, elapsed: 'FT' }];
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);

      expect(fixture.nativeElement.textContent).toContain(matches[0].elapsed);
    });

    it('renders for finished match', async () => {
      matches = [{ ...fakeMatchBase(), status: Status.FINISHED, elapsed: 'FT' }];
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);

      expect(fixture.nativeElement.textContent).toContain(matches[0].elapsed);
    });

    it('does not render for pending match', async () => {
      matches = [{ ...fakeMatchBase(), status: Status.PENDING, elapsed: 'N/A' }];
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);

      expect(fixture.nativeElement.textContent).not.toContain(matches[0].elapsed);
    });
  });

  // Date grouping --------------------------------------------------------------------------------

  describe('date grouping', () => {
    const date1 = '2025-03-15';
    const date2 = '2025-03-16';
    const datePipe = new DatePipe('en-US');

    it('renders date headers in order', async () => {
      matches = [
        { ...fakeMatchBase(), status: Status.FINISHED, datetime: `${date1}T15:00:00.000Z` },
        { ...fakeMatchBase(), status: Status.FINISHED, datetime: `${date2}T15:00:00.000Z` },
      ];
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);

      const formatted1 = datePipe.transform(date1, 'EEEE, MMMM d')!;
      const formatted2 = datePipe.transform(date2, 'EEEE, MMMM d')!;
      const headers = Array.from(
        fixture.nativeElement.querySelectorAll('.app-grid-header, .app-grid-sub-header'),
      ).map((element) => (element as HTMLElement).textContent?.trim());

      expect(headers).toContain(formatted1);
      expect(headers).toContain(formatted2);
      expect(headers.indexOf(formatted1)).toBeLessThan(headers.indexOf(formatted2));
    });

    it('sorts matches by datetime within a group', async () => {
      const early = {
        ...fakeMatchBase(),
        status: Status.FINISHED,
        datetime: `${date1}T12:00:00.000Z`,
      };
      const late = {
        ...fakeMatchBase(),
        status: Status.FINISHED,
        datetime: `${date1}T17:00:00.000Z`,
      };
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of([late, early]));
      await setup(1);

      const rows = fixture.nativeElement.querySelectorAll('.col-span-3.grid');
      expect(rows[0].textContent).toContain(early.homeTeam.code);
      expect(rows[1].textContent).toContain(late.homeTeam.code);
    });
  });

  // Postponed ------------------------------------------------------------------------------------

  describe('postponed matches', () => {
    beforeEach(async () => {
      matches = [
        { ...fakeMatchBase(), status: Status.FINISHED, datetime: '2025-03-15T15:00:00.000Z' },
        { ...fakeMatchBase(), status: Status.POSTPONED, datetime: '2025-03-15T15:00:00.000Z' },
      ];
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);
    });

    it('renders postponed group header', () => {
      expect(fixture.nativeElement.textContent).toContain('Postponed');
    });

    it('renders only one postponed header', () => {
      const headers = Array.from(
        fixture.nativeElement.querySelectorAll('.app-grid-header, .app-grid-sub-header'),
      ).map((element) => (element as HTMLElement).textContent?.trim());
      expect(headers.filter((text) => text === 'Postponed')).toHaveLength(1);
    });

    it('sorts postponed last', () => {
      const headers = fixture.nativeElement.querySelectorAll(
        '.app-grid-header, .app-grid-sub-header',
      );
      expect(headers[headers.length - 1].textContent?.trim()).toBe('Postponed');
    });
  });

  // Without matchWeekId (active mode) -----------------------------------------------------------

  describe('without matchWeekId', () => {
    beforeEach(async () => {
      vi.clearAllMocks();
      mockMatchApiService.getActiveMatches.mockReturnValue(of(matches));
      await setup();
    });

    it('calls getActiveMatches', () => {
      expect(mockMatchApiService.getActiveMatches).toHaveBeenCalled();
      expect(mockMatchApiService.getMatchesByMatchWeekId).not.toHaveBeenCalled();
    });

    it('renders matches from getActiveMatches', () => {
      expect(fixture.nativeElement.textContent).toContain(matches[0].homeTeam.code);
    });
  });
});
