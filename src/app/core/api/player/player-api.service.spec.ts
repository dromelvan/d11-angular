import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { PlayerSearchResult } from '@app/core/api/model/player-search-result.model';
import { fakePlayer, fakePlayerMatchStat, fakePlayerSeasonStat, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { PlayerApiService } from './player-api.service';
import { PlayerResponseBody } from './player-response-body.model';
import { PlayerSearchResultsResponseBody } from './player-search-results-response-body.model';

describe('PlayerApiService', () => {
  let playerApi: PlayerApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerApiService, { provide: ApiService, useValue: { get: vi.fn() as GetFn } }],
    });

    playerApi = TestBed.inject(PlayerApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
  });

  it('is created', () => {
    expect(playerApi).toBeTruthy();
  });

  // Search ----------------------------------------------------------------------------------------

  describe('search', () => {
    const playerSearchResults: PlayerSearchResult[] = [
      { id: 1, name: 'Foo Bar', teamId: 1, teamName: 'TeamA' },
      { id: 2, name: 'Bar Foo', teamId: 2, teamName: 'TeamB' },
    ];

    const searchResponse: PlayerSearchResultsResponseBody = {
      players: playerSearchResults,
    };

    const searchName = 'Foo';

    it('calls get on search', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(searchResponse)) as GetFn;

      await firstValueFrom(playerApi.search(searchName));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: playerApi.namespace,
          endpoint: 'search',
          options: expect.objectContaining({
            params: expect.any(HttpParams),
          }),
        }),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('name')).toBe(String(searchName));
    });

    it('maps the result on search', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(searchResponse)) as GetFn;

      const results = await firstValueFrom(playerApi.search(searchName));

      expect(results).toEqual(playerSearchResults);
    });

    it('propagates errors on search', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(playerApi.search(searchName))).rejects.toThrow(httpError.message);
    });

    it('does not map the result on search error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(firstValueFrom(playerApi.search(searchName))).rejects.toBeInstanceOf(Error);
    });
  });

  // GetById ---------------------------------------------------------------------------------------

  describe('getById', () => {
    const player = fakePlayer();
    const playerResponse: PlayerResponseBody = {
      player: player,
    };
    const playerId = player.id;

    it('calls get on getById', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(playerResponse)) as GetFn;

      await firstValueFrom(playerApi.getById(playerId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: playerApi.namespace,
          id: playerId,
        }),
      );
    });

    it('maps the result on getById', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(playerResponse)) as GetFn;

      const result = await firstValueFrom(playerApi.getById(playerId));

      expect(result).toEqual(player);
    });

    it('propagates errors on getById', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(playerApi.getById(playerId))).rejects.toThrow(httpError.message);
    });

    it('does not map the result on getById error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(firstValueFrom(playerApi.getById(playerId))).rejects.toBeInstanceOf(Error);
    });
  });

  // getPlayerSeasonStatsByPlayerId ----------------------------------------------------------------

  describe('getPlayerSeasonStatsByPlayerId', () => {
    const playerId = 42;
    const stats = [fakePlayerSeasonStat(), fakePlayerSeasonStat()];
    const response = { playerSeasonStats: stats };

    it('calls get on getPlayerSeasonStatsByPlayerId', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(playerApi.getPlayerSeasonStatsByPlayerId(playerId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: playerApi.namespace,
          id: playerId,
          endpoint: 'player-season-stats',
        }),
      );
    });

    it('maps the result on getPlayerSeasonStatsByPlayerId', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(playerApi.getPlayerSeasonStatsByPlayerId(playerId));

      expect(result).toEqual(stats);
    });

    it('propagates errors on getPlayerSeasonStatsByPlayerId', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(playerApi.getPlayerSeasonStatsByPlayerId(playerId))).rejects.toThrow(
        httpError.message,
      );
    });

    it('does not map the result on getPlayerSeasonStatsByPlayerId error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(
        firstValueFrom(playerApi.getPlayerSeasonStatsByPlayerId(playerId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // getPlayerMatchStatsByPlayerIdAndSeasonId -----------------------------------------------------

  describe('getPlayerMatchStatsByPlayerIdAndSeasonId', () => {
    const playerId = 42;
    const seasonId = 1;
    const playerMatchStats = [fakePlayerMatchStat(), fakePlayerMatchStat()];
    const response = { playerMatchStats: playerMatchStats };

    it('calls get on getPlayerMatchStatsByPlayerIdAndSeasonId', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(playerApi.getPlayerMatchStatsByPlayerIdAndSeasonId(playerId, seasonId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: playerApi.namespace,
          id: playerId,
          endpoint: 'player-match-stats',
          options: expect.objectContaining({
            params: expect.any(HttpParams),
          }),
        }),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('seasonId')).toBe(String(seasonId));
    });

    it('maps the result on getPlayerMatchStatsByPlayerIdAndSeasonId', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(
        playerApi.getPlayerMatchStatsByPlayerIdAndSeasonId(playerId, seasonId),
      );
      expect(result).toEqual(playerMatchStats);
    });

    it('propagates errors on getPlayerMatchStatsByPlayerIdAndSeasonId', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(playerApi.getPlayerMatchStatsByPlayerIdAndSeasonId(playerId, seasonId)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on getPlayerMatchStatsByPlayerIdAndSeasonId error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;
      expect(
        firstValueFrom(playerApi.getPlayerMatchStatsByPlayerIdAndSeasonId(playerId, seasonId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });
});
