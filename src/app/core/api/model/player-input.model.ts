import { Country } from './country.model';

export interface PlayerInput {
  firstName?: string;
  lastName: string;
  statSourceId?: number;
  premierLeagueId?: number;
  fullName?: string;
  dateOfBirth?: string;
  height?: number;
  country?: Country;
}
