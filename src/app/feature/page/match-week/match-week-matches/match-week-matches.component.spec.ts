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

function formatDateHeader(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));
}

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
        homeTeam: { ...m1.homeTeam, name: 'Team1' },
        awayTeam: { ...m1.awayTeam, name: 'Team2' },
      },
      {
        ...m2,
        homeTeam: { ...m2.homeTeam, name: 'Team3' },
        awayTeam: { ...m2.awayTeam, name: 'Team4' },
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

  it('renders home team name for each match', () => {
    for (const match of matches) {
      expect(fixture.nativeElement.textContent).toContain(match.homeTeam.name);
    }
  });

  it('renders away team name for each match', () => {
    for (const match of matches) {
      expect(fixture.nativeElement.textContent).toContain(match.awayTeam.name);
    }
  });

  it('navigates to match on row click', () => {
    const rows = Array.from<HTMLElement>(
      fixture.nativeElement.querySelectorAll('.col-span-4.grid'),
    );
    const row = rows.find((element) => element.textContent?.includes(matches[0].homeTeam.name))!;
    row.click();
    expect(mockRouterService.navigateToMatch).toHaveBeenCalledExactlyOnceWith(matches[0].id);
  });

  // Kickoff time ---------------------------------------------------------------------------------

  describe('kickoff time', () => {
    it('renders in HH:mm format', async () => {
      const datetime = '2025-06-15T14:30:00.000Z';
      matches = [{ ...fakeMatchBase(), status: Status.PENDING, datetime }];
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);

      const date = new Date(datetime);
      const expected = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      expect(fixture.nativeElement.textContent).toContain(expected);
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

    describe('full time indicator', () => {
      it('renders * when status is FULL_TIME', async () => {
        matches = [{ ...fakeMatchBase(), status: Status.FULL_TIME }];
        mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
        await setup(1);

        const errorSpan = fixture.nativeElement.querySelector('span.text-error');
        expect(errorSpan).toBeTruthy();
        expect(errorSpan.textContent.trim()).toBe('*');
      });

      it('does not render * when status is ACTIVE', async () => {
        matches = [{ ...fakeMatchBase(), status: Status.ACTIVE }];
        mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
        await setup(1);

        expect(fixture.nativeElement.querySelector('span.text-error')).toBeNull();
      });

      it('does not render * when status is FINISHED', async () => {
        matches = [{ ...fakeMatchBase(), status: Status.FINISHED }];
        mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
        await setup(1);

        expect(fixture.nativeElement.querySelector('span.text-error')).toBeNull();
      });
    });

    describe('active match elapsed styling', () => {
      it('elapsed span has bg-primary class when status is ACTIVE', async () => {
        matches = [{ ...fakeMatchBase(), status: Status.ACTIVE, elapsed: '45' }];
        mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
        await setup(1);

        const elapsedSpan = Array.from<HTMLElement>(
          fixture.nativeElement.querySelectorAll('span'),
        ).find((span) => span.textContent?.trim().startsWith('45'));
        expect(elapsedSpan?.classList).toContain('bg-primary');
      });

      it('elapsed span does not have bg-primary class when status is FULL_TIME', async () => {
        matches = [{ ...fakeMatchBase(), status: Status.FULL_TIME, elapsed: 'FT' }];
        mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
        await setup(1);

        const elapsedSpan = Array.from<HTMLElement>(
          fixture.nativeElement.querySelectorAll('span'),
        ).find((span) => span.textContent?.trim().startsWith('FT'));
        expect(elapsedSpan?.classList).not.toContain('bg-primary');
      });

      it('elapsed span does not have bg-primary class when status is FINISHED', async () => {
        matches = [{ ...fakeMatchBase(), status: Status.FINISHED, elapsed: 'FT' }];
        mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
        await setup(1);

        const elapsedSpan = Array.from<HTMLElement>(
          fixture.nativeElement.querySelectorAll('span'),
        ).find((span) => span.textContent?.trim().startsWith('FT'));
        expect(elapsedSpan?.classList).not.toContain('bg-primary');
      });
    });
  });

  // Goals ----------------------------------------------------------------------------------------

  describe('goals', () => {
    it('renders for active match', async () => {
      matches = [
        {
          ...fakeMatchBase(),
          status: Status.ACTIVE,
          homeTeamGoalsScored: 101,
          awayTeamGoalsScored: 103,
        },
      ];
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);

      expect(fixture.nativeElement.textContent).toContain('101');
      expect(fixture.nativeElement.textContent).toContain('103');
    });

    it('renders for full time match', async () => {
      matches = [
        {
          ...fakeMatchBase(),
          status: Status.FULL_TIME,
          homeTeamGoalsScored: 101,
          awayTeamGoalsScored: 103,
        },
      ];
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);

      expect(fixture.nativeElement.textContent).toContain('101');
      expect(fixture.nativeElement.textContent).toContain('103');
    });

    it('renders for finished match', async () => {
      matches = [
        {
          ...fakeMatchBase(),
          status: Status.FINISHED,
          homeTeamGoalsScored: 101,
          awayTeamGoalsScored: 103,
        },
      ];
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);

      expect(fixture.nativeElement.textContent).toContain('101');
      expect(fixture.nativeElement.textContent).toContain('103');
    });

    it('does not render for pending match', async () => {
      matches = [
        {
          ...fakeMatchBase(),
          status: Status.PENDING,
          homeTeamGoalsScored: 101,
          awayTeamGoalsScored: 103,
        },
      ];
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);

      expect(fixture.nativeElement.textContent).not.toContain('101');
      expect(fixture.nativeElement.textContent).not.toContain('103');
    });

    it('does not render for postponed match', async () => {
      matches = [
        {
          ...fakeMatchBase(),
          status: Status.POSTPONED,
          homeTeamGoalsScored: 101,
          awayTeamGoalsScored: 103,
        },
      ];
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);

      expect(fixture.nativeElement.textContent).not.toContain('101');
      expect(fixture.nativeElement.textContent).not.toContain('103');
    });

    describe('goal change indicator', () => {
      it('shows +N and up arrow when home goals increased', async () => {
        matches = [
          {
            ...fakeMatchBase(),
            status: Status.ACTIVE,
            homeTeamGoalsScored: 3,
            previousHomeTeamGoalsScored: 1,
          },
        ];
        mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
        await setup(1);

        const indicator = fixture.nativeElement.querySelector('app-icon.text-success');
        expect(indicator).toBeTruthy();
        expect(fixture.nativeElement.textContent).toContain('+2');
      });

      it('shows -N and down arrow when home goals decreased', async () => {
        matches = [
          {
            ...fakeMatchBase(),
            status: Status.ACTIVE,
            homeTeamGoalsScored: 1,
            previousHomeTeamGoalsScored: 2,
          },
        ];
        mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
        await setup(1);

        const indicator = fixture.nativeElement.querySelector('app-icon.text-error');
        expect(indicator).toBeTruthy();
        expect(fixture.nativeElement.textContent).toContain('-1');
      });

      it('does not show indicator when goals are unchanged', async () => {
        matches = [
          {
            ...fakeMatchBase(),
            status: Status.ACTIVE,
            homeTeamGoalsScored: 2,
            previousHomeTeamGoalsScored: 2,
            awayTeamGoalsScored: 2,
            previousAwayTeamGoalsScored: 2,
          },
        ];
        mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
        await setup(1);

        expect(fixture.nativeElement.querySelector('app-icon')).toBeNull();
      });

      it('shows +N and up arrow when away goals increased', async () => {
        matches = [
          {
            ...fakeMatchBase(),
            status: Status.ACTIVE,
            homeTeamGoalsScored: 0,
            previousHomeTeamGoalsScored: 0,
            awayTeamGoalsScored: 2,
            previousAwayTeamGoalsScored: 1,
          },
        ];
        mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
        await setup(1);

        const indicator = fixture.nativeElement.querySelector('app-icon.text-success');
        expect(indicator).toBeTruthy();
        expect(fixture.nativeElement.textContent).toContain('+1');
      });

      it('does not show indicator when status is PENDING even if goals differ', async () => {
        matches = [
          {
            ...fakeMatchBase(),
            status: Status.PENDING,
            homeTeamGoalsScored: 3,
            previousHomeTeamGoalsScored: 1,
            awayTeamGoalsScored: 3,
            previousAwayTeamGoalsScored: 1,
          },
        ];
        mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
        await setup(1);

        expect(fixture.nativeElement.querySelector('app-icon')).toBeNull();
      });
    });
  });

  // Date grouping --------------------------------------------------------------------------------

  describe('date grouping', () => {
    const date1 = '2025-03-15';
    const date2 = '2025-03-16';

    it('renders date headers in order', async () => {
      matches = [
        { ...fakeMatchBase(), status: Status.FINISHED, datetime: `${date1}T15:00:00.000Z` },
        { ...fakeMatchBase(), status: Status.FINISHED, datetime: `${date2}T15:00:00.000Z` },
      ];
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of(matches));
      await setup(1);

      const formatted1 = formatDateHeader(date1);
      const formatted2 = formatDateHeader(date2);
      const headers = Array.from(
        fixture.nativeElement.querySelectorAll('.app-grid-header, .app-grid-sub-header'),
      ).map((element) => (element as HTMLElement).textContent?.trim());

      expect(headers).toContain(formatted1);
      expect(headers).toContain(formatted2);
      expect(headers.indexOf(formatted1)).toBeLessThan(headers.indexOf(formatted2));
    });

    it('sorts matches by datetime within a group', async () => {
      const earlyBase = fakeMatchBase();
      const lateBase = fakeMatchBase();
      const early = {
        ...earlyBase,
        status: Status.FINISHED,
        datetime: `${date1}T12:00:00.000Z`,
        homeTeam: { ...earlyBase.homeTeam, name: 'Team1' },
      };
      const late = {
        ...lateBase,
        status: Status.FINISHED,
        datetime: `${date1}T17:00:00.000Z`,
        homeTeam: { ...lateBase.homeTeam, name: 'Team2' },
      };
      mockMatchApiService.getMatchesByMatchWeekId.mockReturnValue(of([late, early]));
      await setup(1);

      const rows = fixture.nativeElement.querySelectorAll('.col-span-4.grid');
      expect(rows[0].textContent).toContain(early.homeTeam.name);
      expect(rows[1].textContent).toContain(late.homeTeam.name);
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
      expect(fixture.nativeElement.textContent).toContain(matches[0].homeTeam.name);
    });
  });
});
