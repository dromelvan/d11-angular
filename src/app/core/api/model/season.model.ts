import { SeasonBase } from './season-base.model';

export interface Season extends SeasonBase {
  d11TeamBudget: number;
  d11TeamMaxTransfers: number;
  date: string;
  legacy: boolean;
}
