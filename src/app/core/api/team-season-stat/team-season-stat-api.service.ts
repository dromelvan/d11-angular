import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { TeamSeasonStat } from '@app/core/api/model/team-season-stat.model';
import { TeamSeasonStatsResponseBody } from './team-season-stats-response-body.model';

@Injectable({
  providedIn: 'root',
})
export class TeamSeasonStatApiService {
  readonly namespace = 'team-season-stats';

  private apiService = inject(ApiService);

  getTeamSeasonStatsBySeasonId(seasonId: number): Observable<TeamSeasonStat[]> {
    const params = new HttpParams().set('seasonId', seasonId);
    return this.apiService
      .get<TeamSeasonStatsResponseBody>({
        namespace: this.namespace,
        options: { params },
      })
      .pipe(map((result) => result.teamSeasonStats));
  }
}
