import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { Transfer } from '@app/core/api/model/transfer.model';
import { CreateTransferRequestBody } from './create-transfer-request-body.model';
import { TransferResponseBody } from './transfer-response-body.model';
import { TransfersResponseBody } from './transfers-response-body.model';
import { UpdateTransferRequestBody } from './update-transfer-request-body.model';

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

  createTransfer(body: CreateTransferRequestBody): Observable<Transfer> {
    return this.apiService
      .post<TransferResponseBody>(this.namespace, undefined, body)
      .pipe(map((result) => result.transfer));
  }

  updateTransfer(transferId: number, body: UpdateTransferRequestBody): Observable<Transfer> {
    return this.apiService
      .put<TransferResponseBody>(this.namespace, transferId, body)
      .pipe(map((result) => result.transfer));
  }

  deleteTransfer(transferId: number): Observable<void> {
    return this.apiService.delete(this.namespace, transferId);
  }
}
