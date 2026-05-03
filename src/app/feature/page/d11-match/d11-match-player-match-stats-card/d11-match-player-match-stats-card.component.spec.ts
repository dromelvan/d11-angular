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

  // With player stats -----------------------------------------------------------------------------

  describe('with player stats', () => {
    let starter: PlayerMatchStat;

    beforeEach(async () => {
      starter = fakeStat(homeD11Team);
      await setup(baseD11Match, [starter]);
    });

    it('renders home D11 team name', () => {
      expect(fixture.nativeElement.textContent).toContain(homeD11Team.name);
    });

    it('renders player name', () => {
      expect(fixture.nativeElement.textContent).toContain(starter.player.name);
    });

    it('renders position code', () => {
      expect(fixture.nativeElement.textContent).toContain(starter.position.code);
    });
  });

  // Home and away teams ---------------------------------------------------------------------------

  describe('home and away teams', () => {
    beforeEach(async () => {
      await setup(baseD11Match, [fakeStat(homeD11Team), fakeStat(awayD11Team)]);
    });

    it('renders away D11 team name', () => {
      expect(fixture.nativeElement.textContent).toContain(awayD11Team.name);
    });
  });

  // Man of the match ------------------------------------------------------------------------------

  describe('man of the match', () => {
    beforeEach(async () => {
      await setup(baseD11Match, [
        fakeStat(homeD11Team, { manOfTheMatch: true }),
        fakeStat(homeD11Team, { sharedManOfTheMatch: true }),
      ]);
    });

    it('renders the mom icon', () => {
      expect(fixture.nativeElement.querySelector('app-icon[icon="mom"]')).toBeTruthy();
    });

    it('renders the shared mom icon', () => {
      expect(fixture.nativeElement.querySelector('app-icon[icon="shared_mom"]')).toBeTruthy();
    });
  });

  // Yellow card -----------------------------------------------------------------------------------

  describe('yellow card', () => {
    beforeEach(async () => {
      await setup(baseD11Match, [fakeStat(homeD11Team, { yellowCardTime: 42 })]);
    });

    it('renders the yellow card icon', () => {
      expect(fixture.nativeElement.querySelector('app-icon[icon="yellow_card"]')).toBeTruthy();
    });

    it('renders the yellow card time', () => {
      expect(fixture.nativeElement.textContent).toContain("42'");
    });
  });

  // Red card --------------------------------------------------------------------------------------

  describe('red card', () => {
    beforeEach(async () => {
      await setup(baseD11Match, [fakeStat(homeD11Team, { redCardTime: 78 })]);
    });

    it('renders the red card icon', () => {
      expect(fixture.nativeElement.querySelector('app-icon[icon="red_card"]')).toBeTruthy();
    });

    it('renders the red card time', () => {
      expect(fixture.nativeElement.textContent).toContain("78'");
    });
  });

  // Unused substitute -----------------------------------------------------------------------------

  describe('unused substitute', () => {
    beforeEach(async () => {
      await setup(baseD11Match, [
        fakeStat(homeD11Team, { lineup: Lineup.SUBSTITUTE, substitutionOnTime: 0 }),
      ]);
    });

    it('renders SUB in rating column', () => {
      expect(fixture.nativeElement.textContent).toContain('SUB');
    });
  });

  // Did not participate ---------------------------------------------------------------------------

  describe('did not participate', () => {
    let stat: PlayerMatchStat;

    beforeEach(async () => {
      stat = fakeStat(homeD11Team, { lineup: Lineup.DID_NOT_PARTICIPATE, points: 3 });
      await setup(baseD11Match, [stat]);
    });

    it('renders DNP in rating column', () => {
      expect(fixture.nativeElement.textContent).toContain('DNP');
    });

    it('renders points', () => {
      expect(fixture.nativeElement.textContent).toContain('3');
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
