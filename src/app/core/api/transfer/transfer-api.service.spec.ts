import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { DeleteFn, fakeTransfer, GetFn, PostFn, PutFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe } from 'vitest';
import { CreateTransferRequestBody } from './create-transfer-request-body.model';
import { TransferApiService } from './transfer-api.service';
import { TransferResponseBody } from './transfer-response-body.model';
import { TransfersResponseBody } from './transfers-response-body.model';
import { UpdateTransferRequestBody } from './update-transfer-request-body.model';

describe('TransferApiService', () => {
  let transferApi: TransferApiService;
  let apiServiceMock: { get: GetFn; post: PostFn; put: PutFn; delete: DeleteFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransferApiService,
        {
          provide: ApiService,
          useValue: {
            get: vi.fn() as GetFn,
            post: vi.fn() as PostFn,
            put: vi.fn() as PutFn,
            delete: vi.fn() as DeleteFn,
          },
        },
      ],
    });

    transferApi = TestBed.inject(TransferApiService);
    apiServiceMock = TestBed.inject(ApiService) as {
      get: GetFn;
      post: PostFn;
      put: PutFn;
      delete: DeleteFn;
    };
  });

  it('is created', () => {
    expect(transferApi).toBeTruthy();
  });

  // getTransfersByTransferDayId -------------------------------------------------------------------

  describe('getTransfersByTransferDayId', () => {
    const transferDayId = 1;
    const transfers = [fakeTransfer(), fakeTransfer()];
    const response: TransfersResponseBody = { transfers };

    it('calls get', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(transferApi.getTransfersByTransferDayId(transferDayId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: transferApi.namespace,
          options: expect.objectContaining({ params: expect.any(HttpParams) }),
        }),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('transferDayId')).toBe(String(transferDayId));
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(transferApi.getTransfersByTransferDayId(transferDayId));

      expect(result).toEqual(transfers);
    });

    it('propagates errors', async () => {
      const httpError = new Error('BAD_REQUEST');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(transferApi.getTransfersByTransferDayId(transferDayId)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('BAD_REQUEST'))) as GetFn;

      expect(
        firstValueFrom(transferApi.getTransfersByTransferDayId(transferDayId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // createTransfer -------------------------------------------------------------------------------

  describe('createTransfer', () => {
    const transfer = fakeTransfer();
    const response: TransferResponseBody = { transfer };
    const body: CreateTransferRequestBody = {
      transfer: { fee: 10, transferDayId: 1, playerId: 1, d11TeamId: 1 },
    };

    it('calls post with namespace and body', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(response)) as PostFn;

      await firstValueFrom(transferApi.createTransfer(body));

      expect(apiServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        transferApi.namespace,
        undefined,
        body,
      );
    });

    it('maps the result', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(response)) as PostFn;

      const result = await firstValueFrom(transferApi.createTransfer(body));

      expect(result).toEqual(transfer);
    });

    it('propagates errors', async () => {
      const error = new Error('BAD_REQUEST');
      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => error)) as PostFn;

      await expect(firstValueFrom(transferApi.createTransfer(body))).rejects.toThrow(error.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => new Error())) as PostFn;

      await expect(firstValueFrom(transferApi.createTransfer(body))).rejects.toBeInstanceOf(Error);
    });
  });

  // updateTransfer -------------------------------------------------------------------------------

  describe('updateTransfer', () => {
    const transferId = 1;
    const transfer = fakeTransfer();
    const response: TransferResponseBody = { transfer };
    const body: UpdateTransferRequestBody = {
      transfer: { fee: 15, transferDayId: 1, playerId: 1, d11TeamId: 1 },
    };

    it('calls put with namespace, id and body', async () => {
      apiServiceMock.put = vi.fn().mockReturnValue(of(response)) as PutFn;

      await firstValueFrom(transferApi.updateTransfer(transferId, body));

      expect(apiServiceMock.put).toHaveBeenCalledExactlyOnceWith(
        transferApi.namespace,
        transferId,
        body,
      );
    });

    it('maps the result', async () => {
      apiServiceMock.put = vi.fn().mockReturnValue(of(response)) as PutFn;

      const result = await firstValueFrom(transferApi.updateTransfer(transferId, body));

      expect(result).toEqual(transfer);
    });

    it('propagates errors', async () => {
      const error = new Error('NOT_FOUND');
      apiServiceMock.put = vi.fn().mockReturnValue(throwError(() => error)) as PutFn;

      await expect(firstValueFrom(transferApi.updateTransfer(transferId, body))).rejects.toThrow(
        error.message,
      );
    });

    it('does not map the result on error', async () => {
      apiServiceMock.put = vi.fn().mockReturnValue(throwError(() => new Error())) as PutFn;

      await expect(
        firstValueFrom(transferApi.updateTransfer(transferId, body)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // deleteTransfer -------------------------------------------------------------------------------

  describe('deleteTransfer', () => {
    const transferId = 1;

    it('calls delete with namespace and id', async () => {
      apiServiceMock.delete = vi.fn().mockReturnValue(of(undefined)) as DeleteFn;

      await firstValueFrom(transferApi.deleteTransfer(transferId));

      expect(apiServiceMock.delete).toHaveBeenCalledExactlyOnceWith(
        transferApi.namespace,
        transferId,
      );
    });

    it('propagates errors', async () => {
      const error = new Error('NOT_FOUND');
      apiServiceMock.delete = vi.fn().mockReturnValue(throwError(() => error)) as DeleteFn;

      await expect(firstValueFrom(transferApi.deleteTransfer(transferId))).rejects.toThrow(
        error.message,
      );
    });
  });
});
