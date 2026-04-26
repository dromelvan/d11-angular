import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { D11Match } from '@app/core/api/model/d11-match.model';
import { D11MatchBase } from '@app/core/api/model/d11-match-base.model';
import { PlayerMatchStat } from '@app/core/api/model/player-match-stat.model';
import { PlayerMatchStatsResponseBody } from '@app/core/api/player/player-match-stats-response-body.model';
import { D11MatchResponseBody } from './d11-match-response-body.model';
import { D11MatchesResponseBody } from './d11-matches-response-body.model';

@Injectable({ providedIn: 'root' })
export class D11MatchApiService {
  readonly namespace = 'd11-matches';
  private apiService = inject(ApiService);

  getById(id: number): Observable<D11Match> {
    return this.apiService
      .get<D11MatchResponseBody>({ namespace: this.namespace, id })
      .pipe(map((result) => result.d11Match));
  }

  getD11MatchesByMatchWeekId(matchWeekId: number): Observable<D11MatchBase[]> {
    const params = new HttpParams().set('matchWeekId', matchWeekId);
    return this.apiService
      .get<D11MatchesResponseBody>({ namespace: this.namespace, options: { params } })
      .pipe(map((result) => result.d11Matches));
  }

  getCurrentD11Matches(): Observable<D11MatchBase[]> {
    return this.apiService
      .get<D11MatchesResponseBody>({ namespace: this.namespace, endpoint: 'current' })
      .pipe(map((result) => result.d11Matches));
  }

  getActiveD11Matches(): Observable<D11MatchBase[]> {
    return this.apiService
      .get<D11MatchesResponseBody>({ namespace: this.namespace, endpoint: 'active' })
      .pipe(map((result) => result.d11Matches));
  }

  getPlayerMatchStatsByD11MatchId(d11MatchId: number): Observable<PlayerMatchStat[]> {
    return this.apiService
      .get<PlayerMatchStatsResponseBody>({
        namespace: this.namespace,
        id: d11MatchId,
        endpoint: 'player-match-stats',
      })
      .pipe(map((result) => result.playerMatchStats));
  }
}
