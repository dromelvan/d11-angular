import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { Lineup } from '@app/core/api';
import { fakeMatch, fakePlayerMatchStat, fakeStadium, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { MatchApiService } from './match-api.service';
import { MatchResponseBody } from './match-response-body.model';
import { PlayerMatchStatsResponseBody } from '@app/core/api/player/player-match-stats-response-body.model';

describe('MatchApiService', () => {
  let matchApi: MatchApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatchApiService, { provide: ApiService, useValue: { get: vi.fn() as GetFn } }],
    });

    matchApi = TestBed.inject(MatchApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
  });

  it('is created', () => {
    expect(matchApi).toBeTruthy();
  });

  // getById ---------------------------------------------------------------------------------------

  describe('getById', () => {
    const match = fakeMatch();
    const stadium = fakeStadium();
    const matchResponse: MatchResponseBody = { match, stadium };
    const matchId = match.id;

    it('calls get on getById', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(matchResponse)) as GetFn;

      await firstValueFrom(matchApi.getById(matchId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: matchApi.namespace,
          id: matchId,
        }),
      );
    });

    it('maps the result on getById', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(matchResponse)) as GetFn;

      const result = await firstValueFrom(matchApi.getById(matchId));

      expect(result).toEqual(match);
    });

    it('propagates errors on getById', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(matchApi.getById(matchId))).rejects.toThrow(httpError.message);
    });

    it('does not map the result on getById error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(firstValueFrom(matchApi.getById(matchId))).rejects.toBeInstanceOf(Error);
    });
  });

  // getPlayerMatchStatsByMatchId ------------------------------------------------------------------

  describe('getPlayerMatchStatsByMatchId', () => {
    const matchId = 42;
    const playerMatchStats = [
      { ...fakePlayerMatchStat(), lineup: Lineup.STARTING_LINEUP },
      { ...fakePlayerMatchStat(), lineup: Lineup.STARTING_LINEUP },
    ];
    const response: PlayerMatchStatsResponseBody = { playerMatchStats };

    it('calls get on getPlayerMatchStatsByMatchId', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(matchApi.getPlayerMatchStatsByMatchId(matchId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: matchApi.namespace,
          id: matchId,
          endpoint: 'player-match-stats',
        }),
      );
    });

    it('maps the result on getPlayerMatchStatsByMatchId', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(matchApi.getPlayerMatchStatsByMatchId(matchId));

      expect(result).toEqual(playerMatchStats);
    });

    it('propagates errors on getPlayerMatchStatsByMatchId', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(matchApi.getPlayerMatchStatsByMatchId(matchId))).rejects.toThrow(
        httpError.message,
      );
    });

    it('does not map the result on getPlayerMatchStatsByMatchId error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(firstValueFrom(matchApi.getPlayerMatchStatsByMatchId(matchId))).rejects.toBeInstanceOf(
        Error,
      );
    });
  });
});
