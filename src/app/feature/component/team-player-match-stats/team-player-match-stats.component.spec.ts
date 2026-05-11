import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerMatchStat, TeamBase } from '@app/core/api';
import { Lineup } from '@app/core/api/model/lineup.model';
import { fakeMatchBase, fakePlayerMatchStat, fakeTeamBase } from '@app/test';
import { beforeEach, describe, expect } from 'vitest';
import { TeamPlayerMatchStatsComponent } from './team-player-match-stats.component';

let team: TeamBase;

const fakeStat = (overrides: Partial<PlayerMatchStat> = {}): PlayerMatchStat => ({
  ...fakePlayerMatchStat(),
  match: { ...fakeMatchBase(), homeTeam: team, awayTeam: fakeTeamBase() },
  team,
  yellowCardTime: 0,
  redCardTime: 0,
  substitutionOnTime: 0,
  substitutionOffTime: 0,
  manOfTheMatch: false,
  sharedManOfTheMatch: false,
  lineup: Lineup.STARTING_LINEUP,
  ...overrides,
});

describe('TeamPlayerMatchStatsComponent', () => {
  let fixture: ComponentFixture<TeamPlayerMatchStatsComponent>;

  async function setup(stats: PlayerMatchStat[], substituteIndex = -1) {
    fixture = TestBed.createComponent(TeamPlayerMatchStatsComponent);
    fixture.componentRef.setInput('team', team);
    fixture.componentRef.setInput('stats', stats);
    fixture.componentRef.setInput('substituteIndex', substituteIndex);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    team = fakeTeamBase();

    await TestBed.configureTestingModule({
      imports: [TeamPlayerMatchStatsComponent],
    }).compileComponents();
  });

  // Team name -------------------------------------------------------------------------------------

  describe('team name', () => {
    beforeEach(async () => {
      await setup([fakeStat()]);
    });

    it('renders team name', () => {
      expect(fixture.nativeElement.textContent).toContain(team.name);
    });
  });

  // Player stats ----------------------------------------------------------------------------------

  describe('player stats', () => {
    let stat: PlayerMatchStat;

    beforeEach(async () => {
      stat = fakeStat();
      await setup([stat]);
    });

    it('renders position code', () => {
      expect(fixture.nativeElement.textContent).toContain(stat.position.code);
    });

    it('renders player name', () => {
      expect(fixture.nativeElement.textContent).toContain(stat.player.name);
    });
  });

  // Substitutes label -----------------------------------------------------------------------------

  describe('substitutes label', () => {
    beforeEach(async () => {
      await setup([fakeStat(), fakeStat({ lineup: Lineup.SUBSTITUTE })], 1);
    });

    it('renders the Substitutes label', () => {
      expect(fixture.nativeElement.textContent).toContain('Substitutes');
    });
  });

  describe('no substitutes', () => {
    beforeEach(async () => {
      await setup([fakeStat()]);
    });

    it('does not render the Substitutes label', () => {
      expect(fixture.nativeElement.textContent).not.toContain('Substitutes');
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

  // Substitution on -------------------------------------------------------------------------------

  describe('substitution on time', () => {
    beforeEach(async () => {
      await setup([fakeStat({ lineup: Lineup.SUBSTITUTE, substitutionOnTime: 65 })]);
    });

    it('renders the substitution on icon', () => {
      expect(fixture.nativeElement.querySelector('app-icon[icon="substitution_on"]')).toBeTruthy();
    });

    it('renders the substitution on time', () => {
      expect(fixture.nativeElement.textContent).toContain("65'");
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

  // Substitution off ------------------------------------------------------------------------------

  describe('substitution off time', () => {
    beforeEach(async () => {
      await setup([fakeStat({ substitutionOffTime: 55 })]);
    });

    it('renders the substitution off icon', () => {
      expect(fixture.nativeElement.querySelector('app-icon[icon="substitution_off"]')).toBeTruthy();
    });

    it('renders the substitution off time', () => {
      expect(fixture.nativeElement.textContent).toContain("55'");
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

    it('renders SUB label', () => {
      expect(fixture.nativeElement.textContent).toContain('SUB');
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
