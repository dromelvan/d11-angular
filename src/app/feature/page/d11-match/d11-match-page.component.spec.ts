import { signal } from '@angular/core';
import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER, of } from 'rxjs';
import { beforeEach, describe, expect, vi } from 'vitest';
import { D11Match, D11MatchBase, D11TeamBase, PlayerMatchStat, Status } from '@app/core/api';
import { D11MatchApiService } from '@app/core/api/d11-match/d11-match-api.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import {
  fakeD11Match,
  fakeD11MatchBase,
  fakeD11TeamBase,
  fakeGoal,
  fakePlayerMatchStat,
} from '@app/test';
import { D11MatchPageComponent } from './d11-match-page.component';

interface D11MatchPageInternal {
  d11MatchBase: () => D11MatchBase | undefined;
  getD11TeamStats: (d11TeamId: number) => PlayerMatchStat[];
}

describe('D11MatchPageComponent', () => {
  const mockPageContextService = {
    setContext: vi.fn(),
    backgroundColor: signal('#000000'),
    textClass: signal('text-white'),
  };

  async function setup(d11Match: D11Match, playerMatchStats: PlayerMatchStat[] = []) {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [D11MatchPageComponent],
      providers: [
        { provide: Location, useValue: { getState: () => null } },
        {
          provide: D11MatchApiService,
          useValue: {
            getById: vi.fn().mockReturnValue(of(d11Match)),
            getPlayerMatchStatsByD11MatchId: vi.fn().mockReturnValue(of(playerMatchStats)),
          },
        },
        { provide: PageContextService, useValue: mockPageContextService },
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

    it('sets context with PageContextService', () => {
      expect(mockPageContextService.setContext).toHaveBeenCalledOnce();
    });

    it('set context title reflects match week number', () => {
      const registeredContext = mockPageContextService.setContext.mock.calls[0][0];
      expect(registeredContext.title()).toBe(`Match Week ${d11Match.matchWeek.matchWeekNumber}`);
    });

    it('set context subtitle reflects season name', () => {
      const registeredContext = mockPageContextService.setContext.mock.calls[0][0];
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

  describe('d11MatchBase', () => {
    it('is undefined when navigation state has no d11MatchBase', async () => {
      const d11Match = fakeD11Match();
      await setup(d11Match);
      const fixture = await createFixture(d11Match);

      expect(
        (fixture.componentInstance as unknown as D11MatchPageInternal).d11MatchBase(),
      ).toBeUndefined();
    });

    describe('with d11MatchBase in navigation state', () => {
      let fixture: ComponentFixture<D11MatchPageComponent>;
      let d11MatchBase: D11MatchBase;

      beforeEach(async () => {
        vi.clearAllMocks();
        d11MatchBase = fakeD11MatchBase();

        await TestBed.configureTestingModule({
          imports: [D11MatchPageComponent],
          providers: [
            { provide: Location, useValue: { getState: () => ({ d11MatchBase }) } },
            {
              provide: D11MatchApiService,
              useValue: {
                getById: vi.fn().mockReturnValue(NEVER),
                getPlayerMatchStatsByD11MatchId: vi.fn().mockReturnValue(NEVER),
              },
            },
            { provide: PageContextService, useValue: mockPageContextService },
          ],
        }).compileComponents();

        fixture = TestBed.createComponent(D11MatchPageComponent);
        fixture.componentRef.setInput('d11MatchId', 1);
        fixture.detectChanges();
      });

      it('reads d11MatchBase from navigation state', () => {
        expect((fixture.componentInstance as unknown as D11MatchPageInternal).d11MatchBase()).toBe(
          d11MatchBase,
        );
      });

      it('renders app-d11-match-hero before rxD11Match loads', () => {
        expect(fixture.nativeElement.querySelector('app-d11-match-hero')).toBeTruthy();
      });
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
