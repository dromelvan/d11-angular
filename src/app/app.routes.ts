import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { CurrentService } from '@app/core/current/current.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@app/feature/page/match-week/match-week-page.component').then(
        (m) => m.MatchWeekPageComponent,
      ),
    data: { section: 'Matches' },
  },
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
      import('@app/feature/page/player/player-page.component').then((m) => m.PlayerPageComponent),
    data: { section: 'Players' },
  },
  {
    path: 'matches',
    canActivate: [
      () => {
        const currentService = inject(CurrentService);
        const router = inject(Router);
        const matchWeekId = currentService.matchWeek()?.id;
        if (matchWeekId == null) return true;
        return router.createUrlTree(['matches', 'week', matchWeekId]);
      },
    ],
    loadComponent: () =>
      import('@app/feature/page/matches/matches-page.component').then(
        (m) => m.MatchesPageComponent,
      ),
  },
  {
    path: 'matches/week/:matchWeekId',
    loadComponent: () =>
      import('@app/feature/page/matches/matches-page.component').then(
        (m) => m.MatchesPageComponent,
      ),
    data: { section: 'Matches' },
  },
  {
    path: 'matches/:matchId',
    loadComponent: () =>
      import('@app/feature/page/match/match-page.component').then((m) => m.MatchPageComponent),
    data: { section: 'Matches' },
  },
  {
    path: 'd11-matches/:d11MatchId',
    loadComponent: () =>
      import('@app/feature/page/d11-match/d11-match-page.component').then(
        (m) => m.D11MatchPageComponent,
      ),
    data: { section: 'D11 Matches' },
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
    path: 'seasons/:seasonId',
    loadComponent: () =>
      import('@app/feature/page/season/season-page.component').then((m) => m.SeasonPageComponent),
    data: { section: 'Tables' },
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
  {
    path: 'login',
    loadComponent: () =>
      import('@app/feature/page/login/login-page.component').then((m) => m.LoginPageComponent),
  },
  { path: '**', redirectTo: '' },
];
