import { signal } from '@angular/core';
import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER, of } from 'rxjs';
import { beforeEach, describe, expect, vi } from 'vitest';
import { Lineup, Match, MatchBase, PlayerMatchStat, Status, TeamBase } from '@app/core/api';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { fakeGoal, fakeMatch, fakeMatchBase, fakePlayerMatchStat, fakeTeamBase } from '@app/test';
import { MatchPageComponent } from './match-page.component';

interface MatchPageInternal {
  matchBase: () => MatchBase | undefined;
  getTeamStats: (teamId: number) => PlayerMatchStat[];
}

describe('MatchPageComponent', () => {
  const mockLoadingService = { register: vi.fn() };
  const mockPageContextService = {
    setContext: vi.fn(),
    backgroundColor: signal('#000000'),
    textClass: signal('text-white'),
  };

  async function setup(match: Match, playerMatchStats: PlayerMatchStat[] = []) {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [MatchPageComponent],
      providers: [
        { provide: Location, useValue: { getState: () => null } },
        {
          provide: MatchApiService,
          useValue: {
            getById: vi.fn().mockReturnValue(of(match)),
            getPlayerMatchStatsByMatchId: vi.fn().mockReturnValue(of(playerMatchStats)),
          },
        },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: PageContextService, useValue: mockPageContextService },
      ],
    }).compileComponents();
  }

  async function createFixture(match: Match): Promise<ComponentFixture<MatchPageComponent>> {
    const fixture = TestBed.createComponent(MatchPageComponent);
    fixture.componentRef.setInput('matchId', match.id);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  describe('pending match', () => {
    let fixture: ComponentFixture<MatchPageComponent>;
    let component: MatchPageComponent;
    let match: Match;

    beforeEach(async () => {
      match = { ...fakeMatch(), status: Status.PENDING };
      await setup(match);
      fixture = await createFixture(match);
      component = fixture.componentInstance;
    });

    it('creates the component', () => {
      expect(component).toBeTruthy();
    });

    it('sets context with PageContextService', () => {
      expect(mockPageContextService.setContext).toHaveBeenCalledOnce();
    });

    it('set context backgroundColor reflects homeTeam colour', () => {
      const registeredContext = mockPageContextService.setContext.mock.calls[0][0];
      expect(registeredContext.backgroundColor()).toBe(match.homeTeam.colour);
    });

    it('set context title reflects match week number', () => {
      const registeredContext = mockPageContextService.setContext.mock.calls[0][0];
      expect(registeredContext.title()).toBe(`Match Week ${match.matchWeek.matchWeekNumber}`);
    });

    it('set context subtitle reflects season name', () => {
      const registeredContext = mockPageContextService.setContext.mock.calls[0][0];
      expect(registeredContext.subtitle()).toBe(`Season ${match.matchWeek.season.name}`);
    });

    it('renders app-match-hero', () => {
      expect(fixture.nativeElement.querySelector('app-match-hero')).toBeTruthy();
    });

    it('does not render player stats sections', () => {
      expect(fixture.nativeElement.querySelector('app-team-player-match-stats-section')).toBeNull();
    });
  });

  describe('finished match', () => {
    let fixture: ComponentFixture<MatchPageComponent>;

    beforeEach(async () => {
      const homeTeam = fakeTeamBase();
      const awayTeam = fakeTeamBase();
      const match = { ...fakeMatch(), homeTeam, awayTeam, status: Status.FINISHED };
      const stat = { ...fakePlayerMatchStat(), team: homeTeam };
      await setup(match, [stat]);
      fixture = await createFixture(match);
    });

    it('renders app-match-hero', () => {
      expect(fixture.nativeElement.querySelector('app-match-hero')).toBeTruthy();
    });

    it('renders player stats section for both teams', () => {
      expect(
        fixture.nativeElement.querySelectorAll('app-team-player-match-stats-section'),
      ).toHaveLength(2);
    });
  });

  describe('getTeamStats', () => {
    let component: MatchPageComponent;
    let homeTeam: TeamBase;
    let awayTeam: TeamBase;

    beforeEach(async () => {
      homeTeam = fakeTeamBase();
      awayTeam = fakeTeamBase();
      const match = { ...fakeMatch(), homeTeam, awayTeam, status: Status.FINISHED };
      const homeStat = { ...fakePlayerMatchStat(), team: homeTeam, lineup: Lineup.STARTING_LINEUP };
      await setup(match, [homeStat]);
      const fixture = await createFixture(match);
      component = fixture.componentInstance;
    });

    it('returns stats for the given team', () => {
      expect((component as unknown as MatchPageInternal).getTeamStats(homeTeam.id)).toHaveLength(1);
    });

    it('returns empty array for a team with no stats', () => {
      expect((component as unknown as MatchPageInternal).getTeamStats(awayTeam.id)).toHaveLength(0);
    });
  });

  describe('matchBase', () => {
    it('is undefined when navigation state has no matchBase', async () => {
      const match = fakeMatch();
      await setup(match);
      const fixture = await createFixture(match);

      expect(
        (fixture.componentInstance as unknown as MatchPageInternal).matchBase(),
      ).toBeUndefined();
    });

    describe('with matchBase in navigation state', () => {
      let fixture: ComponentFixture<MatchPageComponent>;
      let matchBase: MatchBase;

      beforeEach(async () => {
        vi.clearAllMocks();
        matchBase = fakeMatchBase();

        await TestBed.configureTestingModule({
          imports: [MatchPageComponent],
          providers: [
            { provide: Location, useValue: { getState: () => ({ matchBase }) } },
            {
              provide: MatchApiService,
              useValue: {
                getById: vi.fn().mockReturnValue(NEVER),
                getPlayerMatchStatsByMatchId: vi.fn().mockReturnValue(NEVER),
              },
            },
            { provide: LoadingService, useValue: mockLoadingService },
            { provide: PageContextService, useValue: mockPageContextService },
          ],
        }).compileComponents();

        fixture = TestBed.createComponent(MatchPageComponent);
        fixture.componentRef.setInput('matchId', 1);
        fixture.detectChanges();
      });

      it('reads matchBase from navigation state', () => {
        expect((fixture.componentInstance as unknown as MatchPageInternal).matchBase()).toBe(
          matchBase,
        );
      });

      it('renders app-match-hero before rxMatch loads', () => {
        expect(fixture.nativeElement.querySelector('app-match-hero')).toBeTruthy();
      });

      it('backgroundColor reflects matchBase homeTeam colour before rxMatch loads', () => {
        const registeredContext = mockPageContextService.setContext.mock.calls[0][0];
        expect(registeredContext.backgroundColor()).toBe(matchBase.homeTeam.colour);
      });
    });
  });

  describe('match events section', () => {
    it('renders match events section when match has goals', async () => {
      const match = {
        ...fakeMatch(),
        status: Status.FINISHED,
        homeTeamGoals: [fakeGoal()],
        awayTeamGoals: [],
      };
      await setup(match);
      const fixture = await createFixture(match);

      expect(fixture.nativeElement.querySelector('app-match-events-section')).toBeTruthy();
    });

    it('does not render match events section when match has no goals and no red cards', async () => {
      const homeTeam = fakeTeamBase();
      const awayTeam = fakeTeamBase();
      const match = {
        ...fakeMatch(),
        homeTeam,
        awayTeam,
        status: Status.FINISHED,
        homeTeamGoals: [],
        awayTeamGoals: [],
      };
      const stat = {
        ...fakePlayerMatchStat(),
        team: homeTeam,
        redCardTime: 0,
        lineup: Lineup.STARTING_LINEUP,
      };
      await setup(match, [stat]);
      const fixture = await createFixture(match);

      expect(fixture.nativeElement.querySelector('app-match-events-section')).toBeNull();
    });
  });
});
