import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { TeamSeasonStat } from '@app/core/api/model/team-season-stat.model';
import { TeamSeasonStatResponseBody } from './team-season-stat-response-body.model';

@Injectable({
  providedIn: 'root',
})
export class TeamSeasonStatApiService {
  readonly namespace = 'team-season-stats';

  private apiService = inject(ApiService);

  getTeamSeasonStatByTeamIdAndSeasonId(teamId: number, seasonId: number): Observable<TeamSeasonStat> {
    const params = new HttpParams().set('seasonId', seasonId);
    return this.apiService
      .get<TeamSeasonStatResponseBody>({
        namespace: this.namespace,
        id: teamId,
        endpoint: 'team-season-stats',
        options: { params: params },
      })
      .pipe(map((result) => result.teamSeasonStat));
  }
}
