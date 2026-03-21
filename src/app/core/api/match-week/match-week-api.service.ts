import { inject, Injectable } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { map, Observable } from 'rxjs';
import { MatchWeek } from '@app/core/api';
import { MatchWeekResponseBody } from './match-week-response-body.model';
import { MatchWeeksResponseBody } from './match-weeks-response-body.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MatchWeekApiService {
  readonly namespace = 'match-weeks';
  private apiService = inject(ApiService);

  getById(id: number): Observable<MatchWeek> {
    return this.apiService
      .get<MatchWeekResponseBody>({
        namespace: this.namespace,
        id: id,
      })
      .pipe(map((result) => result.matchWeek));
  }

  getMatchWeeksBySeasonId(seasonId: number): Observable<MatchWeek[]> {
    const params = new HttpParams().set('seasonId', seasonId);
    return this.apiService
      .get<MatchWeeksResponseBody>({
        namespace: this.namespace,
        options: { params: params },
      })
      .pipe(map((result) => result.matchWeeks));
  }
}
