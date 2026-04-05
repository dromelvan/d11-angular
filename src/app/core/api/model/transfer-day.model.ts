import { Status } from './status.model';

export interface TransferDay {
  id: number;
  transferDayNumber: number;
  status: Status;
  datetime: string;
}
