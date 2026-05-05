import { TeamBase } from './team-base.model';
import { Stadium } from './stadium.model';

export interface Team extends TeamBase {
  stadium: Stadium;
}
