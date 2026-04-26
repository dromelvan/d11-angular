import { Status } from './status.model';

export interface TransferWindowBase {
  id: number;
  transferWindowNumber: number;
  draft: boolean;
  status: Status;
  datetime: string;
}
