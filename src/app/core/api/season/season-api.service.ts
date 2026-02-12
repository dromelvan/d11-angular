import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { LocalStorageCachedObservable } from '@app/core/api/local-storage-cache';
import { Season } from '@app/core/api/model/season.model';
import { SeasonsResponseBody } from './seasons-response-body.model';

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
}
