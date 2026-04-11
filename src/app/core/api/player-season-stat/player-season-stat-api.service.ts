import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { PlayerSeasonStatSort } from '../model/player-season-stat-sort.model';
import { PlayerSeasonStatsResponseBody } from './player-season-stats-response-body.model';
import { PlayerSeasonStatPage } from '@app/core/api';

@Injectable({
  providedIn: 'root',
})
export class PlayerSeasonStatApiService {
  readonly namespace = 'player-season-stats';
  private apiService = inject(ApiService);

  getPlayerSeasonStatsBySeasonId(
    seasonId: number,
    page: number,
    positionIds: number[],
    dummy?: boolean,
    sort?: PlayerSeasonStatSort,
  ): Observable<PlayerSeasonStatPage> {
    let params = new HttpParams().set('seasonId', seasonId).set('page', page);

    params = params.set('positionIds', positionIds.join(','));

    if (dummy !== undefined) {
      params = params.set('dummy', dummy);
    }

    if (sort !== undefined) {
      params = params.set('sort', sort);
    }

    return this.apiService
      .get<PlayerSeasonStatsResponseBody>({
        namespace: this.namespace,
        options: { params },
      })
      .pipe(map(({ playerSeasonStats, ...rest }) => ({ ...rest, elements: playerSeasonStats })));
  }
}
