import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { fakeD11MatchBase, fakePlayerSeasonStat, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { D11MatchesResponseBody } from '@app/core/api/d11-match/d11-matches-response-body.model';
import { D11TeamApiService } from './d11-team-api.service';
import { PlayerSeasonStatsResponseBody } from './player-season-stats-response-body.model';

describe('D11TeamApiService', () => {
  let d11TeamApi: D11TeamApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [D11TeamApiService, { provide: ApiService, useValue: { get: vi.fn() as GetFn } }],
    });

    d11TeamApi = TestBed.inject(D11TeamApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
  });

  it('is created', () => {
    expect(d11TeamApi).toBeTruthy();
  });

  // getD11MatchesByD11TeamIdAndSeasonId -----------------------------------------------------------

  describe('getD11MatchesByD11TeamIdAndSeasonId', () => {
    const d11TeamId = 7;
    const seasonId = 42;
    const d11Matches = [fakeD11MatchBase(), fakeD11MatchBase()];
    const response: D11MatchesResponseBody = { d11Matches };

    it('calls get with namespace, id, endpoint and seasonId param', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(d11TeamApi.getD11MatchesByD11TeamIdAndSeasonId(d11TeamId, seasonId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: d11TeamApi.namespace,
          id: d11TeamId,
          endpoint: 'd11-matches',
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
        d11TeamApi.getD11MatchesByD11TeamIdAndSeasonId(d11TeamId, seasonId),
      );

      expect(result).toEqual(d11Matches);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(d11TeamApi.getD11MatchesByD11TeamIdAndSeasonId(d11TeamId, seasonId)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(
        firstValueFrom(d11TeamApi.getD11MatchesByD11TeamIdAndSeasonId(d11TeamId, seasonId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // getPlayerSeasonStatsByD11TeamIdAndSeasonId -----------------------------------------------------

  describe('getPlayerSeasonStatsByD11TeamIdAndSeasonId', () => {
    const d11TeamId = 7;
    const seasonId = 42;
    const playerSeasonStats = [fakePlayerSeasonStat(), fakePlayerSeasonStat()];
    const response: PlayerSeasonStatsResponseBody = { playerSeasonStats };

    it('calls get with namespace, id, endpoint and seasonId param', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(
        d11TeamApi.getPlayerSeasonStatsByD11TeamIdAndSeasonId(d11TeamId, seasonId),
      );

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: d11TeamApi.namespace,
          id: d11TeamId,
          endpoint: 'player-season-stats',
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
        d11TeamApi.getPlayerSeasonStatsByD11TeamIdAndSeasonId(d11TeamId, seasonId),
      );

      expect(result).toEqual(playerSeasonStats);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(d11TeamApi.getPlayerSeasonStatsByD11TeamIdAndSeasonId(d11TeamId, seasonId)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(
        firstValueFrom(d11TeamApi.getPlayerSeasonStatsByD11TeamIdAndSeasonId(d11TeamId, seasonId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });
});
