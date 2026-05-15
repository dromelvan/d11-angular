export interface PlayerTransferContextTransferBid {
  id: number;
  fee: number;
}

export interface PlayerTransferContext {
  playerId?: number;
  transferListable: boolean;
  deletableTransferListingId?: number;
  maxBid: number;
  activeTransferBid?: PlayerTransferContextTransferBid;
}
