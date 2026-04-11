import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { fakePlayerSeasonStat, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { PlayerSeasonStatApiService } from './player-season-stat-api.service';
import { PlayerSeasonStatSort } from '../model/player-season-stat-sort.model';
import { PlayerSeasonStatsResponseBody } from './player-season-stats-response-body.model';

describe('PlayerSeasonStatApiService', () => {
  let playerSeasonStatApi: PlayerSeasonStatApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayerSeasonStatApiService,
        { provide: ApiService, useValue: { get: vi.fn() as GetFn } },
      ],
    });

    playerSeasonStatApi = TestBed.inject(PlayerSeasonStatApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
  });

  it('is created', () => {
    expect(playerSeasonStatApi).toBeTruthy();
  });

  // getPlayerSeasonStatsBySeasonId ----------------------------------------------------------------

  describe('getPlayerSeasonStatsBySeasonId', () => {
    const seasonId = 42;
    const page = 0;
    const playerSeasonStats = [fakePlayerSeasonStat(), fakePlayerSeasonStat()];
    const response: PlayerSeasonStatsResponseBody = {
      page: 0,
      totalPages: 1,
      totalElements: 2,
      playerSeasonStats,
    };

    it('calls get on getPlayerSeasonStatsBySeasonId', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId(seasonId, page, []));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: playerSeasonStatApi.namespace,
          options: expect.objectContaining({
            params: expect.any(HttpParams),
          }),
        }),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('seasonId')).toBe(String(seasonId));
      expect(calledParams.get('page')).toBe(String(page));
    });

    it('calls get with positionIds on getPlayerSeasonStatsBySeasonId', async () => {
      const positionIds = [1, 2, 3];
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(
        playerSeasonStatApi.getPlayerSeasonStatsBySeasonId(seasonId, page, positionIds),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('positionIds')).toBe(positionIds.join(','));
    });

    it('calls get with dummy on getPlayerSeasonStatsBySeasonId', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(
        playerSeasonStatApi.getPlayerSeasonStatsBySeasonId(seasonId, page, [], true),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('dummy')).toBe('true');
    });

    it('calls get without dummy on getPlayerSeasonStatsBySeasonId', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId(seasonId, page, []));

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.has('dummy')).toBe(false);
    });

    it('calls get with sort on getPlayerSeasonStatsBySeasonId', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(
        playerSeasonStatApi.getPlayerSeasonStatsBySeasonId(
          seasonId,
          page,
          [],
          undefined,
          PlayerSeasonStatSort.POINTS,
        ),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('sort')).toBe(PlayerSeasonStatSort.POINTS);
    });

    it('calls get without sort on getPlayerSeasonStatsBySeasonId', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId(seasonId, page, [1]));

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.has('sort')).toBe(false);
    });

    it('maps the result on getPlayerSeasonStatsBySeasonId', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(
        playerSeasonStatApi.getPlayerSeasonStatsBySeasonId(seasonId, page, []),
      );

      expect(result).toEqual({
        page: response.page,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        elements: playerSeasonStats,
      });
    });

    it('propagates errors on getPlayerSeasonStatsBySeasonId', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId(seasonId, page, [])),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on getPlayerSeasonStatsBySeasonId error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(
        firstValueFrom(playerSeasonStatApi.getPlayerSeasonStatsBySeasonId(seasonId, page, [])),
      ).rejects.toBeInstanceOf(Error);
    });
  });
});
