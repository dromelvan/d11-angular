import { Country } from '@app/core/api/model/country.model';

export interface PlayerInput {
  firstName: string;
  lastName: string;
  statSourceId: number;
  premierLeagueId: number;
  fullName: string;
  dateOfBirth: string;
  height: number;
  verified: boolean;
  country: Country;
}

export interface PlayerInputRequestBody {
  player: PlayerInput;
}
