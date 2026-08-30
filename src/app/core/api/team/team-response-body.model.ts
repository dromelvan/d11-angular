import { Stadium, Team } from '@app/core/api';

export interface TeamResponseBody {
  team: Omit<Team, 'stadium'>;
  stadium: Stadium;
}
