import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { LocalStorageCachedObservable } from '@app/core/api/local-storage-cache';
import { Season } from '@app/core/api/model/season.model';
import { SeasonWinners } from '@app/core/api/model/season-winners.model';
import { SeasonResponseBody } from './season-response-body.model';
import { SeasonWinnersResponseBody } from './season-winners-response-body.model';
import { SeasonsResponseBody } from './seasons-response-body.model';
import { UpdateSeasonRequestBody } from './update-season-request-body.model';

@Injectable({
  providedIn: 'root',
})
export class SeasonApiService {
  readonly namespace = 'seasons';

  private apiService = inject(ApiService);

  private seasonsCache = new LocalStorageCachedObservable<Season[]>(
    'seasons',
    () =>
      this.apiService
        .get<SeasonsResponseBody>({ namespace: this.namespace })
        .pipe(map((res) => res.seasons)),
    24 * 60 * 60 * 1000,
  );

  getAll(): Observable<Season[]> {
    return this.seasonsCache.get();
  }

  getCurrentSeason(): Observable<Season> {
    return this.seasonsCache
      .get()
      .pipe(map((seasons) => seasons.reduce((latest, s) => (s.date > latest.date ? s : latest))));
  }

  getSeasonById(seasonId: number): Observable<Season> {
    return this.apiService
      .get<SeasonResponseBody>({ namespace: this.namespace, id: seasonId })
      .pipe(map((result) => result.season));
  }

  updateSeason(seasonId: number, season: Season): Observable<Season> {
    const body: UpdateSeasonRequestBody = { season };
    return this.apiService
      .put<SeasonResponseBody>(this.namespace, seasonId, body)
      .pipe(map((result) => result.season));
  }

  getSeasonWinners(): Observable<SeasonWinners[]> {
    return this.apiService
      .get<SeasonWinnersResponseBody>({ namespace: this.namespace, endpoint: 'winners' })
      .pipe(map((result) => result.seasonWinners));
  }
}
