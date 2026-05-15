import { Status } from '@app/core/api/model/status.model';

export interface TransferDayInput {
  transferDayNumber: number;
  status: Status;
  datetime: string;
}

export interface UpdateTransferDayRequestBody {
  transferDay: TransferDayInput;
}
