import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { TransferBid } from '@app/core/api/model/transfer-bid.model';
import { TransferBidsResponseBody } from './transfer-bids-response-body.model';

@Injectable({
  providedIn: 'root',
})
export class TransferBidApiService {
  readonly namespace = 'transfer-bids';
  private apiService = inject(ApiService);

  getTransferBidsByTransferDayId(transferDayId: number): Observable<TransferBid[]> {
    const params = new HttpParams().set('transferDayId', transferDayId);
    return this.apiService
      .get<TransferBidsResponseBody>({
        namespace: this.namespace,
        options: { params },
      })
      .pipe(map((result) => result.transferBids));
  }
}
