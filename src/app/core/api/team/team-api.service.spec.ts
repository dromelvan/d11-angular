import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { fakeMatchBase, fakePlayerSeasonStat, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { MatchesResponseBody } from '@app/core/api/match/matches-response-body.model';
import { TeamApiService } from './team-api.service';
import { PlayerSeasonStatsResponseBody } from './player-season-stats-response-body.model';

describe('TeamApiService', () => {
  let teamApi: TeamApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamApiService, { provide: ApiService, useValue: { get: vi.fn() as GetFn } }],
    });

    teamApi = TestBed.inject(TeamApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
  });

  it('is created', () => {
    expect(teamApi).toBeTruthy();
  });

  // getMatchesByTeamIdAndSeasonId -----------------------------------------------------------------

  describe('getMatchesByTeamIdAndSeasonId', () => {
    const teamId = 7;
    const seasonId = 42;
    const matches = [fakeMatchBase(), fakeMatchBase()];
    const response: MatchesResponseBody = { matches };

    it('calls get with namespace, id, endpoint and seasonId param', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(teamApi.getMatchesByTeamIdAndSeasonId(teamId, seasonId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: teamApi.namespace,
          id: teamId,
          endpoint: 'matches',
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

      const result = await firstValueFrom(teamApi.getMatchesByTeamIdAndSeasonId(teamId, seasonId));

      expect(result).toEqual(matches);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(teamApi.getMatchesByTeamIdAndSeasonId(teamId, seasonId)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(
        firstValueFrom(teamApi.getMatchesByTeamIdAndSeasonId(teamId, seasonId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // getPlayerSeasonStatsByTeamIdAndSeasonId -------------------------------------------------------

  describe('getPlayerSeasonStatsByTeamIdAndSeasonId', () => {
    const teamId = 7;
    const seasonId = 42;
    const playerSeasonStats = [fakePlayerSeasonStat(), fakePlayerSeasonStat()];
    const response: PlayerSeasonStatsResponseBody = { playerSeasonStats };

    it('calls get with namespace, id, endpoint and seasonId param', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(teamApi.getPlayerSeasonStatsByTeamIdAndSeasonId(teamId, seasonId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: teamApi.namespace,
          id: teamId,
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
        teamApi.getPlayerSeasonStatsByTeamIdAndSeasonId(teamId, seasonId),
      );

      expect(result).toEqual(playerSeasonStats);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(teamApi.getPlayerSeasonStatsByTeamIdAndSeasonId(teamId, seasonId)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(
        firstValueFrom(teamApi.getPlayerSeasonStatsByTeamIdAndSeasonId(teamId, seasonId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });
});
