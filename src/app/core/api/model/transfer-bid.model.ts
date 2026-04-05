import { D11TeamBase } from './d11-team-base.model';
import { PlayerBase } from './player-base.model';

export interface TransferBid {
  id: number;
  playerRanking: number;
  d11TeamRanking: number;
  fee: number;
  activeFee: number;
  successful: boolean;
  player: PlayerBase;
  d11Team: D11TeamBase;
}
