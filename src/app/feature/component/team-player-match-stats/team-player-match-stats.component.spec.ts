import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Lineup, PlayerMatchStat, TeamBase } from '@app/core/api';
import { fakeMatchBase, fakePlayerMatchStat, fakeTeamBase } from '@app/test';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { RouterService } from '@app/core/router/router.service';
import { beforeEach, describe, expect, vi } from 'vitest';
import { TeamPlayerMatchStatsComponent } from './team-player-match-stats.component';

const mockDynamicDialogService = { openPlayerMatchStat: vi.fn() };
const mockRouterService = { navigateToPlayer: vi.fn() };

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

  async function setup(stats: PlayerMatchStat[]) {
    fixture = TestBed.createComponent(TeamPlayerMatchStatsComponent);
    fixture.componentRef.setInput('team', team);
    fixture.componentRef.setInput('stats', stats);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    team = fakeTeamBase();
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [TeamPlayerMatchStatsComponent],
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

  // Filtering -------------------------------------------------------------------------------------

  describe('filtering', () => {
    let otherTeam: TeamBase;
    let otherStat: PlayerMatchStat;

    beforeEach(async () => {
      otherTeam = fakeTeamBase();
      otherStat = { ...fakeStat(), team: otherTeam };
      await setup([fakeStat(), otherStat]);
    });

    it('does not render players from other teams', () => {
      expect(fixture.nativeElement.textContent).not.toContain(otherStat.player.name);
    });
  });

  // Substitutes label -----------------------------------------------------------------------------

  describe('substitutes label', () => {
    beforeEach(async () => {
      await setup([fakeStat(), fakeStat({ lineup: Lineup.SUBSTITUTE })]);
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

  // Open dialog -----------------------------------------------------------------------------------

  describe('open dialog', () => {
    let stat: PlayerMatchStat;
    let otherStat: PlayerMatchStat;

    beforeEach(async () => {
      stat = fakeStat();
      otherStat = { ...fakeStat(), team: fakeTeamBase() };
      await setup([stat, otherStat]);
    });

    it('calls openPlayerMatchStat with the clicked stat and all stats', () => {
      const row = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
        '.cursor-pointer',
      );
      row?.click();
      expect(mockDynamicDialogService.openPlayerMatchStat).toHaveBeenCalledWith(
        stat,
        [stat, otherStat],
        expect.objectContaining({ label: 'Player profile', icon: 'player' }),
      );
    });
  });
});
