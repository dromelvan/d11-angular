import { D11TeamBase } from './d11-team-base.model';
import { PlayerBase } from './player-base.model';
import { TransferDay } from './transfer-day.model';
import { TransferListingBase } from './transfer-listing-base.model';

export interface Transfer {
  id: number;
  fee: number;
  transferDay: TransferDay;
  player: PlayerBase;
  d11Team: D11TeamBase;
  transferListing: TransferListingBase;
}
