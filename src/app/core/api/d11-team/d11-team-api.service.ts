import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { D11MatchBase } from '@app/core/api/model/d11-match-base.model';
import { D11TeamBase } from '@app/core/api/model/d11-team-base.model';
import { D11TeamSeasonStat } from '@app/core/api/model/d11-team-season-stat.model';
import { PlayerSeasonStat } from '@app/core/api/model/player-season-stat.model';
import { D11MatchesResponseBody } from '@app/core/api/d11-match/d11-matches-response-body.model';
import { D11TeamResponseBody } from './d11-team-response-body.model';
import { D11TeamSeasonStatResponseBody } from './d11-team-season-stat-response-body.model';
import { D11TeamsResponseBody } from './d11-teams-response-body.model';
import { PlayerSeasonStatsResponseBody } from './player-season-stats-response-body.model';

@Injectable({ providedIn: 'root' })
export class D11TeamApiService {
  readonly namespace = 'd11-teams';
  private apiService = inject(ApiService);

  getD11Teams(): Observable<D11TeamBase[]> {
    return this.apiService
      .get<D11TeamsResponseBody>({ namespace: this.namespace })
      .pipe(map((result) => result.d11Teams));
  }

  getById(id: number): Observable<D11TeamBase> {
    return this.apiService
      .get<D11TeamResponseBody>({ namespace: this.namespace, id })
      .pipe(map((result) => result.d11Team));
  }

  getD11MatchesByD11TeamIdAndSeasonId(
    d11TeamId: number,
    seasonId: number,
  ): Observable<D11MatchBase[]> {
    const params = new HttpParams().set('seasonId', seasonId);
    return this.apiService
      .get<D11MatchesResponseBody>({
        namespace: this.namespace,
        id: d11TeamId,
        endpoint: 'd11-matches',
        options: { params },
      })
      .pipe(map((result) => result.d11Matches));
  }

  getPlayerSeasonStatsByD11TeamIdAndSeasonId(
    d11TeamId: number,
    seasonId: number,
  ): Observable<PlayerSeasonStat[]> {
    const params = new HttpParams().set('seasonId', seasonId);
    return this.apiService
      .get<PlayerSeasonStatsResponseBody>({
        namespace: this.namespace,
        id: d11TeamId,
        endpoint: 'player-season-stats',
        options: { params },
      })
      .pipe(map((result) => result.playerSeasonStats));
  }

  getD11TeamSeasonStatByD11TeamIdAndSeasonId(
    d11TeamId: number,
    seasonId: number,
  ): Observable<D11TeamSeasonStat> {
    const params = new HttpParams().set('seasonId', seasonId);
    return this.apiService
      .get<D11TeamSeasonStatResponseBody>({
        namespace: this.namespace,
        id: d11TeamId,
        endpoint: 'd11-team-season-stats',
        options: { params },
      })
      .pipe(map((result) => result.d11TeamSeasonStat));
  }
}
