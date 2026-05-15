import { Status } from '@app/core/api/model/status.model';

export interface TransferDayStatusInput {
  status: Status;
  process: boolean;
}

export interface UpdateTransferDayStatusRequestBody {
  transferDay: TransferDayStatusInput;
}
