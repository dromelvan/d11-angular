import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { Transfer } from '@app/core/api/model/transfer.model';
import { TransfersResponseBody } from './transfers-response-body.model';

@Injectable({
  providedIn: 'root',
})
export class TransferApiService {
  readonly namespace = 'transfers';
  private apiService = inject(ApiService);

  getTransfersByTransferDayId(transferDayId: number): Observable<Transfer[]> {
    const params = new HttpParams().set('transferDayId', transferDayId);
    return this.apiService
      .get<TransfersResponseBody>({
        namespace: this.namespace,
        options: { params },
      })
      .pipe(map((result) => result.transfers));
  }
}
