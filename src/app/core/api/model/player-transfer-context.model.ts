import { PlayerTransferContextTransferBid } from './player-transfer-context-transfer-bid.model';

export type { PlayerTransferContextTransferBid };

export interface PlayerTransferContext {
  playerId?: number;
  transferListable: boolean;
  deletableTransferListingId?: number;
  maxBid: number;
  activeTransferBid?: PlayerTransferContextTransferBid;
}
