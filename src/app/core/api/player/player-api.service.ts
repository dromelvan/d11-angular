import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { PlayerTransferContext } from '@app/core/api/model/player-transfer-context.model';
import { PlayerSearchResult } from '@app/core/api/model/player-search-result.model';
import { PlayerSeasonStat } from '@app/core/api/model/player-season-stat.model';
import { Player } from '@app/core/api/model/player.model';
import { Transfer } from '@app/core/api/model/transfer.model';
import { map, Observable } from 'rxjs';
import { TransfersResponseBody } from '@app/core/api/transfer/transfers-response-body.model';
import { PlayerInput, PlayerInputRequestBody } from './player-input-request-body.model';
import { PlayerMatchStat } from '@app/core/api';
import { PlayerMatchStatsResponseBody } from '@app/core/api/player/player-match-stats-response-body.model';
import { PlayerResponseBody } from './player-response-body.model';
import { PlayerSearchResultsResponseBody } from './player-search-results-response-body.model';
import { PlayerSeasonStatsResponseBody } from './player-season-stats-response-body.model';
import { PlayerTransferContextResponseBody } from './player-transfer-context-response-body.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerApiService {
  readonly namespace = 'players';
  private apiService = inject(ApiService);

  createPlayer(player: PlayerInput): Observable<Player> {
    const body: PlayerInputRequestBody = { player };
    return this.apiService
      .post<PlayerResponseBody>(this.namespace, undefined, body)
      .pipe(map((result) => result.player));
  }

  getById(id: number): Observable<Player> {
    return this.apiService
      .get<PlayerResponseBody>({
        namespace: this.namespace,
        id: id,
      })
      .pipe(map((result) => result.player));
  }

  updatePlayer(playerId: number, player: PlayerInput): Observable<Player> {
    const body: PlayerInputRequestBody = { player };
    return this.apiService
      .put<PlayerResponseBody>(this.namespace, playerId, body)
      .pipe(map((result) => result.player));
  }

  getPlayerSeasonStatsByPlayerId(playerId: number): Observable<PlayerSeasonStat[]> {
    return this.apiService
      .get<PlayerSeasonStatsResponseBody>({
        namespace: this.namespace,
        id: playerId,
        endpoint: 'player-season-stats',
      })
      .pipe(map((result) => result.playerSeasonStats));
  }

  getPlayerMatchStatsByPlayerIdAndSeasonId(
    playerId: number,
    seasonId: number,
  ): Observable<PlayerMatchStat[]> {
    const params = new HttpParams().set('seasonId', seasonId);
    return this.apiService
      .get<PlayerMatchStatsResponseBody>({
        namespace: this.namespace,
        id: playerId,
        endpoint: 'player-match-stats',
        options: { params: params },
      })
      .pipe(map((result) => result.playerMatchStats));
  }

  getTransfersByPlayerId(playerId: number): Observable<Transfer[]> {
    return this.apiService
      .get<TransfersResponseBody>({
        namespace: this.namespace,
        id: playerId,
        endpoint: 'transfers',
      })
      .pipe(map((result) => result.transfers));
  }

  getPlayerTransferContextByPlayerId(playerId: number): Observable<PlayerTransferContext> {
    return this.apiService
      .get<PlayerTransferContextResponseBody>({
        namespace: this.namespace,
        id: playerId,
        endpoint: 'player-transfer-context',
      })
      .pipe(map((result) => result.playerTransferContext));
  }

  search(name: string): Observable<PlayerSearchResult[]> {
    const params = new HttpParams().set('name', name);

    return this.apiService
      .get<PlayerSearchResultsResponseBody>({
        namespace: this.namespace,
        endpoint: 'search',
        options: { params: params },
      })
      .pipe(map((result) => result.players));
  }
}
