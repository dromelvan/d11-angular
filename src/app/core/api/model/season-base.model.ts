import { Status } from './status.model';

export interface SeasonBase {
  id: number;
  name: string;
  shortName: string;
  status: Status;
}
