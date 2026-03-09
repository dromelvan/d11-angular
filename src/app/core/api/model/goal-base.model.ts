import { PlayerBase } from './player-base.model';

export interface GoalBase {
  id: number;
  time: number;
  addedTime: number;
  penalty: boolean;
  ownGoal: boolean;
  player: PlayerBase;
}
