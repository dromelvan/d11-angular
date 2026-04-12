import { Position } from './position.model';
import { TeamBase } from './team-base.model';

export interface TransferListingBase {
  id: number;
  ranking: number;
  team: TeamBase;
  position: Position;
}
