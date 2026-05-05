import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { fakeTeamSeasonStat, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { TeamSeasonStatApiService } from './team-season-stat-api.service';
import { TeamSeasonStatsResponseBody } from './team-season-stats-response-body.model';

describe('TeamSeasonStatApiService', () => {
  let teamSeasonStatApi: TeamSeasonStatApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TeamSeasonStatApiService,
        { provide: ApiService, useValue: { get: vi.fn() as GetFn } },
      ],
    });

    teamSeasonStatApi = TestBed.inject(TeamSeasonStatApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
  });

  it('is created', () => {
    expect(teamSeasonStatApi).toBeTruthy();
  });

  // getTeamSeasonStatsBySeasonId ----------------------------------------------------------------

  describe('getTeamSeasonStatsBySeasonId', () => {
    const seasonId = 42;
    const teamSeasonStats = [fakeTeamSeasonStat(), fakeTeamSeasonStat()];
    const response: TeamSeasonStatsResponseBody = { teamSeasonStats };

    it('calls get with namespace and seasonId param', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(teamSeasonStatApi.getTeamSeasonStatsBySeasonId(seasonId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: teamSeasonStatApi.namespace,
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

      const result = await firstValueFrom(teamSeasonStatApi.getTeamSeasonStatsBySeasonId(seasonId));

      expect(result).toEqual(teamSeasonStats);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(teamSeasonStatApi.getTeamSeasonStatsBySeasonId(seasonId)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(
        firstValueFrom(teamSeasonStatApi.getTeamSeasonStatsBySeasonId(seasonId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // getTeamSeasonStatsByTeamId ------------------------------------------------------------------

  describe('getTeamSeasonStatsByTeamId', () => {
    const teamId = 7;
    const teamSeasonStats = [fakeTeamSeasonStat(), fakeTeamSeasonStat()];
    const response: TeamSeasonStatsResponseBody = { teamSeasonStats };

    it('calls get with namespace and teamId param', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(teamSeasonStatApi.getTeamSeasonStatsByTeamId(teamId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: teamSeasonStatApi.namespace,
          options: expect.objectContaining({
            params: expect.any(HttpParams),
          }),
        }),
      );

      const calledParams: HttpParams = (apiServiceMock.get as ReturnType<typeof vi.fn>).mock
        .calls[0][0].options.params;
      expect(calledParams.get('teamId')).toBe(String(teamId));
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(teamSeasonStatApi.getTeamSeasonStatsByTeamId(teamId));

      expect(result).toEqual(teamSeasonStats);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(teamSeasonStatApi.getTeamSeasonStatsByTeamId(teamId))).rejects.toThrow(
        httpError.message,
      );
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(
        firstValueFrom(teamSeasonStatApi.getTeamSeasonStatsByTeamId(teamId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });
});
