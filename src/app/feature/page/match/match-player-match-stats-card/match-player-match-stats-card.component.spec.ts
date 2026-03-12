import { Component } from '@angular/core';
import { fireEvent, render, screen } from '@testing-library/angular';
import { fakeMatchBase, fakePlayerMatchStat, fakeTeamBase } from '@app/core/api/test/faker-util';
import { Lineup, MatchBase, PlayerMatchStat, TeamBase } from '@app/core/api';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { RouterService } from '@app/core/router/router.service';
import { expect, vi } from 'vitest';
import { MatchPlayerMatchStatsCardComponent } from './match-player-match-stats-card.component';

let playerMatchStats: PlayerMatchStat[] | undefined;

@Component({
  template: ` <app-match-player-match-stats-card [playerMatchStats]="playerMatchStats" />`,
  standalone: true,
  imports: [MatchPlayerMatchStatsCardComponent],
})
class HostComponent {
  playerMatchStats = playerMatchStats;
}

let homeTeam: TeamBase;
let awayTeam: TeamBase;
let baseMatch: MatchBase;

const fakeStat = (team: TeamBase, overrides: Partial<PlayerMatchStat> = {}): PlayerMatchStat => ({
  ...fakePlayerMatchStat(),
  match: baseMatch,
  team,
  yellowCardTime: 0,
  redCardTime: 0,
  substitutionOnTime: 0,
  substitutionOffTime: 0,
  manOfTheMatch: false,
  sharedManOfTheMatch: false,
  ...overrides,
});

const mockDynamicDialogService = { openPlayerMatchStat: vi.fn() };
const mockRouterService = { navigateToPlayer: vi.fn() };
const providers = [
  { provide: DynamicDialogService, useValue: mockDynamicDialogService },
  { provide: RouterService, useValue: mockRouterService },
];

describe('MatchPlayerMatchStatsCardComponent', () => {
  beforeEach(() => {
    homeTeam = fakeTeamBase();
    awayTeam = fakeTeamBase();
    baseMatch = { ...fakeMatchBase(), homeTeam, awayTeam };
    vi.clearAllMocks();
  });

  describe('no stats', () => {
    beforeEach(async () => {
      playerMatchStats = undefined;
      await render(HostComponent, { providers });
    });

    it('renders no player rows', () => {
      expect(document.querySelectorAll('.app-grid-cell')).toHaveLength(0);
    });
  });

  describe('with stats', () => {
    let starter: PlayerMatchStat;

    beforeEach(async () => {
      starter = fakeStat(homeTeam, { lineup: Lineup.STARTING_LINEUP });
      playerMatchStats = [starter];
      await render(HostComponent, { providers });
    });

    it('renders the home team name', () => {
      expect(screen.getByText(homeTeam.name)).toBeInTheDocument();
    });

    it('renders the position code', () => {
      expect(screen.getByText(starter.position.code)).toBeInTheDocument();
    });

    it('renders the player name', () => {
      expect(screen.getByText(starter.player.name)).toBeInTheDocument();
    });
  });

  describe('home and away teams', () => {
    beforeEach(async () => {
      playerMatchStats = [
        fakeStat(homeTeam, { lineup: Lineup.STARTING_LINEUP }),
        fakeStat(awayTeam, { lineup: Lineup.STARTING_LINEUP }),
      ];
      await render(HostComponent, { providers });
    });

    it('renders a section for each team', () => {
      expect(screen.getByText(homeTeam.name)).toBeInTheDocument();
      expect(screen.getByText(awayTeam.name)).toBeInTheDocument();
    });
  });

  describe('substitutes label', () => {
    beforeEach(async () => {
      playerMatchStats = [
        fakeStat(homeTeam, { lineup: Lineup.STARTING_LINEUP }),
        fakeStat(homeTeam, { lineup: Lineup.SUBSTITUTE }),
      ];
      await render(HostComponent, { providers });
    });

    it('renders the Substitutes label', () => {
      expect(screen.getByText('Substitutes')).toBeInTheDocument();
    });
  });

  describe('no substitutes', () => {
    beforeEach(async () => {
      playerMatchStats = [fakeStat(homeTeam, { lineup: Lineup.STARTING_LINEUP })];
      await render(HostComponent, { providers });
    });

    it('does not render the Substitutes label', () => {
      expect(screen.queryByText('Substitutes')).not.toBeInTheDocument();
    });
  });

  describe('man of the match', () => {
    beforeEach(async () => {
      playerMatchStats = [
        fakeStat(homeTeam, { lineup: Lineup.STARTING_LINEUP, manOfTheMatch: true }),
        fakeStat(homeTeam, { lineup: Lineup.STARTING_LINEUP, sharedManOfTheMatch: true }),
      ];
      await render(HostComponent, { providers });
    });

    it('renders the mom icon', () => {
      expect(document.querySelector('app-icon[icon="mom"]')).toBeInTheDocument();
    });
    it('renders the shared mom icon', () => {
      expect(document.querySelector('app-icon[icon="shared_mom"]')).toBeInTheDocument();
    });
  });

  describe('substitution on time', () => {
    beforeEach(async () => {
      playerMatchStats = [
        fakeStat(homeTeam, {
          lineup: Lineup.SUBSTITUTE,
          substitutionOnTime: 65,
        }),
      ];
      await render(HostComponent, { providers });
    });

    it('renders the substitution on icon and time', () => {
      expect(document.querySelector('app-icon[icon="substitution_on"]')).toBeInTheDocument();
      expect(screen.getByText("65'")).toBeInTheDocument();
    });
  });

  describe('unused substitute', () => {
    beforeEach(async () => {
      playerMatchStats = [fakeStat(homeTeam, { lineup: Lineup.SUBSTITUTE, substitutionOnTime: 0 })];
      await render(HostComponent, { providers });
    });

    it('renders SUB label', () => {
      expect(screen.getByText('SUB')).toBeInTheDocument();
    });
  });

  describe('yellow card', () => {
    beforeEach(async () => {
      playerMatchStats = [
        fakeStat(homeTeam, { lineup: Lineup.STARTING_LINEUP, yellowCardTime: 42 }),
      ];
      await render(HostComponent, { providers });
    });

    it('renders the yellow card icon and time', () => {
      expect(document.querySelector('app-icon[icon="yellow_card"]')).toBeInTheDocument();
      expect(screen.getByText("42'")).toBeInTheDocument();
    });
  });

  describe('red card', () => {
    beforeEach(async () => {
      playerMatchStats = [fakeStat(homeTeam, { lineup: Lineup.STARTING_LINEUP, redCardTime: 78 })];
      await render(HostComponent, { providers });
    });

    it('renders the red card icon and time', () => {
      expect(document.querySelector('app-icon[icon="red_card"]')).toBeInTheDocument();
      expect(screen.getByText("78'")).toBeInTheDocument();
    });
  });

  describe('substitution off time', () => {
    beforeEach(async () => {
      playerMatchStats = [
        fakeStat(homeTeam, { lineup: Lineup.STARTING_LINEUP, substitutionOffTime: 55 }),
      ];
      await render(HostComponent, { providers });
    });

    it('renders the substitution off icon and time', () => {
      expect(document.querySelector('app-icon[icon="substitution_off"]')).toBeInTheDocument();
      expect(screen.getByText("55'")).toBeInTheDocument();
    });
  });

  describe('clicking a row', () => {
    let starter: PlayerMatchStat;

    beforeEach(async () => {
      starter = fakeStat(homeTeam, { lineup: Lineup.STARTING_LINEUP });
      playerMatchStats = [starter];
      await render(HostComponent, { providers });
    });

    it('calls openPlayerMatchStat with the clicked stat and all stats', () => {
      fireEvent.click(screen.getByText(starter.player.name));
      expect(mockDynamicDialogService.openPlayerMatchStat).toHaveBeenCalledWith(
        starter,
        playerMatchStats,
        expect.objectContaining({ label: 'Player profile', icon: 'player' }),
      );
    });
  });
});
