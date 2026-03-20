import { inject, Injectable } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { map, Observable } from 'rxjs';
import { MatchWeek } from '@app/core/api';
import { MatchWeekResponseBody } from '@app/core/api/match-week/match-week-response-body.model';

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
}
