import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { PlayerSearchResult } from '@app/core/api/model/player-search-result.model';
import {
  fakePlayer,
  fakePlayerMatchStat,
  fakePlayerSeasonStat,
  fakePlayerTransferContext,
  fakeTransfer,
  GetFn,
  PostFn,
  PutFn,
} from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { TransfersResponseBody } from '@app/core/api/transfer/transfers-response-body.model';
import { PlayerInput } from './player-input-request-body.model';
import { PlayerApiService } from './player-api.service';
import { PlayerResponseBody } from './player-response-body.model';
import { PlayerSearchResultsResponseBody } from './player-search-results-response-body.model';
import { PlayerTransferContextResponseBody } from './player-transfer-context-response-body.model';

describe('PlayerApiService', () => {
  let playerApi: PlayerApiService;
  let apiServiceMock: { get: GetFn; post: PostFn; put: PutFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayerApiService,
        {
          provide: ApiService,
          useValue: {
            get: vi.fn() as GetFn,
            post: vi.fn() as PostFn,
            put: vi.fn() as PutFn,
          },
        },
      ],
    });

    playerApi = TestBed.inject(PlayerApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn; post: PostFn; put: PutFn };
  });

  it('is created', () => {
    expect(playerApi).toBeTruthy();
  });

  // createPlayer ---------------------------------------------------------------------------------

  describe('createPlayer', () => {
    const player = fakePlayer();
    const playerInput: PlayerInput = {
      firstName: player.firstName,
      lastName: player.lastName,
      statSourceId: player.statSourceId,
      premierLeagueId: player.premierLeagueId,
      fullName: player.fullName ?? player.firstName,
      dateOfBirth: player.dateOfBirth ?? '1990-01-01',
      height: player.height ?? 180,
      verified: player.verified,
      country: player.country,
    };
    const response: PlayerResponseBody = { player };

    it('calls post with namespace and body', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(response)) as PostFn;

      await firstValueFrom(playerApi.createPlayer(playerInput));

      expect(apiServiceMock.post).toHaveBeenCalledExactlyOnceWith(playerApi.namespace, undefined, {
        player: playerInput,
      });
    });

    it('maps the result', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(response)) as PostFn;

      const result = await firstValueFrom(playerApi.createPlayer(playerInput));

      expect(result).toEqual(player);
    });

    it('propagates errors', async () => {
      const error = new Error('BAD_REQUEST');
      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => error)) as PostFn;

      await expect(firstValueFrom(playerApi.createPlayer(playerInput))).rejects.toThrow(
        error.message,
      );
    });

    it('does not map the result on error', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => new Error())) as PostFn;

      await expect(firstValueFrom(playerApi.createPlayer(playerInput))).rejects.toBeInstanceOf(
        Error,
      );
    });
  });

  // getById ---------------------------------------------------------------------------------------

  describe('getById', () => {
    const player = fakePlayer();
    const playerResponse: PlayerResponseBody = { player };
    const playerId = player.id;

    it('calls get on getById', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(playerResponse)) as GetFn;

      await firstValueFrom(playerApi.getById(playerId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ namespace: playerApi.namespace, id: playerId }),
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

  // updatePlayer ---------------------------------------------------------------------------------

  describe('updatePlayer', () => {
    const playerId = 1;
    const player = fakePlayer();
    const playerInput: PlayerInput = {
      firstName: player.firstName,
      lastName: player.lastName,
      statSourceId: player.statSourceId,
      premierLeagueId: player.premierLeagueId,
      fullName: player.fullName ?? player.firstName,
      dateOfBirth: player.dateOfBirth ?? '1990-01-01',
      height: player.height ?? 180,
      verified: player.verified,
      country: player.country,
    };
    const response: PlayerResponseBody = { player };

    it('calls put with namespace, id and body', async () => {
      apiServiceMock.put = vi.fn().mockReturnValue(of(response)) as PutFn;

      await firstValueFrom(playerApi.updatePlayer(playerId, playerInput));

      expect(apiServiceMock.put).toHaveBeenCalledExactlyOnceWith(playerApi.namespace, playerId, {
        player: playerInput,
      });
    });

    it('maps the result', async () => {
      apiServiceMock.put = vi.fn().mockReturnValue(of(response)) as PutFn;

      const result = await firstValueFrom(playerApi.updatePlayer(playerId, playerInput));

      expect(result).toEqual(player);
    });

    it('propagates errors', async () => {
      const error = new Error('NOT_FOUND');
      apiServiceMock.put = vi.fn().mockReturnValue(throwError(() => error)) as PutFn;

      await expect(firstValueFrom(playerApi.updatePlayer(playerId, playerInput))).rejects.toThrow(
        error.message,
      );
    });

    it('does not map the result on error', async () => {
      apiServiceMock.put = vi.fn().mockReturnValue(throwError(() => new Error())) as PutFn;

      await expect(
        firstValueFrom(playerApi.updatePlayer(playerId, playerInput)),
      ).rejects.toBeInstanceOf(Error);
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
          options: expect.objectContaining({ params: expect.any(HttpParams) }),
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

  // getTransfersByPlayerId ------------------------------------------------------------------------

  describe('getTransfersByPlayerId', () => {
    const playerId = 42;
    const transfers = [fakeTransfer(), fakeTransfer()];
    const response: TransfersResponseBody = { transfers };

    it('calls get with namespace, id and endpoint', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(playerApi.getTransfersByPlayerId(playerId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: playerApi.namespace,
          id: playerId,
          endpoint: 'transfers',
        }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(playerApi.getTransfersByPlayerId(playerId));

      expect(result).toEqual(transfers);
    });

    it('propagates errors', async () => {
      const httpError = new Error('BAD_REQUEST');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      await expect(firstValueFrom(playerApi.getTransfersByPlayerId(playerId))).rejects.toThrow(
        httpError.message,
      );
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => new Error())) as GetFn;

      await expect(
        firstValueFrom(playerApi.getTransfersByPlayerId(playerId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // getPlayerTransferContextByPlayerId ------------------------------------------------------------

  describe('getPlayerTransferContextByPlayerId', () => {
    const playerId = 42;
    const playerTransferContext = fakePlayerTransferContext();
    const response: PlayerTransferContextResponseBody = { playerTransferContext };

    it('calls get with namespace, id and endpoint', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(playerApi.getPlayerTransferContextByPlayerId(playerId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: playerApi.namespace,
          id: playerId,
          endpoint: 'player-transfer-context',
        }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(playerApi.getPlayerTransferContextByPlayerId(playerId));

      expect(result).toEqual(playerTransferContext);
    });

    it('propagates errors', async () => {
      const httpError = new Error('BAD_REQUEST');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      await expect(
        firstValueFrom(playerApi.getPlayerTransferContextByPlayerId(playerId)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => new Error())) as GetFn;

      await expect(
        firstValueFrom(playerApi.getPlayerTransferContextByPlayerId(playerId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // search ----------------------------------------------------------------------------------------

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
          options: expect.objectContaining({ params: expect.any(HttpParams) }),
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
});
