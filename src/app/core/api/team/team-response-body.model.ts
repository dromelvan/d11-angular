import { Stadium, TeamBase } from '@app/core/api';

export interface TeamResponseBody {
  team: TeamBase;
  stadium: Stadium;
}
