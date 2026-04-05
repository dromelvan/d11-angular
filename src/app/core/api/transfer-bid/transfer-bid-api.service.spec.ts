import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { fakeTransferBid, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe } from 'vitest';
import { TransferBidApiService } from './transfer-bid-api.service';
import { TransferBidsResponseBody } from './transfer-bids-response-body.model';

describe('TransferBidApiService', () => {
  let transferBidApi: TransferBidApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransferBidApiService,
        { provide: ApiService, useValue: { get: vi.fn() as GetFn } },
      ],
    });

    transferBidApi = TestBed.inject(TransferBidApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
  });

  it('is created', () => {
    expect(transferBidApi).toBeTruthy();
  });

  // getTransferBidsByTransferDayId ----------------------------------------------------------------

  describe('getTransferBidsByTransferDayId', () => {
    const transferDayId = 1;
    const transferBids = [fakeTransferBid(), fakeTransferBid()];
    const response: TransferBidsResponseBody = { transferBids };

    it('calls get', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(transferBidApi.getTransferBidsByTransferDayId(transferDayId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: transferBidApi.namespace,
          options: expect.objectContaining({ params: expect.any(HttpParams) }),
        }),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('transferDayId')).toBe(String(transferDayId));
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(
        transferBidApi.getTransferBidsByTransferDayId(transferDayId),
      );

      expect(result).toEqual(transferBids);
    });

    it('propagates errors', async () => {
      const httpError = new Error('BAD_REQUEST');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(transferBidApi.getTransferBidsByTransferDayId(transferDayId)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('BAD_REQUEST'))) as GetFn;

      expect(
        firstValueFrom(transferBidApi.getTransferBidsByTransferDayId(transferDayId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });
});
