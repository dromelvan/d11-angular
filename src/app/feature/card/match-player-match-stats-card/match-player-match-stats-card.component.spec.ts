import { fireEvent, render, screen } from '@testing-library/angular';
import { fakeMatchBase, fakePlayerMatchStat, fakeTeamBase } from '@app/test';
import { Lineup, MatchBase, PlayerMatchStat, TeamBase } from '@app/core/api';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { RouterService } from '@app/core/router/router.service';
import { expect, vi } from 'vitest';
import { MatchPlayerMatchStatsCardComponent } from './match-player-match-stats-card.component';

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

  // No stats --------------------------------------------------------------------------------------

  describe('no stats', () => {
    beforeEach(async () => {
      await render(MatchPlayerMatchStatsCardComponent, {
        inputs: { playerMatchStats: undefined },
        providers,
      });
    });

    it('renders no player rows', () => {
      expect(document.querySelectorAll('.app-grid-cell')).toHaveLength(0);
    });
  });

  // Squad grouping --------------------------------------------------------------------------------

  describe('home and away teams', () => {
    beforeEach(async () => {
      await render(MatchPlayerMatchStatsCardComponent, {
        inputs: {
          playerMatchStats: [
            fakeStat(homeTeam, { lineup: Lineup.STARTING_LINEUP }),
            fakeStat(awayTeam, { lineup: Lineup.STARTING_LINEUP }),
          ],
        },
        providers,
      });
    });

    it('renders a section for each team', () => {
      expect(screen.getByText(homeTeam.name)).toBeInTheDocument();
      expect(screen.getByText(awayTeam.name)).toBeInTheDocument();
    });
  });

  // Clicking a row --------------------------------------------------------------------------------

  describe('clicking a row', () => {
    let starter: PlayerMatchStat;

    beforeEach(async () => {
      starter = fakeStat(homeTeam, { lineup: Lineup.STARTING_LINEUP });
      await render(MatchPlayerMatchStatsCardComponent, {
        inputs: { playerMatchStats: [starter] },
        providers,
      });
    });

    it('calls openPlayerMatchStat with the clicked stat and all stats', () => {
      fireEvent.click(screen.getByText(starter.player.name));
      expect(mockDynamicDialogService.openPlayerMatchStat).toHaveBeenCalledWith(
        starter,
        [starter],
        expect.objectContaining({ label: 'Player profile', icon: 'player' }),
      );
    });
  });
});
