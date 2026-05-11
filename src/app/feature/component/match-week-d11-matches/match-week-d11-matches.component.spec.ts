import { ComponentFixture, TestBed } from '@angular/core/testing';
import { D11MatchBase, Status } from '@app/core/api';
import { D11MatchApiService } from '@app/core/api/d11-match/d11-match-api.service';
import { fakeD11Match, fakeD11MatchBase } from '@app/test';
import { of } from 'rxjs';
import { beforeEach, describe, expect, vi } from 'vitest';
import { MatchWeekD11MatchesComponent } from './match-week-d11-matches.component';

const mockD11MatchApiService = {
  getD11MatchesByMatchWeekId: vi.fn(),
  getActiveD11Matches: vi.fn(),
};

function formatDateHeader(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));
}

describe('MatchWeekD11MatchesComponent', () => {
  let fixture: ComponentFixture<MatchWeekD11MatchesComponent>;
  let matches: D11MatchBase[];

  async function setup(matchWeekId?: number) {
    fixture = TestBed.createComponent(MatchWeekD11MatchesComponent);
    if (matchWeekId !== undefined) {
      fixture.componentRef.setInput('matchWeekId', matchWeekId);
    }
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    const [m1, m2] = [fakeD11Match(), fakeD11Match()];
    matches = [
      {
        ...m1,
        homeD11Team: { ...m1.homeD11Team, name: 'Team1' },
        awayD11Team: { ...m1.awayD11Team, name: 'Team2' },
      },
      {
        ...m2,
        homeD11Team: { ...m2.homeD11Team, name: 'Team3' },
        awayD11Team: { ...m2.awayD11Team, name: 'Team4' },
      },
    ];
    mockD11MatchApiService.getD11MatchesByMatchWeekId.mockReturnValue(of(matches));
    mockD11MatchApiService.getActiveD11Matches.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [MatchWeekD11MatchesComponent],
      providers: [{ provide: D11MatchApiService, useValue: mockD11MatchApiService }],
    }).compileComponents();

    await setup(1);
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('calls getD11MatchesByMatchWeekId with the provided matchWeekId', () => {
    expect(mockD11MatchApiService.getD11MatchesByMatchWeekId).toHaveBeenCalledWith(1);
    expect(mockD11MatchApiService.getActiveD11Matches).not.toHaveBeenCalled();
  });

  it('renders D11 heading', () => {
    expect(fixture.nativeElement.textContent).toContain('D11');
  });

  it('renders home team name for each match', () => {
    for (const match of matches) {
      expect(fixture.nativeElement.textContent).toContain(match.homeD11Team.name);
    }
  });

  it('renders away team name for each match', () => {
    for (const match of matches) {
      expect(fixture.nativeElement.textContent).toContain(match.awayD11Team.name);
    }
  });

  // Empty state ----------------------------------------------------------------------------------

  describe('empty state', () => {
    it('renders nothing when there are no matches', async () => {
      mockD11MatchApiService.getD11MatchesByMatchWeekId.mockReturnValue(of([]));
      await setup(1);

      expect(fixture.nativeElement.textContent.trim()).toBe('');
    });
  });

  // Date grouping --------------------------------------------------------------------------------

  describe('date grouping', () => {
    const date1 = '2025-03-15';
    const date2 = '2025-03-16';

    it('renders date headers in order', async () => {
      matches = [
        { ...fakeD11MatchBase(), status: Status.FINISHED, datetime: `${date1}T15:00:00.000Z` },
        { ...fakeD11MatchBase(), status: Status.FINISHED, datetime: `${date2}T15:00:00.000Z` },
      ];
      mockD11MatchApiService.getD11MatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);

      const formatted1 = formatDateHeader(date1);
      const formatted2 = formatDateHeader(date2);
      const headers = Array.from(
        fixture.nativeElement.querySelectorAll('.app-grid-header, .app-grid-sub-header'),
      ).map((element) => (element as HTMLElement).textContent?.trim());

      expect(headers).toContain(formatted2);
      expect(headers).toContain(formatted1);
      expect(headers.indexOf(formatted1)).toBeLessThan(headers.indexOf(formatted2));
    });

    it('sorts matches by datetime within a group', async () => {
      const earlyBase = fakeD11MatchBase();
      const lateBase = fakeD11MatchBase();
      const early = {
        ...earlyBase,
        status: Status.FINISHED,
        datetime: `${date1}T12:00:00.000Z`,
        homeD11Team: { ...earlyBase.homeD11Team, name: 'Team1' },
      };
      const late = {
        ...lateBase,
        status: Status.FINISHED,
        datetime: `${date1}T17:00:00.000Z`,
        homeD11Team: { ...lateBase.homeD11Team, name: 'Team2' },
      };
      mockD11MatchApiService.getD11MatchesByMatchWeekId.mockReturnValue(of([late, early]));
      await setup(1);

      const rows = fixture.nativeElement.querySelectorAll('.col-span-5.grid');
      expect(rows[0].textContent).toContain(early.homeD11Team.name);
      expect(rows[1].textContent).toContain(late.homeD11Team.name);
    });
  });

  // Postponed ------------------------------------------------------------------------------------

  describe('postponed matches', () => {
    beforeEach(async () => {
      matches = [
        { ...fakeD11MatchBase(), status: Status.FINISHED, datetime: '2025-03-15T15:00:00.000Z' },
        { ...fakeD11MatchBase(), status: Status.POSTPONED, datetime: '2025-03-15T15:00:00.000Z' },
      ];
      mockD11MatchApiService.getD11MatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);
    });

    it('renders postponed group header', () => {
      expect(fixture.nativeElement.textContent).toContain('Postponed');
    });

    it('sorts postponed last', () => {
      const headers = fixture.nativeElement.querySelectorAll(
        '.app-grid-header, .app-grid-sub-header',
      );
      expect(headers[headers.length - 1].textContent?.trim()).toBe('Postponed');
    });

    it('renders only one postponed header', () => {
      const headers = Array.from(
        fixture.nativeElement.querySelectorAll('.app-grid-header, .app-grid-sub-header'),
      ).map((element) => (element as HTMLElement).textContent?.trim());
      expect(headers.filter((text) => text === 'Postponed')).toHaveLength(1);
    });
  });

  // Without matchWeekId (active mode) -----------------------------------------------------------

  describe('without matchWeekId', () => {
    beforeEach(async () => {
      vi.clearAllMocks();
      mockD11MatchApiService.getActiveD11Matches.mockReturnValue(of(matches));
      await setup();
    });

    it('calls getActiveD11Matches', () => {
      expect(mockD11MatchApiService.getActiveD11Matches).toHaveBeenCalled();
      expect(mockD11MatchApiService.getD11MatchesByMatchWeekId).not.toHaveBeenCalled();
    });

    it('renders matches from getActiveD11Matches', () => {
      expect(fixture.nativeElement.textContent).toContain(matches[0].homeD11Team.name);
    });
  });
});
