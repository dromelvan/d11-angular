import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { fakeD11TeamSeasonStat, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { D11TeamSeasonStatApiService } from './d11-team-season-stat-api.service';
import { D11TeamSeasonStatsResponseBody } from './d11-team-season-stats-response-body.model';

describe('D11TeamSeasonStatApiService', () => {
  let d11TeamSeasonStatApi: D11TeamSeasonStatApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        D11TeamSeasonStatApiService,
        { provide: ApiService, useValue: { get: vi.fn() as GetFn } },
      ],
    });

    d11TeamSeasonStatApi = TestBed.inject(D11TeamSeasonStatApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
  });

  it('is created', () => {
    expect(d11TeamSeasonStatApi).toBeTruthy();
  });

  // getD11TeamSeasonStatsBySeasonId ----------------------------------------------------------------

  describe('getD11TeamSeasonStatsBySeasonId', () => {
    const seasonId = 42;
    const d11TeamSeasonStats = [fakeD11TeamSeasonStat(), fakeD11TeamSeasonStat()];
    const response: D11TeamSeasonStatsResponseBody = { d11TeamSeasonStats };

    it('calls get with namespace and seasonId param', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(d11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId(seasonId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: d11TeamSeasonStatApi.namespace,
          options: expect.objectContaining({
            params: expect.any(HttpParams),
          }),
        }),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('seasonId')).toBe(String(seasonId));
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(
        d11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId(seasonId),
      );

      expect(result).toEqual(d11TeamSeasonStats);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(d11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId(seasonId)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(
        firstValueFrom(d11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId(seasonId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });
});
