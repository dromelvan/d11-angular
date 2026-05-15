import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { DeleteFn, fakeTransferBid, GetFn, PatchFn, PostFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe } from 'vitest';
import { CreateTransferBidRequestBody } from './create-transfer-bid-request-body.model';
import { TransferBidApiService } from './transfer-bid-api.service';
import { TransferBidResponseBody } from './transfer-bid-response-body.model';
import { TransferBidsResponseBody } from './transfer-bids-response-body.model';
import { UpdateTransferBidFeeRequestBody } from './update-transfer-bid-fee-request-body.model';

describe('TransferBidApiService', () => {
  let transferBidApi: TransferBidApiService;
  let apiServiceMock: { get: GetFn; post: PostFn; patch: PatchFn; delete: DeleteFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransferBidApiService,
        {
          provide: ApiService,
          useValue: {
            get: vi.fn() as GetFn,
            post: vi.fn() as PostFn,
            patch: vi.fn() as PatchFn,
            delete: vi.fn() as DeleteFn,
          },
        },
      ],
    });

    transferBidApi = TestBed.inject(TransferBidApiService);
    apiServiceMock = TestBed.inject(ApiService) as {
      get: GetFn;
      post: PostFn;
      patch: PatchFn;
      delete: DeleteFn;
    };
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

  // getTransferBidsByTransferDayIdAndPlayerId -----------------------------------------------------

  describe('getTransferBidsByTransferDayIdAndPlayerId', () => {
    const transferDayId = 1;
    const playerId = 2;
    const transferBids = [fakeTransferBid(), fakeTransferBid()];
    const response: TransferBidsResponseBody = { transferBids };

    it('calls get', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(
        transferBidApi.getTransferBidsByTransferDayIdAndPlayerId(transferDayId, playerId),
      );

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: transferBidApi.namespace,
          options: expect.objectContaining({ params: expect.any(HttpParams) }),
        }),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('transferDayId')).toBe(String(transferDayId));
      expect(calledParams.get('playerId')).toBe(String(playerId));
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(
        transferBidApi.getTransferBidsByTransferDayIdAndPlayerId(transferDayId, playerId),
      );

      expect(result).toEqual(transferBids);
    });

    it('propagates errors', async () => {
      const httpError = new Error('BAD_REQUEST');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(
          transferBidApi.getTransferBidsByTransferDayIdAndPlayerId(transferDayId, playerId),
        ),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('BAD_REQUEST'))) as GetFn;

      expect(
        firstValueFrom(
          transferBidApi.getTransferBidsByTransferDayIdAndPlayerId(transferDayId, playerId),
        ),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // createTransferBid ----------------------------------------------------------------------------

  describe('createTransferBid', () => {
    const transferBid = fakeTransferBid();
    const response: TransferBidResponseBody = { transferBid };
    const body: CreateTransferBidRequestBody = { transferBid: { playerId: 1, fee: 10 } };

    it('calls post with namespace and body', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(response)) as PostFn;

      await firstValueFrom(transferBidApi.createTransferBid(body));

      expect(apiServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        transferBidApi.namespace,
        undefined,
        body,
      );
    });

    it('maps the result', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(response)) as PostFn;

      const result = await firstValueFrom(transferBidApi.createTransferBid(body));

      expect(result).toEqual(transferBid);
    });

    it('propagates errors', async () => {
      const error = new Error('CONFLICT');
      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => error)) as PostFn;

      await expect(firstValueFrom(transferBidApi.createTransferBid(body))).rejects.toThrow(
        error.message,
      );
    });

    it('does not map the result on error', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => new Error())) as PostFn;

      await expect(firstValueFrom(transferBidApi.createTransferBid(body))).rejects.toBeInstanceOf(
        Error,
      );
    });
  });

  // updateTransferBidFee -------------------------------------------------------------------------

  describe('updateTransferBidFee', () => {
    const transferBidId = 1;
    const transferBid = fakeTransferBid();
    const response: TransferBidResponseBody = { transferBid };
    const body: UpdateTransferBidFeeRequestBody = { transferBid: { fee: 20 } };

    it('calls patch with namespace, id and body', async () => {
      apiServiceMock.patch = vi.fn().mockReturnValue(of(response)) as PatchFn;

      await firstValueFrom(transferBidApi.updateTransferBidFee(transferBidId, body));

      expect(apiServiceMock.patch).toHaveBeenCalledExactlyOnceWith(
        transferBidApi.namespace,
        transferBidId,
        body,
      );
    });

    it('maps the result', async () => {
      apiServiceMock.patch = vi.fn().mockReturnValue(of(response)) as PatchFn;

      const result = await firstValueFrom(transferBidApi.updateTransferBidFee(transferBidId, body));

      expect(result).toEqual(transferBid);
    });

    it('propagates errors', async () => {
      const error = new Error('NOT_FOUND');
      apiServiceMock.patch = vi.fn().mockReturnValue(throwError(() => error)) as PatchFn;

      await expect(
        firstValueFrom(transferBidApi.updateTransferBidFee(transferBidId, body)),
      ).rejects.toThrow(error.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.patch = vi.fn().mockReturnValue(throwError(() => new Error())) as PatchFn;

      await expect(
        firstValueFrom(transferBidApi.updateTransferBidFee(transferBidId, body)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // deleteTransferBid ----------------------------------------------------------------------------

  describe('deleteTransferBid', () => {
    const transferBidId = 1;

    it('calls delete with namespace and id', async () => {
      apiServiceMock.delete = vi.fn().mockReturnValue(of(undefined)) as DeleteFn;

      await firstValueFrom(transferBidApi.deleteTransferBid(transferBidId));

      expect(apiServiceMock.delete).toHaveBeenCalledExactlyOnceWith(
        transferBidApi.namespace,
        transferBidId,
      );
    });

    it('propagates errors', async () => {
      const error = new Error('NOT_FOUND');
      apiServiceMock.delete = vi.fn().mockReturnValue(throwError(() => error)) as DeleteFn;

      await expect(firstValueFrom(transferBidApi.deleteTransferBid(transferBidId))).rejects.toThrow(
        error.message,
      );
    });
  });
});
