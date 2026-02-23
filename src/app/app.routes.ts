import { Routes } from '@angular/router';
import { PlayerPageComponent } from '@app/feature/page';

export const routes: Routes = [
  {
    path: 'players/:playerId',
    component: PlayerPageComponent,
  },
];
