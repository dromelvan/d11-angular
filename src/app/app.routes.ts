import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'players',
    loadComponent: () =>
      import('@app/feature/page/players/players-page.component').then(
        (m) => m.PlayersPageComponent,
      ),
    data: { section: 'Players' },
  },
  {
    path: 'players/:playerId',
    loadComponent: () =>
      import('@app/feature/page/player/player-page.component').then(
        (m) => m.PlayerPageComponent,
      ),
    data: { section: 'Players' },
  },
  {
    path: 'matches/:matchId',
    loadComponent: () =>
      import('@app/feature/page/match/match-page.component').then(
        (m) => m.MatchPageComponent,
      ),
    data: { section: 'Matches' },
  },
  {
    path: 'match-weeks',
    loadComponent: () =>
      import('@app/feature/page/match-week/match-week-page.component').then(
        (m) => m.MatchWeekPageComponent,
      ),
    data: { section: 'Matches' },
  },
  {
    path: 'match-weeks/:matchWeekId',
    loadComponent: () =>
      import('@app/feature/page/match-week/match-week-page.component').then(
        (m) => m.MatchWeekPageComponent,
      ),
    data: { section: 'Matches' },
  },
  {
    path: 'seasons',
    loadComponent: () =>
      import('@app/feature/page/season/season-page.component').then(
        (m) => m.SeasonPageComponent,
      ),
    data: { section: 'Tables' },
  },
  {
    path: 'seasons/:seasonId',
    loadComponent: () =>
      import('@app/feature/page/season/season-page.component').then(
        (m) => m.SeasonPageComponent,
      ),
    data: { section: 'Tables' },
  },
  {
    path: 'transfers',
    loadComponent: () =>
      import('@app/feature/page/transfers/transfers-page.component').then(
        (m) => m.TransfersPageComponent,
      ),
    data: { section: 'Transfers' },
  },
  {
    path: 'transfers/:transferWindowId',
    loadComponent: () =>
      import('@app/feature/page/transfers/transfers-page.component').then(
        (m) => m.TransfersPageComponent,
      ),
    data: { section: 'Transfers' },
  },
  {
    path: 'more',
    loadComponent: () =>
      import('@app/feature/page/more/more-page.component').then((m) => m.MorePageComponent),
    data: { section: 'More' },
  },
  {
    path: 'rules',
    loadComponent: () =>
      import('@app/feature/page/rules/rules-page.component').then((m) => m.RulesPageComponent),
    data: { section: 'Rules' },
  },
  {
    path: 'd11-teams',
    loadComponent: () =>
      import('@app/feature/page/d11-teams/d11-teams-page.component').then(
        (m) => m.D11TeamsPageComponent,
      ),
    data: { section: 'D11 Teams' },
  },
];
