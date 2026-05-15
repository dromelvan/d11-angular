import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { fakeTransferDay, GetFn, PatchFn, PutFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe } from 'vitest';
import { Status } from '@app/core/api/model/status.model';
import { TransferDayApiService } from './transfer-day-api.service';
import { TransferDayResponseBody } from './transfer-day-response-body.model';
import { TransferDaysResponseBody } from './transfer-days-response-body.model';
import { UpdateTransferDayRequestBody } from './update-transfer-day-request-body.model';
import { UpdateTransferDayStatusRequestBody } from './update-transfer-day-status-request-body.model';

describe('TransferDayApiService', () => {
  let transferDayApi: TransferDayApiService;
  let apiServiceMock: { get: GetFn; put: PutFn; patch: PatchFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransferDayApiService,
        {
          provide: ApiService,
          useValue: {
            get: vi.fn() as GetFn,
            put: vi.fn() as PutFn,
            patch: vi.fn() as PatchFn,
          },
        },
      ],
    });

    transferDayApi = TestBed.inject(TransferDayApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn; put: PutFn; patch: PatchFn };
  });

  it('is created', () => {
    expect(transferDayApi).toBeTruthy();
  });

  // getTransferDaysByTransferWindowId -------------------------------------------------------------

  describe('getTransferDaysByTransferWindowId', () => {
    const transferWindowId = 1;
    const transferDays = [fakeTransferDay(), fakeTransferDay()];
    const response: TransferDaysResponseBody = { transferDays };

    it('calls get', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(transferDayApi.getTransferDaysByTransferWindowId(transferWindowId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: transferDayApi.namespace,
          options: expect.objectContaining({ params: expect.any(HttpParams) }),
        }),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('transferWindowId')).toBe(String(transferWindowId));
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(
        transferDayApi.getTransferDaysByTransferWindowId(transferWindowId),
      );

      expect(result).toEqual(transferDays);
    });

    it('propagates errors', async () => {
      const httpError = new Error('BAD_REQUEST');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(transferDayApi.getTransferDaysByTransferWindowId(transferWindowId)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('BAD_REQUEST'))) as GetFn;

      expect(
        firstValueFrom(transferDayApi.getTransferDaysByTransferWindowId(transferWindowId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // getTransferDayById ----------------------------------------------------------------------------

  describe('getTransferDayById', () => {
    const transferDay = fakeTransferDay();
    const response: TransferDayResponseBody = { transferDay };

    it('calls get', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(transferDayApi.getTransferDayById(transferDay.id));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: transferDayApi.namespace,
          id: transferDay.id,
        }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(transferDayApi.getTransferDayById(transferDay.id));

      expect(result).toEqual(transferDay);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(transferDayApi.getTransferDayById(transferDay.id))).rejects.toThrow(
        httpError.message,
      );
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(
        firstValueFrom(transferDayApi.getTransferDayById(transferDay.id)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // updateTransferDay -----------------------------------------------------------------------------

  describe('updateTransferDay', () => {
    const transferDay = fakeTransferDay();
    const response: TransferDayResponseBody = { transferDay };
    const body: UpdateTransferDayRequestBody = {
      transferDay: {
        transferDayNumber: 1,
        status: Status.ACTIVE,
        datetime: '2024-01-01T00:00:00',
      },
    };

    it('calls put with namespace, id and body', async () => {
      apiServiceMock.put = vi.fn().mockReturnValue(of(response)) as PutFn;

      await firstValueFrom(transferDayApi.updateTransferDay(transferDay.id, body));

      expect(apiServiceMock.put).toHaveBeenCalledExactlyOnceWith(
        transferDayApi.namespace,
        transferDay.id,
        body,
      );
    });

    it('maps the result', async () => {
      apiServiceMock.put = vi.fn().mockReturnValue(of(response)) as PutFn;

      const result = await firstValueFrom(transferDayApi.updateTransferDay(transferDay.id, body));

      expect(result).toEqual(transferDay);
    });

    it('propagates errors', async () => {
      const error = new Error('NOT_FOUND');
      apiServiceMock.put = vi.fn().mockReturnValue(throwError(() => error)) as PutFn;

      await expect(
        firstValueFrom(transferDayApi.updateTransferDay(transferDay.id, body)),
      ).rejects.toThrow(error.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.put = vi.fn().mockReturnValue(throwError(() => new Error())) as PutFn;

      await expect(
        firstValueFrom(transferDayApi.updateTransferDay(transferDay.id, body)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // updateTransferDayStatus -----------------------------------------------------------------------

  describe('updateTransferDayStatus', () => {
    const transferDay = fakeTransferDay();
    const response: TransferDayResponseBody = { transferDay };
    const body: UpdateTransferDayStatusRequestBody = {
      transferDay: { status: Status.ACTIVE, process: true },
    };

    it('calls patch with namespace, id and body', async () => {
      apiServiceMock.patch = vi.fn().mockReturnValue(of(response)) as PatchFn;

      await firstValueFrom(transferDayApi.updateTransferDayStatus(transferDay.id, body));

      expect(apiServiceMock.patch).toHaveBeenCalledExactlyOnceWith(
        transferDayApi.namespace,
        transferDay.id,
        body,
      );
    });

    it('maps the result', async () => {
      apiServiceMock.patch = vi.fn().mockReturnValue(of(response)) as PatchFn;

      const result = await firstValueFrom(
        transferDayApi.updateTransferDayStatus(transferDay.id, body),
      );

      expect(result).toEqual(transferDay);
    });

    it('propagates errors', async () => {
      const error = new Error('NOT_FOUND');
      apiServiceMock.patch = vi.fn().mockReturnValue(throwError(() => error)) as PatchFn;

      await expect(
        firstValueFrom(transferDayApi.updateTransferDayStatus(transferDay.id, body)),
      ).rejects.toThrow(error.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.patch = vi.fn().mockReturnValue(throwError(() => new Error())) as PatchFn;

      await expect(
        firstValueFrom(transferDayApi.updateTransferDayStatus(transferDay.id, body)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // getCurrentTransferDay -------------------------------------------------------------------------

  describe('getCurrentTransferDay', () => {
    const transferDay = fakeTransferDay();
    const response: TransferDayResponseBody = { transferDay };

    it('calls get', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(transferDayApi.getCurrentTransferDay());

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: transferDayApi.namespace,
          endpoint: 'current',
        }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(transferDayApi.getCurrentTransferDay());

      expect(result).toEqual(transferDay);
    });

    it('propagates errors', async () => {
      const httpError = new Error('INTERNAL_SERVER_ERROR');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(transferDayApi.getCurrentTransferDay())).rejects.toThrow(
        httpError.message,
      );
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('INTERNAL_SERVER_ERROR'))) as GetFn;

      expect(firstValueFrom(transferDayApi.getCurrentTransferDay())).rejects.toBeInstanceOf(Error);
    });
  });
});
