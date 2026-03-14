import { inject, Injectable } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { map, Observable } from 'rxjs';
import { MatchResponseBody } from './match-response-body.model';
import { Match, PlayerMatchStat } from '@app/core/api';
import { PlayerMatchStatsResponseBody } from '@app/core/api/player/player-match-stats-response-body.model';

@Injectable({
  providedIn: 'root',
})
export class MatchApiService {
  readonly namespace = 'matches';
  private apiService = inject(ApiService);

  getById(id: number): Observable<Match> {
    return this.apiService
      .get<MatchResponseBody>({
        namespace: this.namespace,
        id: id,
      })
      .pipe(map((result) => result.match));
  }

  getPlayerMatchStatsByMatchId(matchId: number): Observable<PlayerMatchStat[]> {
    return this.apiService
      .get<PlayerMatchStatsResponseBody>({
        namespace: this.namespace,
        id: matchId,
        endpoint: 'player-match-stats',
      })
      .pipe(map((result) => result.playerMatchStats));
  }
}
