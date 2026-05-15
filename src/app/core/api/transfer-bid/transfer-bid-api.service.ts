import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { TransferBid } from '@app/core/api/model/transfer-bid.model';
import { CreateTransferBidRequestBody } from './create-transfer-bid-request-body.model';
import { TransferBidResponseBody } from './transfer-bid-response-body.model';
import { TransferBidsResponseBody } from './transfer-bids-response-body.model';
import { UpdateTransferBidFeeRequestBody } from './update-transfer-bid-fee-request-body.model';

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

  getTransferBidsByTransferDayIdAndPlayerId(
    transferDayId: number,
    playerId: number,
  ): Observable<TransferBid[]> {
    const params = new HttpParams().set('transferDayId', transferDayId).set('playerId', playerId);

    return this.apiService
      .get<TransferBidsResponseBody>({
        namespace: this.namespace,
        options: { params },
      })
      .pipe(map((result) => result.transferBids));
  }

  createTransferBid(body: CreateTransferBidRequestBody): Observable<TransferBid> {
    return this.apiService
      .post<TransferBidResponseBody>(this.namespace, undefined, body)
      .pipe(map((result) => result.transferBid));
  }

  updateTransferBidFee(
    transferBidId: number,
    body: UpdateTransferBidFeeRequestBody,
  ): Observable<TransferBid> {
    return this.apiService
      .patch<TransferBidResponseBody>(this.namespace, transferBidId, body)
      .pipe(map((result) => result.transferBid));
  }

  deleteTransferBid(transferBidId: number): Observable<void> {
    return this.apiService.delete(this.namespace, transferBidId);
  }
}
