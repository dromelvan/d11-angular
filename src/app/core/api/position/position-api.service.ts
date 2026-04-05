import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { LocalStorageCachedObservable } from '@app/core/api/local-storage-cache';
import { Position } from '@app/core/api/model/position.model';
import { PositionsResponseBody } from './positions-response-body.model';

@Injectable({
  providedIn: 'root',
})
export class PositionApiService {
  readonly namespace = 'positions';
  private apiService = inject(ApiService);

  private positionsCache = new LocalStorageCachedObservable<Position[]>(
    'positions',
    () =>
      this.apiService
        .get<PositionsResponseBody>({ namespace: this.namespace })
        .pipe(map((res) => res.positions)),
    24 * 60 * 60 * 1000,
  );

  getPositions(): Observable<Position[]> {
    return this.positionsCache.get();
  }
}
