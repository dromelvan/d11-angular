import { ComponentFixture, TestBed } from '@angular/core/testing';
import { D11TeamBase, Lineup, PlayerMatchStat } from '@app/core/api';
import { fakeD11TeamBase, fakePlayerMatchStat } from '@app/test';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { RouterService } from '@app/core/router/router.service';
import { beforeEach, describe, expect, vi } from 'vitest';
import { D11TeamPlayerMatchStatsComponent } from './d11-team-player-match-stats.component';

const mockDynamicDialogService = { openPlayerMatchStat: vi.fn() };
const mockRouterService = { navigateToPlayer: vi.fn() };

let d11Team: D11TeamBase;

const fakeStat = (overrides: Partial<PlayerMatchStat> = {}): PlayerMatchStat => ({
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

describe('D11TeamPlayerMatchStatsComponent', () => {
  let fixture: ComponentFixture<D11TeamPlayerMatchStatsComponent>;

  async function setup(stats: PlayerMatchStat[]) {
    fixture = TestBed.createComponent(D11TeamPlayerMatchStatsComponent);
    fixture.componentRef.setInput('d11Team', d11Team);
    fixture.componentRef.setInput('stats', stats);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    d11Team = fakeD11TeamBase();
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [D11TeamPlayerMatchStatsComponent],
      providers: [
        { provide: DynamicDialogService, useValue: mockDynamicDialogService },
        { provide: RouterService, useValue: mockRouterService },
      ],
    }).compileComponents();
  });

  // Team name -------------------------------------------------------------------------------------

  describe('team name', () => {
    beforeEach(async () => {
      await setup([fakeStat()]);
    });

    it('renders D11 team name', () => {
      expect(fixture.nativeElement.textContent).toContain(d11Team.name);
    });
  });

  // Player stats ----------------------------------------------------------------------------------

  describe('player stats', () => {
    let stat: PlayerMatchStat;

    beforeEach(async () => {
      stat = fakeStat();
      await setup([stat]);
    });

    it('renders player name', () => {
      expect(fixture.nativeElement.textContent).toContain(stat.player.name);
    });

    it('renders position code', () => {
      expect(fixture.nativeElement.textContent).toContain(stat.position.code);
    });
  });

  // Filtering -------------------------------------------------------------------------------------

  describe('filtering', () => {
    let otherTeam: D11TeamBase;
    let otherStat: PlayerMatchStat;

    beforeEach(async () => {
      otherTeam = fakeD11TeamBase();
      otherStat = { ...fakeStat(), d11Team: otherTeam };
      await setup([fakeStat(), otherStat]);
    });

    it('does not render players from other teams', () => {
      expect(fixture.nativeElement.textContent).not.toContain(otherStat.player.name);
    });
  });

  // Sorting ---------------------------------------------------------------------------------------

  describe('sorting', () => {
    let stat1: PlayerMatchStat;
    let stat2: PlayerMatchStat;

    beforeEach(async () => {
      stat1 = fakeStat({ position: { ...fakePlayerMatchStat().position, sortOrder: 2 } });
      stat2 = fakeStat({ position: { ...fakePlayerMatchStat().position, sortOrder: 1 } });
      await setup([stat1, stat2]);
    });

    it('renders stats sorted by position sort order', () => {
      const names = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
        '.cursor-pointer',
      );
      const texts = Array.from(names).map((el) => el.textContent ?? '');
      const index1 = texts.findIndex((text) => text.includes(stat1.player.name));
      const index2 = texts.findIndex((text) => text.includes(stat2.player.name));
      expect(index2).toBeLessThan(index1);
    });
  });

  // Man of the match ------------------------------------------------------------------------------

  describe('man of the match', () => {
    beforeEach(async () => {
      await setup([fakeStat({ manOfTheMatch: true }), fakeStat({ sharedManOfTheMatch: true })]);
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
      await setup([fakeStat({ yellowCardTime: 42 })]);
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
      await setup([fakeStat({ redCardTime: 78 })]);
    });

    it('renders the red card icon', () => {
      expect(fixture.nativeElement.querySelector('app-icon[icon="red_card"]')).toBeTruthy();
    });

    it('renders the red card time', () => {
      expect(fixture.nativeElement.textContent).toContain("78'");
    });
  });

  // Starting lineup -------------------------------------------------------------------------------

  describe('starting lineup', () => {
    beforeEach(async () => {
      await setup([fakeStat({ lineup: Lineup.STARTING_LINEUP, rating: 750 })]);
    });

    it('renders the rating', () => {
      expect(fixture.nativeElement.textContent).toContain('7.50');
    });
  });

  // Unused substitute -----------------------------------------------------------------------------

  describe('unused substitute', () => {
    beforeEach(async () => {
      await setup([fakeStat({ lineup: Lineup.SUBSTITUTE, substitutionOnTime: 0 })]);
    });

    it('renders SUB in rating column', () => {
      expect(fixture.nativeElement.textContent).toContain('SUB');
    });
  });

  // Did not participate ---------------------------------------------------------------------------

  describe('did not participate', () => {
    let stat: PlayerMatchStat;

    beforeEach(async () => {
      stat = fakeStat({ lineup: Lineup.DID_NOT_PARTICIPATE, points: 3 });
      await setup([stat]);
    });

    it('renders DNP in rating column', () => {
      expect(fixture.nativeElement.textContent).toContain('DNP');
    });

    it('renders points', () => {
      expect(fixture.nativeElement.textContent).toContain('3');
    });
  });

  // Open dialog -----------------------------------------------------------------------------------

  describe('open dialog', () => {
    let stat: PlayerMatchStat;

    beforeEach(async () => {
      stat = fakeStat();
      await setup([stat]);
    });

    it('calls openPlayerMatchStat with the clicked stat and filtered stats', () => {
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
