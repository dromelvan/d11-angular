import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { fakeTransfer, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe } from 'vitest';
import { TransferApiService } from './transfer-api.service';
import { TransfersResponseBody } from './transfers-response-body.model';

describe('TransferApiService', () => {
  let transferApi: TransferApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransferApiService,
        { provide: ApiService, useValue: { get: vi.fn() as GetFn } },
      ],
    });

    transferApi = TestBed.inject(TransferApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
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
});
