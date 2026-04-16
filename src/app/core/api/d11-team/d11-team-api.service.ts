import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { PlayerSeasonStat } from '@app/core/api/model/player-season-stat.model';
import { PlayerSeasonStatsResponseBody } from './player-season-stats-response-body.model';

@Injectable({ providedIn: 'root' })
export class D11TeamApiService {
  readonly namespace = 'd11-teams';
  private apiService = inject(ApiService);

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
}
