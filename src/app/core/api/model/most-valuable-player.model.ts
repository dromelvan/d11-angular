import { PlayerBase } from './player-base.model';
import { TeamBase } from './team-base.model';
import { D11TeamBase } from './d11-team-base.model';

export interface MostValuablePlayer {
  points: number;
  goals: number;
  player: PlayerBase;
  team: TeamBase;
  d11Team: D11TeamBase;
}
