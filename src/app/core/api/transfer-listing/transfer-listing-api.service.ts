import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { TransferListing } from '@app/core/api/model/transfer-listing.model';
import { TransferListingsResponseBody } from './transfer-listings-response-body.model';

@Injectable({
  providedIn: 'root',
})
export class TransferListingApiService {
  readonly namespace = 'transfer-listings';
  private apiService = inject(ApiService);

  getTransferListingsByTransferDayId(
    transferDayId: number,
    page?: number,
    dummy?: boolean,
  ): Observable<TransferListing[]> {
    let params = new HttpParams().set('transferDayId', transferDayId);

    if (page !== undefined) {
      params = params.set('page', page);
    }

    if (dummy !== undefined) {
      params = params.set('dummy', dummy);
    }

    return this.apiService
      .get<TransferListingsResponseBody>({
        namespace: this.namespace,
        options: { params },
      })
      .pipe(map((result) => result.transferListings));
  }
}
