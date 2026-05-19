import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { CreatePlayerSeasonStatInput } from '@app/core/api/model/create-player-season-stat-input.model';
import { fakePlayerSeasonStat, GetFn, PostFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { PlayerSeasonStatResponseBody } from '../player/player-season-stat-response-body.model';
import { PlayerSeasonStatSort } from '../model/player-season-stat-sort.model';
import { PlayerSeasonStatApiService } from './player-season-stat-api.service';
import { PlayerSeasonStatsResponseBody } from './player-season-stats-response-body.model';

describe('PlayerSeasonStatApiService', () => {
  let playerSeasonStatApi: PlayerSeasonStatApiService;
  let apiServiceMock: { get: GetFn; post: PostFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayerSeasonStatApiService,
        {
          provide: ApiService,
          useValue: { get: vi.fn() as GetFn, post: vi.fn() as PostFn },
        },
      ],
    });

    playerSeasonStatApi = TestBed.inject(PlayerSeasonStatApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn; post: PostFn };
  });

  it('is created', () => {
    expect(playerSeasonStatApi).toBeTruthy();
  });

  // createPlayerSeasonStat -----------------------------------------------------------------------

  describe('createPlayerSeasonStat', () => {
    const playerSeasonStat = fakePlayerSeasonStat();
    const input: CreatePlayerSeasonStatInput = {
      playerId: playerSeasonStat.player.id,
      teamId: playerSeasonStat.team.id,
      positionId: playerSeasonStat.position.id,
    };
    const response: PlayerSeasonStatResponseBody = { playerSeasonStat };

    it('calls post with namespace and body', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(response)) as PostFn;

      await firstValueFrom(playerSeasonStatApi.createPlayerSeasonStat(input));

      expect(apiServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        playerSeasonStatApi.namespace,
        undefined,
        { playerSeasonStat: input },
      );
    });

    it('maps the result', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(response)) as PostFn;

      const result = await firstValueFrom(playerSeasonStatApi.createPlayerSeasonStat(input));

      expect(result).toEqual(playerSeasonStat);
    });

    it('propagates errors', async () => {
      const error = new Error('BAD_REQUEST');
      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => error)) as PostFn;

      expect(firstValueFrom(playerSeasonStatApi.createPlayerSeasonStat(input))).rejects.toThrow(
        error.message,
      );
    });

    it('does not map the result on error', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => new Error())) as PostFn;

      expect(
        firstValueFrom(playerSeasonStatApi.createPlayerSeasonStat(input)),
      ).rejects.toBeInstanceOf(Error);
    });
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
