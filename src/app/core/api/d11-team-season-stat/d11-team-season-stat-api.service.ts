import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { D11TeamSeasonStat } from '@app/core/api/model/d11-team-season-stat.model';
import { D11TeamSeasonStatsResponseBody } from './d11-team-season-stats-response-body.model';

@Injectable({ providedIn: 'root' })
export class D11TeamSeasonStatApiService {
  readonly namespace = 'd11-team-season-stats';
  private apiService = inject(ApiService);

  getD11TeamSeasonStatsBySeasonId(seasonId: number): Observable<D11TeamSeasonStat[]> {
    const params = new HttpParams().set('seasonId', seasonId);
    return this.apiService
      .get<D11TeamSeasonStatsResponseBody>({ namespace: this.namespace, options: { params } })
      .pipe(map((result) => result.d11TeamSeasonStats));
  }
}
