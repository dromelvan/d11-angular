import { Routes } from '@angular/router';
import { MatchPageComponent, MatchWeekPageComponent, PlayerPageComponent } from '@app/feature/page';

export const routes: Routes = [
  {
    path: 'players/:playerId',
    component: PlayerPageComponent,
  },
  {
    path: 'matches/:matchId',
    component: MatchPageComponent,
  },
  {
    path: 'match-weeks/:matchWeekId',
    component: MatchWeekPageComponent,
  },
];
