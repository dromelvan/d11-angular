import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { PlayerSearchResult } from '@app/core/api/model/player-search-result.model';
import { PlayerSearchResultsResponseBody } from './player-search-results-response-body.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerApiService {
  readonly namespace = 'players';
  private apiService = inject(ApiService);

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
