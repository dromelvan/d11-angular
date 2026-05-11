import { ComponentFixture, TestBed } from '@angular/core/testing';
import { D11TeamBase, PlayerMatchStat } from '@app/core/api';
import { Lineup } from '@app/core/api/model/lineup.model';
import { fakeD11TeamBase, fakePlayerMatchStat } from '@app/test';
import { beforeEach, describe, expect } from 'vitest';
import { D11TeamPlayerMatchStatsComponent } from './d11-team-player-match-stats.component';

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

    await TestBed.configureTestingModule({
      imports: [D11TeamPlayerMatchStatsComponent],
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

  // Row click -------------------------------------------------------------------------------------

  describe('row click', () => {
    let stat: PlayerMatchStat;
    let emitted: PlayerMatchStat | undefined;

    beforeEach(async () => {
      stat = fakeStat();
      await setup([stat]);
      emitted = undefined;
      fixture.componentInstance.statClick.subscribe((value) => (emitted = value));
    });

    it('emits statClick with the clicked stat', () => {
      const row = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
        '.cursor-pointer',
      );
      row?.click();
      expect(emitted).toBe(stat);
    });
  });
});
