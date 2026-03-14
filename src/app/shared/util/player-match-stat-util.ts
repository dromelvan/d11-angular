import { D11MatchBase, Lineup, PlayerMatchStat } from '@app/core/api';

function compareByLineup(a: PlayerMatchStat, b: PlayerMatchStat): number {
  const lineupOrder = (pms: PlayerMatchStat): number => {
    if (pms.lineup === Lineup.STARTING_LINEUP) return 0;
    if (pms.lineup === Lineup.SUBSTITUTE && pms.substitutionOnTime > 0) return 1;
    return 2;
  };

  const lineupDiff = lineupOrder(a) - lineupOrder(b);
  if (lineupDiff !== 0) return lineupDiff;

  if (a.lineup === Lineup.SUBSTITUTE && b.lineup === Lineup.SUBSTITUTE) {
    const timeDiff = a.substitutionOnTime - b.substitutionOnTime;
    if (timeDiff !== 0) return timeDiff;
  }

  return 0;
}

function compareByPlayer(a: PlayerMatchStat, b: PlayerMatchStat): number {
  const sortOrderDiff = a.position.sortOrder - b.position.sortOrder;
  if (sortOrderDiff !== 0) return sortOrderDiff;

  const lastNameCmp = a.player.lastName.localeCompare(b.player.lastName);
  if (lastNameCmp !== 0) return lastNameCmp;

  const firstNameCmp = a.player.firstName.localeCompare(b.player.firstName);
  if (firstNameCmp !== 0) return firstNameCmp;

  return a.player.id - b.player.id;
}

export function sortByTeam(stats: PlayerMatchStat[]): PlayerMatchStat[] {
  return stats
    .filter(({ lineup }) => lineup !== Lineup.DID_NOT_PARTICIPATE)
    .sort((a, b) => {
      const aTeamOrder = a.team.id === a.match.homeTeam.id ? 0 : 1;
      const bTeamOrder = b.team.id === a.match.homeTeam.id ? 0 : 1;
      const teamDiff = aTeamOrder - bTeamOrder;
      if (teamDiff !== 0) return teamDiff;

      const lineupDiff = compareByLineup(a, b);
      if (lineupDiff !== 0) return lineupDiff;

      return compareByPlayer(a, b);
    });
}

export function sortByD11Team(d11Match: D11MatchBase, stats: PlayerMatchStat[]): PlayerMatchStat[] {
  return stats
    .filter(({ lineup }) => lineup !== Lineup.DID_NOT_PARTICIPATE)
    .sort((a, b) => {
      const aD11TeamOrder = a.d11Team.id === d11Match.homeD11Team.id ? 0 : 1;
      const bD11TeamOrder = b.d11Team.id === d11Match.homeD11Team.id ? 0 : 1;
      const d11TeamDiff = aD11TeamOrder - bD11TeamOrder;
      if (d11TeamDiff !== 0) return d11TeamDiff;

      return compareByPlayer(a, b);
    });
}
