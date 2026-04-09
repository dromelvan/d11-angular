import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { fakeTransferWindow, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe } from 'vitest';
import { TransferWindowApiService } from './transfer-window-api.service';
import { TransferWindowResponseBody } from './transfer-window-response-body.model';
import { TransferWindowsResponseBody } from './transfer-windows-response-body.model';

describe('TransferWindowApiService', () => {
  let transferWindowApi: TransferWindowApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransferWindowApiService,
        { provide: ApiService, useValue: { get: vi.fn() as GetFn } },
      ],
    });

    transferWindowApi = TestBed.inject(TransferWindowApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
  });

  it('is created', () => {
    expect(transferWindowApi).toBeTruthy();
  });

  // getTransferWindowsBySeasonId ------------------------------------------------------------------

  describe('getTransferWindowsBySeasonId', () => {
    const seasonId = 1;
    const transferWindows = [fakeTransferWindow(), fakeTransferWindow()];
    const response: TransferWindowsResponseBody = { transferWindows };

    it('calls get', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(transferWindowApi.getTransferWindowsBySeasonId(seasonId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: transferWindowApi.namespace,
          options: expect.objectContaining({ params: expect.any(HttpParams) }),
        }),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('seasonId')).toBe(String(seasonId));
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(transferWindowApi.getTransferWindowsBySeasonId(seasonId));

      expect(result).toEqual(transferWindows);
    });

    it('propagates errors', async () => {
      const httpError = new Error('BAD_REQUEST');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(transferWindowApi.getTransferWindowsBySeasonId(seasonId)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('BAD_REQUEST'))) as GetFn;

      expect(
        firstValueFrom(transferWindowApi.getTransferWindowsBySeasonId(seasonId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // getTransferWindowById -------------------------------------------------------------------------

  describe('getTransferWindowById', () => {
    const transferWindow = fakeTransferWindow();
    const matchWeek = transferWindow.matchWeek;
    const season = transferWindow.season;
    const transferDays = transferWindow.transferDays!;
    const response: TransferWindowResponseBody = {
      transferWindow,
      matchWeek,
      season,
      transferDays,
    };

    it('calls get', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(transferWindowApi.getTransferWindowById(transferWindow.id));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: transferWindowApi.namespace,
          id: transferWindow.id,
        }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(
        transferWindowApi.getTransferWindowById(transferWindow.id),
      );

      expect(result).toEqual(transferWindow);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(transferWindowApi.getTransferWindowById(transferWindow.id)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(
        firstValueFrom(transferWindowApi.getTransferWindowById(transferWindow.id)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // getCurrentTransferWindow ----------------------------------------------------------------------

  describe('getCurrentTransferWindow', () => {
    const transferWindow = fakeTransferWindow();
    const matchWeek = transferWindow.matchWeek;
    const season = transferWindow.season;
    const transferDays = transferWindow.transferDays!;
    const response: TransferWindowResponseBody = {
      transferWindow,
      matchWeek,
      season,
      transferDays,
    };

    it('calls get', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(transferWindowApi.getCurrentTransferWindow());

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: transferWindowApi.namespace,
          endpoint: 'current',
        }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(transferWindowApi.getCurrentTransferWindow());

      expect(result).toEqual(transferWindow);
    });

    it('propagates errors', async () => {
      const httpError = new Error('INTERNAL_SERVER_ERROR');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(transferWindowApi.getCurrentTransferWindow())).rejects.toThrow(
        httpError.message,
      );
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('INTERNAL_SERVER_ERROR'))) as GetFn;

      expect(firstValueFrom(transferWindowApi.getCurrentTransferWindow())).rejects.toBeInstanceOf(
        Error,
      );
    });
  });
});
