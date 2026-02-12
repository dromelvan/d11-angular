import { Status } from './status.model';

export interface Season {
  id: number;
  name: string;
  shortName: string;
  d11TeamBudget: number;
  d11TeamMaxTransfers: number;
  status: Status;
  date: string;
  legacy: boolean;
}
