import { Status } from '@app/core/api/model/status.model';

export interface TransferWindowInput {
  transferWindowNumber: number;
  draft: boolean;
  status: Status;
  datetime: string;
  matchWeekId: number;
}

export interface UpdateTransferWindowRequestBody {
  transferWindow: TransferWindowInput;
}
