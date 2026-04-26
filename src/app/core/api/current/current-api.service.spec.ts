import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { fakeCurrent, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe } from 'vitest';
import { CurrentApiService } from './current-api.service';
import { CurrentResponseBody } from './current-response-body.model';

describe('CurrentApiService', () => {
  let currentApi: CurrentApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentApiService, { provide: ApiService, useValue: { get: vi.fn() as GetFn } }],
    });

    currentApi = TestBed.inject(CurrentApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
  });

  it('is created', () => {
    expect(currentApi).toBeTruthy();
  });

  // getCurrent ----------------------------------------------------------------------------

  describe('getCurrent', () => {
    const current = fakeCurrent();
    const currentResponse: CurrentResponseBody = current;

    it('calls get', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(currentResponse)) as GetFn;

      await firstValueFrom(currentApi.getCurrent());

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ namespace: currentApi.namespace }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(currentResponse)) as GetFn;

      const result = await firstValueFrom(currentApi.getCurrent());

      expect(result).toEqual(current);
    });

    it('propagates errors', async () => {
      const httpError = new Error('INTERNAL_SERVER_ERROR');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(currentApi.getCurrent())).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('INTERNAL_SERVER_ERROR'))) as GetFn;

      expect(firstValueFrom(currentApi.getCurrent())).rejects.toBeInstanceOf(Error);
    });
  });
});
