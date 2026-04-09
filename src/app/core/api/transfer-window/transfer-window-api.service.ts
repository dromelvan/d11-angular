import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { TransferWindow } from '@app/core/api/model/transfer-window.model';
import { TransferWindowResponseBody } from './transfer-window-response-body.model';
import { TransferWindowsResponseBody } from './transfer-windows-response-body.model';

@Injectable({
  providedIn: 'root',
})
export class TransferWindowApiService {
  readonly namespace = 'transfer-windows';
  private apiService = inject(ApiService);

  getTransferWindowsBySeasonId(seasonId: number): Observable<TransferWindow[]> {
    const params = new HttpParams().set('seasonId', seasonId);
    return this.apiService
      .get<TransferWindowsResponseBody>({
        namespace: this.namespace,
        options: { params },
      })
      .pipe(map((result) => result.transferWindows));
  }

  getTransferWindowById(id: number): Observable<TransferWindow> {
    return this.apiService
      .get<TransferWindowResponseBody>({
        namespace: this.namespace,
        id,
      })
      .pipe(
        map((result) => ({
          ...result.transferWindow,
          matchWeek: result.matchWeek,
          season: result.season,
          transferDays: result.transferDays,
        })),
      );
  }

  getCurrentTransferWindow(): Observable<TransferWindow> {
    return this.apiService
      .get<TransferWindowResponseBody>({
        namespace: this.namespace,
        endpoint: 'current',
      })
      .pipe(
        map((result) => ({
          ...result.transferWindow,
          matchWeek: result.matchWeek,
          season: result.season,
          transferDays: result.transferDays,
        })),
      );
  }
}
