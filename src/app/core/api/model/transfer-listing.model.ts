import { D11TeamBase } from './d11-team-base.model';
import { PlayerBase } from './player-base.model';
import { TransferListingBase } from './transfer-listing-base.model';

export interface TransferListing extends TransferListingBase {
  ranking: number;
  points: number;
  formPoints: number;
  formMatchPoints: number[];
  pointsPerAppearance: number;
  goals: number;
  goalAssists: number;
  ownGoals: number;
  goalsConceded: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  substitutionsOn: number;
  substitutionsOff: number;
  manOfTheMatch: number;
  sharedManOfTheMatch: number;
  rating: number;
  gamesStarted: number;
  gamesSubstitute: number;
  gamesDidNotParticipate: number;
  minutesPlayed: number;
  newPlayer: boolean;
  player: PlayerBase;
  d11Team: D11TeamBase;
}
