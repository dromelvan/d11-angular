export interface TransferBidInput {
  playerId: number;
  fee: number;
}

export interface CreateTransferBidRequestBody {
  transferBid: TransferBidInput;
}
