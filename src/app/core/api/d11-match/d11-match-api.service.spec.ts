import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { fakeD11Match, fakeD11MatchBase, fakePlayerMatchStat, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { D11MatchApiService } from './d11-match-api.service';
import { D11MatchResponseBody } from './d11-match-response-body.model';
import { D11MatchesResponseBody } from './d11-matches-response-body.model';
import { PlayerMatchStatsResponseBody } from '@app/core/api/player/player-match-stats-response-body.model';

describe('D11MatchApiService', () => {
  let d11MatchApi: D11MatchApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [D11MatchApiService, { provide: ApiService, useValue: { get: vi.fn() as GetFn } }],
    });

    d11MatchApi = TestBed.inject(D11MatchApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
  });

  it('is created', () => {
    expect(d11MatchApi).toBeTruthy();
  });

  // getById ---------------------------------------------------------------------------------------

  describe('getById', () => {
    const d11Match = fakeD11Match();
    const response: D11MatchResponseBody = { d11Match };

    it('calls get with namespace and id', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(d11MatchApi.getById(d11Match.id));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: d11MatchApi.namespace,
          id: d11Match.id,
        }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(d11MatchApi.getById(d11Match.id));

      expect(result).toEqual(d11Match);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(d11MatchApi.getById(d11Match.id))).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(firstValueFrom(d11MatchApi.getById(d11Match.id))).rejects.toBeInstanceOf(Error);
    });
  });

  // getD11MatchesByMatchWeekId --------------------------------------------------------------------

  describe('getD11MatchesByMatchWeekId', () => {
    const matchWeekId = 7;
    const d11Matches = [fakeD11MatchBase(), fakeD11MatchBase()];
    const response: D11MatchesResponseBody = { d11Matches };

    it('calls get with matchWeekId param', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(d11MatchApi.getD11MatchesByMatchWeekId(matchWeekId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: d11MatchApi.namespace,
          options: { params: new HttpParams().set('matchWeekId', matchWeekId) },
        }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(d11MatchApi.getD11MatchesByMatchWeekId(matchWeekId));

      expect(result).toEqual(d11Matches);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(d11MatchApi.getD11MatchesByMatchWeekId(matchWeekId))).rejects.toThrow(
        httpError.message,
      );
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(
        firstValueFrom(d11MatchApi.getD11MatchesByMatchWeekId(matchWeekId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // getCurrentD11Matches --------------------------------------------------------------------------

  describe('getCurrentD11Matches', () => {
    const d11Matches = [fakeD11MatchBase(), fakeD11MatchBase()];
    const response: D11MatchesResponseBody = { d11Matches };

    it('calls get with current endpoint', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(d11MatchApi.getCurrentD11Matches());

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: d11MatchApi.namespace,
          endpoint: 'current',
        }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(d11MatchApi.getCurrentD11Matches());

      expect(result).toEqual(d11Matches);
    });

    it('propagates errors', async () => {
      const httpError = new Error('INTERNAL_SERVER_ERROR');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(d11MatchApi.getCurrentD11Matches())).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('INTERNAL_SERVER_ERROR'))) as GetFn;

      expect(firstValueFrom(d11MatchApi.getCurrentD11Matches())).rejects.toBeInstanceOf(Error);
    });
  });

  // getActiveD11Matches ---------------------------------------------------------------------------

  describe('getActiveD11Matches', () => {
    const d11Matches = [fakeD11MatchBase(), fakeD11MatchBase()];
    const response: D11MatchesResponseBody = { d11Matches };

    it('calls get with active endpoint', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(d11MatchApi.getActiveD11Matches());

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: d11MatchApi.namespace,
          endpoint: 'active',
        }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(d11MatchApi.getActiveD11Matches());

      expect(result).toEqual(d11Matches);
    });

    it('propagates errors', async () => {
      const httpError = new Error('INTERNAL_SERVER_ERROR');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(d11MatchApi.getActiveD11Matches())).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('INTERNAL_SERVER_ERROR'))) as GetFn;

      expect(firstValueFrom(d11MatchApi.getActiveD11Matches())).rejects.toBeInstanceOf(Error);
    });
  });

  // getPlayerMatchStatsByD11MatchId ---------------------------------------------------------------

  describe('getPlayerMatchStatsByD11MatchId', () => {
    const d11MatchId = 42;
    const playerMatchStats = [fakePlayerMatchStat(), fakePlayerMatchStat()];
    const response: PlayerMatchStatsResponseBody = { playerMatchStats };

    it('calls get with namespace, id and player-match-stats endpoint', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(d11MatchApi.getPlayerMatchStatsByD11MatchId(d11MatchId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: d11MatchApi.namespace,
          id: d11MatchId,
          endpoint: 'player-match-stats',
        }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(d11MatchApi.getPlayerMatchStatsByD11MatchId(d11MatchId));

      expect(result).toEqual(playerMatchStats);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(d11MatchApi.getPlayerMatchStatsByD11MatchId(d11MatchId)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(
        firstValueFrom(d11MatchApi.getPlayerMatchStatsByD11MatchId(d11MatchId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });
});
