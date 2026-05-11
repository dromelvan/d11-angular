import { ComponentFixture, TestBed } from '@angular/core/testing';
import { D11Match, D11TeamBase, PlayerMatchStat } from '@app/core/api';
import { Lineup } from '@app/core/api/model/lineup.model';
import { fakeD11Match, fakeD11TeamBase, fakePlayerMatchStat } from '@app/test';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { RouterService } from '@app/core/router/router.service';
import { beforeEach, describe, expect, vi } from 'vitest';
import { D11MatchPlayerMatchStatsCardComponent } from './d11-match-player-match-stats-card.component';

const mockDynamicDialogService = { openPlayerMatchStat: vi.fn() };
const mockRouterService = { navigateToPlayer: vi.fn() };

let homeD11Team: D11TeamBase;
let awayD11Team: D11TeamBase;
let baseD11Match: D11Match;

const fakeStat = (
  d11Team: D11TeamBase,
  overrides: Partial<PlayerMatchStat> = {},
): PlayerMatchStat => ({
  ...fakePlayerMatchStat(),
  d11Team,
  yellowCardTime: 0,
  redCardTime: 0,
  substitutionOnTime: 0,
  substitutionOffTime: 0,
  manOfTheMatch: false,
  sharedManOfTheMatch: false,
  lineup: Lineup.STARTING_LINEUP,
  ...overrides,
});

describe('D11MatchPlayerMatchStatsCardComponent', () => {
  let fixture: ComponentFixture<D11MatchPlayerMatchStatsCardComponent>;

  async function setup(
    d11Match: D11Match | undefined,
    playerMatchStats: PlayerMatchStat[] | undefined,
  ) {
    fixture = TestBed.createComponent(D11MatchPlayerMatchStatsCardComponent);
    fixture.componentRef.setInput('d11Match', d11Match);
    fixture.componentRef.setInput('playerMatchStats', playerMatchStats);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    homeD11Team = fakeD11TeamBase();
    awayD11Team = fakeD11TeamBase();
    baseD11Match = { ...fakeD11Match(), homeD11Team, awayD11Team };
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [D11MatchPlayerMatchStatsCardComponent],
      providers: [
        { provide: DynamicDialogService, useValue: mockDynamicDialogService },
        { provide: RouterService, useValue: mockRouterService },
      ],
    }).compileComponents();
  });

  // Without data ----------------------------------------------------------------------------------

  describe('without data', () => {
    beforeEach(async () => {
      await setup(undefined, undefined);
    });

    it('renders empty card', () => {
      expect(fixture.nativeElement.textContent).toContain('Player stats');
    });
  });

  // Squad grouping --------------------------------------------------------------------------------

  describe('squad grouping', () => {
    beforeEach(async () => {
      await setup(baseD11Match, [fakeStat(homeD11Team), fakeStat(awayD11Team)]);
    });

    it('renders home D11 team name', () => {
      expect(fixture.nativeElement.textContent).toContain(homeD11Team.name);
    });

    it('renders away D11 team name', () => {
      expect(fixture.nativeElement.textContent).toContain(awayD11Team.name);
    });
  });

  // Clicking a row --------------------------------------------------------------------------------

  describe('clicking a row', () => {
    let stat: PlayerMatchStat;

    beforeEach(async () => {
      stat = fakeStat(homeD11Team);
      await setup(baseD11Match, [stat]);
    });

    it('calls openPlayerMatchStat with the clicked stat and sorted stats', () => {
      const row = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
        '.cursor-pointer',
      );
      row?.click();
      expect(mockDynamicDialogService.openPlayerMatchStat).toHaveBeenCalledWith(
        stat,
        [stat],
        expect.objectContaining({ label: 'Player profile', icon: 'player' }),
      );
    });
  });
});
