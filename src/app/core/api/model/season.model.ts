import { Status } from './status.model';
import { SeasonBase } from './season-base.model';

export interface Season extends SeasonBase {
  d11TeamBudget: number;
  d11TeamMaxTransfers: number;
  status: Status;
  date: string;
  legacy: boolean;
}
