import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { DeleteFn, fakeTransferListing, GetFn, PostFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe } from 'vitest';
import { CreateTransferListingRequestBody } from './create-transfer-listing-request-body.model';
import { TransferListingApiService } from './transfer-listing-api.service';
import { TransferListingResponseBody } from './transfer-listing-response-body.model';
import { TransferListingsResponseBody } from './transfer-listings-response-body.model';

describe('TransferListingApiService', () => {
  let transferListingApi: TransferListingApiService;
  let apiServiceMock: { get: GetFn; post: PostFn; delete: DeleteFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransferListingApiService,
        {
          provide: ApiService,
          useValue: {
            get: vi.fn() as GetFn,
            post: vi.fn() as PostFn,
            delete: vi.fn() as DeleteFn,
          },
        },
      ],
    });

    transferListingApi = TestBed.inject(TransferListingApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn; post: PostFn; delete: DeleteFn };
  });

  it('is created', () => {
    expect(transferListingApi).toBeTruthy();
  });

  // getTransferListingsByTransferDayId ------------------------------------------------------------

  describe('getTransferListingsByTransferDayId', () => {
    const transferDayId = 1;
    const page = 2;
    const transferListings = [fakeTransferListing(), fakeTransferListing()];
    const response: TransferListingsResponseBody = { transferListings };

    it('calls get', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(
        transferListingApi.getTransferListingsByTransferDayId(transferDayId, page),
      );

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: transferListingApi.namespace,
          options: expect.objectContaining({ params: expect.any(HttpParams) }),
        }),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('transferDayId')).toBe(String(transferDayId));
      expect(calledParams.get('page')).toBe(String(page));
    });

    it('calls get without page', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(transferListingApi.getTransferListingsByTransferDayId(transferDayId));

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.has('page')).toBe(false);
    });

    it('calls get without dummy', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(
        transferListingApi.getTransferListingsByTransferDayId(transferDayId, page),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.has('dummy')).toBe(false);
    });

    it('calls get with dummy true', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(
        transferListingApi.getTransferListingsByTransferDayId(transferDayId, page, true),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('dummy')).toBe('true');
    });

    it('calls get with dummy false', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(
        transferListingApi.getTransferListingsByTransferDayId(transferDayId, page, false),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('dummy')).toBe('false');
    });

    it('calls get unpaged without dummy', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(transferListingApi.getTransferListingsByTransferDayId(transferDayId));

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.has('page')).toBe(false);
      expect(calledParams.has('dummy')).toBe(false);
    });

    it('calls get unpaged with dummy false', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(
        transferListingApi.getTransferListingsByTransferDayId(transferDayId, undefined, false),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.has('page')).toBe(false);
      expect(calledParams.get('dummy')).toBe('false');
    });

    it('calls get unpaged with dummy true', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(
        transferListingApi.getTransferListingsByTransferDayId(transferDayId, undefined, true),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.has('page')).toBe(false);
      expect(calledParams.get('dummy')).toBe('true');
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(
        transferListingApi.getTransferListingsByTransferDayId(transferDayId, page),
      );

      expect(result).toEqual(transferListings);
    });

    it('propagates errors', async () => {
      const httpError = new Error('BAD_REQUEST');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(transferListingApi.getTransferListingsByTransferDayId(transferDayId, page)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('BAD_REQUEST'))) as GetFn;

      expect(
        firstValueFrom(transferListingApi.getTransferListingsByTransferDayId(transferDayId, page)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // createTransferListing -------------------------------------------------------------------------

  describe('createTransferListing', () => {
    const transferListing = fakeTransferListing();
    const response: TransferListingResponseBody = { transferListing };
    const body: CreateTransferListingRequestBody = { playerId: 1 };

    it('calls post with namespace and body', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(response)) as PostFn;

      await firstValueFrom(transferListingApi.createTransferListing(body));

      expect(apiServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        transferListingApi.namespace,
        undefined,
        body,
      );
    });

    it('maps the result', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(response)) as PostFn;

      const result = await firstValueFrom(transferListingApi.createTransferListing(body));

      expect(result).toEqual(transferListing);
    });

    it('propagates errors', async () => {
      const error = new Error('CONFLICT');
      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => error)) as PostFn;

      await expect(firstValueFrom(transferListingApi.createTransferListing(body))).rejects.toThrow(
        error.message,
      );
    });

    it('does not map the result on error', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => new Error())) as PostFn;

      await expect(
        firstValueFrom(transferListingApi.createTransferListing(body)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // deleteTransferListing -------------------------------------------------------------------------

  describe('deleteTransferListing', () => {
    const transferListingId = 1;

    it('calls delete with namespace and id', async () => {
      apiServiceMock.delete = vi.fn().mockReturnValue(of(undefined)) as DeleteFn;

      await firstValueFrom(transferListingApi.deleteTransferListing(transferListingId));

      expect(apiServiceMock.delete).toHaveBeenCalledExactlyOnceWith(
        transferListingApi.namespace,
        transferListingId,
      );
    });

    it('propagates errors', async () => {
      const error = new Error('NOT_FOUND');
      apiServiceMock.delete = vi.fn().mockReturnValue(throwError(() => error)) as DeleteFn;

      await expect(
        firstValueFrom(transferListingApi.deleteTransferListing(transferListingId)),
      ).rejects.toThrow(error.message);
    });
  });
});
