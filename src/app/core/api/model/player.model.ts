import { PlayerBase } from './player-base.model';
import { Country } from './country.model';

export interface Player extends PlayerBase {
  statSourceId: number;
  premierLeagueId: number;
  fullName?: string;
  dateOfBirth: string;
  height: number;
  verified: boolean;
  country: Country;
}
