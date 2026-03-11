import { PlayerBase } from '@app/core/api';

export type MatchEventType =
  | 'goal'
  | 'penalty'
  | 'ownGoal'
  | 'yellowCard'
  | 'redCard'
  | 'substitutionOn'
  | 'substitutionOff';

export type MatchEventTeam = 'home' | 'away';

export interface MatchEvent {
  team: MatchEventTeam;
  player: PlayerBase;
  type: MatchEventType;
  time: number;
}
