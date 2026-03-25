import { Routes } from '@angular/router';
import {
  MatchPageComponent,
  MatchWeekPageComponent,
  PlayerPageComponent,
  SeasonPageComponent,
} from '@app/feature/page';

export const routes: Routes = [
  {
    path: 'players/:playerId',
    component: PlayerPageComponent,
    data: { section: 'Players' },
  },
  {
    path: 'matches/:matchId',
    component: MatchPageComponent,
    data: { section: 'Matches' },
  },
  {
    path: 'match-weeks',
    component: MatchWeekPageComponent,
    data: { section: 'Matches' },
  },
  {
    path: 'match-weeks/:matchWeekId',
    component: MatchWeekPageComponent,
    data: { section: 'Matches' },
  },
  {
    path: 'seasons',
    component: SeasonPageComponent,
    data: { section: 'Tables' },
  },
  {
    path: 'seasons/:seasonId',
    component: SeasonPageComponent,
    data: { section: 'Tables' },
  },
];
