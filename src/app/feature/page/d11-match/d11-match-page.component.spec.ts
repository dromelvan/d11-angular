import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, vi } from 'vitest';
import { D11Match, D11TeamBase, PlayerMatchStat, Status } from '@app/core/api';
import { D11MatchApiService } from '@app/core/api/d11-match/d11-match-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { fakeD11Match, fakeD11TeamBase, fakeGoal, fakePlayerMatchStat } from '@app/test';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { D11MatchPageComponent } from './d11-match-page.component';

interface D11MatchPageInternal {
  getD11TeamStats: (d11TeamId: number) => PlayerMatchStat[];
}

describe('D11MatchPageComponent', () => {
  const mockLoadingService = { register: vi.fn() };
  const mockPageContextService = {
    register: vi.fn(),
    backgroundColor: signal('#000000'),
    textClass: signal('text-white'),
  };
  const mockDynamicDialogService = { openPlayerMatchStat: vi.fn() };
  const mockRouterService = { navigateToPlayer: vi.fn() };

  async function setup(d11Match: D11Match, playerMatchStats: PlayerMatchStat[] = []) {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [D11MatchPageComponent],
      providers: [
        {
          provide: D11MatchApiService,
          useValue: {
            getById: vi.fn().mockReturnValue(of(d11Match)),
            getPlayerMatchStatsByD11MatchId: vi.fn().mockReturnValue(of(playerMatchStats)),
          },
        },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: PageContextService, useValue: mockPageContextService },
        { provide: DynamicDialogService, useValue: mockDynamicDialogService },
        { provide: RouterService, useValue: mockRouterService },
      ],
    }).compileComponents();
  }

  async function createFixture(
    d11Match: D11Match,
  ): Promise<ComponentFixture<D11MatchPageComponent>> {
    const fixture = TestBed.createComponent(D11MatchPageComponent);
    fixture.componentRef.setInput('d11MatchId', d11Match.id);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  describe('pending match', () => {
    let fixture: ComponentFixture<D11MatchPageComponent>;
    let component: D11MatchPageComponent;
    let d11Match: D11Match;

    beforeEach(async () => {
      d11Match = { ...fakeD11Match(), status: Status.PENDING };
      await setup(d11Match);
      fixture = await createFixture(d11Match);
      component = fixture.componentInstance;
    });

    it('creates the component', () => {
      expect(component).toBeTruthy();
    });

    it('registers loading with LoadingService', () => {
      expect(mockLoadingService.register).toHaveBeenCalledOnce();
    });

    it('registers context with PageContextService', () => {
      expect(mockPageContextService.register).toHaveBeenCalledOnce();
    });

    it('registered context title reflects match week number', () => {
      const registeredContext = mockPageContextService.register.mock.calls[0][1];
      expect(registeredContext.title()).toBe(`Match Week ${d11Match.matchWeek.matchWeekNumber}`);
    });

    it('registered context subtitle reflects season name', () => {
      const registeredContext = mockPageContextService.register.mock.calls[0][1];
      expect(registeredContext.subtitle()).toBe(`Season ${d11Match.matchWeek.season.name}`);
    });

    it('renders app-d11-match-hero', () => {
      expect(fixture.nativeElement.querySelector('app-d11-match-hero')).toBeTruthy();
    });

    it('does not render player stats sections', () => {
      expect(
        fixture.nativeElement.querySelector('app-d11-team-player-match-stats-section'),
      ).toBeNull();
    });
  });

  describe('finished match', () => {
    let fixture: ComponentFixture<D11MatchPageComponent>;

    beforeEach(async () => {
      const homeD11Team = fakeD11TeamBase();
      const awayD11Team = fakeD11TeamBase();
      const d11Match = { ...fakeD11Match(), homeD11Team, awayD11Team, status: Status.FINISHED };
      const stat = { ...fakePlayerMatchStat(), d11Team: homeD11Team };
      await setup(d11Match, [stat]);
      fixture = await createFixture(d11Match);
    });

    it('renders app-d11-match-hero', () => {
      expect(fixture.nativeElement.querySelector('app-d11-match-hero')).toBeTruthy();
    });

    it('renders player stats section for both teams', () => {
      expect(
        fixture.nativeElement.querySelectorAll('app-d11-team-player-match-stats-section'),
      ).toHaveLength(2);
    });
  });

  describe('getD11TeamStats', () => {
    let component: D11MatchPageComponent;
    let homeD11Team: D11TeamBase;
    let awayD11Team: D11TeamBase;

    beforeEach(async () => {
      homeD11Team = fakeD11TeamBase();
      awayD11Team = fakeD11TeamBase();
      const d11Match = { ...fakeD11Match(), homeD11Team, awayD11Team, status: Status.FINISHED };
      const homeStat = { ...fakePlayerMatchStat(), d11Team: homeD11Team };
      await setup(d11Match, [homeStat]);
      const fixture = await createFixture(d11Match);
      component = fixture.componentInstance;
    });

    it('returns stats for the given team', () => {
      expect(
        (component as unknown as D11MatchPageInternal).getD11TeamStats(homeD11Team.id),
      ).toHaveLength(1);
    });

    it('returns empty array for a team with no stats', () => {
      expect(
        (component as unknown as D11MatchPageInternal).getD11TeamStats(awayD11Team.id),
      ).toHaveLength(0);
    });
  });

  describe('match events section', () => {
    it('renders match events section when match has goals', async () => {
      const d11Match: D11Match = {
        ...fakeD11Match(),
        status: Status.FINISHED,
        homeTeamGoals: [fakeGoal()],
        awayTeamGoals: [],
      };
      await setup(d11Match);
      const fixture = await createFixture(d11Match);

      expect(fixture.nativeElement.querySelector('app-match-events-section')).toBeTruthy();
    });

    it('does not render match events section when match has no goals', async () => {
      const d11Match: D11Match = {
        ...fakeD11Match(),
        status: Status.FINISHED,
        homeTeamGoals: [],
        awayTeamGoals: [],
      };
      await setup(d11Match);
      const fixture = await createFixture(d11Match);

      expect(fixture.nativeElement.querySelector('app-match-events-section')).toBeNull();
    });
  });
});
