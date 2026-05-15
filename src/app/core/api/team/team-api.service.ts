import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { MatchBase } from '@app/core/api/model/match-base.model';
import { PlayerSeasonStat } from '@app/core/api/model/player-season-stat.model';
import { Team } from '@app/core/api/model/team.model';
import { TeamBase } from '@app/core/api/model/team-base.model';
import { TeamSeasonStat } from '@app/core/api/model/team-season-stat.model';
import { MatchesResponseBody } from '@app/core/api/match/matches-response-body.model';
import { PlayerSeasonStatsResponseBody } from './player-season-stats-response-body.model';
import { TeamResponseBody } from './team-response-body.model';
import { TeamSeasonStatResponseBody } from './team-season-stat-response-body.model';
import { TeamsResponseBody } from './teams-response-body.model';

@Injectable({ providedIn: 'root' })
export class TeamApiService {
  readonly namespace = 'teams';
  private apiService = inject(ApiService);

  getTeams(): Observable<TeamBase[]> {
    return this.apiService
      .get<TeamsResponseBody>({ namespace: this.namespace })
      .pipe(map((result) => result.teams));
  }

  getById(id: number): Observable<Team> {
    return this.apiService
      .get<TeamResponseBody>({ namespace: this.namespace, id })
      .pipe(map((result) => ({ ...result.team, stadium: result.stadium })));
  }

  getMatchesByTeamIdAndSeasonId(teamId: number, seasonId: number): Observable<MatchBase[]> {
    const params = new HttpParams().set('seasonId', seasonId);
    return this.apiService
      .get<MatchesResponseBody>({
        namespace: this.namespace,
        id: teamId,
        endpoint: 'matches',
        options: { params },
      })
      .pipe(map((result) => result.matches));
  }

  getPlayerSeasonStatsByTeamIdAndSeasonId(
    teamId: number,
    seasonId: number,
  ): Observable<PlayerSeasonStat[]> {
    const params = new HttpParams().set('seasonId', seasonId);
    return this.apiService
      .get<PlayerSeasonStatsResponseBody>({
        namespace: this.namespace,
        id: teamId,
        endpoint: 'player-season-stats',
        options: { params },
      })
      .pipe(map((result) => result.playerSeasonStats));
  }

  getTeamSeasonStatByTeamIdAndSeasonId(
    teamId: number,
    seasonId: number,
  ): Observable<TeamSeasonStat> {
    const params = new HttpParams().set('seasonId', seasonId);
    return this.apiService
      .get<TeamSeasonStatResponseBody>({
        namespace: this.namespace,
        id: teamId,
        endpoint: 'team-season-stats',
        options: { params },
      })
      .pipe(map((result) => result.teamSeasonStat));
  }
}
