import { D11Match, Match, PlayerMatchStat } from '@app/core/api';
import { MatchEvent, MatchEventType } from '@app/shared/model';

export function matchEvents(match: Match, playerMatchStats?: PlayerMatchStat[]): MatchEvent[] {
  const events: MatchEvent[] = [];

  match.homeTeamGoals?.forEach((goal) => {
    const type: MatchEventType = goal.ownGoal ? 'ownGoal' : goal.penalty ? 'penalty' : 'goal';
    events.push({ team: 'home', player: goal.player, type, time: goal.time });
  });

  match.awayTeamGoals?.forEach((goal) => {
    const type: MatchEventType = goal.ownGoal ? 'ownGoal' : goal.penalty ? 'penalty' : 'goal';
    events.push({ team: 'away', player: goal.player, type, time: goal.time });
  });

  playerMatchStats
    ?.filter((pms) => pms.redCardTime > 0)
    .forEach((pms) =>
      events.push({
        team: pms.team.id === match.homeTeam.id ? 'home' : 'away',
        player: pms.player,
        type: 'redCard',
        time: pms.redCardTime,
      }),
    );

  return events.sort((a, b) => a.time - b.time);
}

export function d11MatchEvents(
  d11Match: D11Match,
  playerMatchStats?: PlayerMatchStat[],
): MatchEvent[] {
  const events: MatchEvent[] = [];

  d11Match.homeTeamGoals?.forEach((goal) => {
    const type: MatchEventType = goal.ownGoal ? 'ownGoal' : goal.penalty ? 'penalty' : 'goal';
    events.push({ team: 'home', player: goal.player, type, time: goal.time });
  });

  d11Match.awayTeamGoals?.forEach((goal) => {
    const type: MatchEventType = goal.ownGoal ? 'ownGoal' : goal.penalty ? 'penalty' : 'goal';
    events.push({ team: 'away', player: goal.player, type, time: goal.time });
  });

  playerMatchStats
    ?.filter((pms) => pms.redCardTime > 0)
    .forEach((pms) =>
      events.push({
        team: pms.d11Team.id === d11Match.homeD11Team.id ? 'home' : 'away',
        player: pms.player,
        type: 'redCard',
        time: pms.redCardTime,
      }),
    );

  return events.sort((a, b) => a.time - b.time);
}
