import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { TransferDay } from '@app/core/api/model/transfer-day.model';
import { TransferDayResponseBody } from './transfer-day-response-body.model';
import { TransferDaysResponseBody } from './transfer-days-response-body.model';

@Injectable({
  providedIn: 'root',
})
export class TransferDayApiService {
  readonly namespace = 'transfer-days';
  private apiService = inject(ApiService);

  getTransferDaysByTransferWindowId(transferWindowId: number): Observable<TransferDay[]> {
    const params = new HttpParams().set('transferWindowId', transferWindowId);
    return this.apiService
      .get<TransferDaysResponseBody>({
        namespace: this.namespace,
        options: { params },
      })
      .pipe(map((result) => result.transferDays));
  }

  getTransferDayById(id: number): Observable<TransferDay> {
    return this.apiService
      .get<TransferDayResponseBody>({
        namespace: this.namespace,
        id,
      })
      .pipe(map((result) => result.transferDay));
  }

  getCurrentTransferDay(): Observable<TransferDay> {
    return this.apiService
      .get<TransferDayResponseBody>({
        namespace: this.namespace,
        endpoint: 'current',
      })
      .pipe(map((result) => result.transferDay));
  }
}
