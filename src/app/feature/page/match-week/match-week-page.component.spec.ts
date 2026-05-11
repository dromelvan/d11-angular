import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, vi } from 'vitest';
import { Match, MatchWeek, Season } from '@app/core/api';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { MatchWeekApiService } from '@app/core/api/match-week/match-week-api.service';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeMatch, fakeMatchWeek, fakeSeason } from '@app/test';
import { MatchWeekPageComponent } from './match-week-page.component';

describe('MatchWeekPageComponent', () => {
  let fixture: ComponentFixture<MatchWeekPageComponent>;
  let matchWeek: MatchWeek;
  let previousSeason: Season;
  let matches: Match[];
  let matchWeekApi: Partial<MatchWeekApiService>;
  let matchApi: Partial<MatchApiService>;
  let routerService: { navigateToMatchWeek: ReturnType<typeof vi.fn> };

  async function setup() {
    fixture = TestBed.createComponent(MatchWeekPageComponent);
    fixture.componentRef.setInput('matchWeekId', matchWeek.id);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollIntoView = vi.fn();

    matchWeek = fakeMatchWeek();
    previousSeason = { ...fakeSeason(), id: matchWeek.season.id + 1, date: '2022-08-01' };
    matches = [
      {
        ...fakeMatch(),
        id: 1,
        homeTeam: { ...fakeMatch().homeTeam, name: 'Team1' },
        awayTeam: { ...fakeMatch().awayTeam, name: 'Team2' },
      },
      {
        ...fakeMatch(),
        id: 2,
        homeTeam: { ...fakeMatch().homeTeam, name: 'Team3' },
        awayTeam: { ...fakeMatch().awayTeam, name: 'Team4' },
      },
    ] as unknown as Match[];

    matchWeekApi = {
      getById: vi.fn().mockReturnValue(of(matchWeek)),
      getCurrentMatchWeek: vi.fn().mockReturnValue(of(matchWeek)),
      getMatchWeeksBySeasonId: vi.fn().mockReturnValue(of([matchWeek])),
    };

    matchApi = {
      getMatchesByMatchWeekId: vi.fn().mockReturnValue(of(matches)),
    };

    routerService = { navigateToMatchWeek: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [MatchWeekPageComponent],
      providers: [
        { provide: MatchWeekApiService, useValue: matchWeekApi },
        { provide: MatchApiService, useValue: matchApi },
        {
          provide: SeasonApiService,
          useValue: {
            getAll: vi.fn().mockReturnValue(
              of([
                {
                  ...fakeSeason(),
                  id: matchWeek.season.id,
                  name: matchWeek.season.name,
                  date: '2023-08-01',
                },
                previousSeason,
              ]),
            ),
          },
        },
        { provide: LoadingService, useValue: { register: vi.fn() } },
        { provide: RouterService, useValue: routerService },
      ],
    }).compileComponents();

    await setup();
  });

  it('renders season name', () => {
    expect(fixture.nativeElement.textContent).toContain(matchWeek.season.name);
  });

  it('renders matches card', () => {
    expect(fixture.nativeElement.textContent).toContain('Team1');
    expect(fixture.nativeElement.textContent).toContain('Team2');
  });

  it('calls getById with matchWeekId', () => {
    expect(matchWeekApi.getById).toHaveBeenCalledWith(matchWeek.id);
  });

  it('calls getById again when matchWeekId input changes', async () => {
    const newId = matchWeek.id + 1;

    fixture.componentRef.setInput('matchWeekId', newId);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(matchWeekApi.getById).toHaveBeenCalledWith(newId);
  });

  it('calls getMatchWeeksBySeasonId with the match week season id', () => {
    expect(matchWeekApi.getMatchWeeksBySeasonId).toHaveBeenCalledWith(matchWeek.season.id);
  });

  it('always calls getCurrentMatchWeek for current week indicator', () => {
    expect(matchWeekApi.getCurrentMatchWeek).toHaveBeenCalled();
  });

  it('navigates to match week when a week is selected from scroll picker', () => {
    const button = fixture.nativeElement.querySelector(`[data-id="${matchWeek.id}"]`);
    button.click();

    expect(routerService.navigateToMatchWeek).toHaveBeenCalledExactlyOnceWith(matchWeek.id);
  });

  it('toggles active class on Live button click', () => {
    const liveButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((b) => b.textContent?.trim() === 'Live')!;

    liveButton.click();
    fixture.detectChanges();
    expect(liveButton.classList).toContain('bg-primary');

    liveButton.click();
    fixture.detectChanges();
    expect(liveButton.classList).not.toContain('bg-primary');
  });

  describe('when user selects the previous season', () => {
    let firstMatchWeekOfPreviousSeason: MatchWeek;

    beforeEach(async () => {
      firstMatchWeekOfPreviousSeason = {
        ...fakeMatchWeek(),
        id: matchWeek.id + 100,
        matchWeekNumber: 1,
      };

      (matchWeekApi.getMatchWeeksBySeasonId as ReturnType<typeof vi.fn>).mockImplementation(
        (seasonId: number) =>
          of(seasonId === previousSeason.id ? [firstMatchWeekOfPreviousSeason] : [matchWeek]),
      );

      fixture = TestBed.createComponent(MatchWeekPageComponent);
      fixture.componentRef.setInput('matchWeekId', matchWeek.id);
      fixture.detectChanges();
      await fixture.whenStable();

      const [prevButton] = fixture.nativeElement.querySelectorAll('app-material-icon-button');
      prevButton.click();
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('loads match weeks for the selected season', () => {
      expect(matchWeekApi.getMatchWeeksBySeasonId).toHaveBeenCalledWith(previousSeason.id);
    });

    it('navigates to the first match week of the selected season', () => {
      expect(routerService.navigateToMatchWeek).toHaveBeenCalledWith(
        firstMatchWeekOfPreviousSeason.id,
      );
    });
  });
});
