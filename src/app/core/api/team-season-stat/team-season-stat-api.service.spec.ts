import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { fakeTeamSeasonStat, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { TeamSeasonStatApiService } from './team-season-stat-api.service';
import { TeamSeasonStatResponseBody } from './team-season-stat-response-body.model';

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

  // getTeamSeasonStatByTeamIdAndSeasonId ----------------------------------------------------------

  describe('getTeamSeasonStatByTeamIdAndSeasonId', () => {
    const teamId = 1;
    const seasonId = 42;
    const teamSeasonStat = fakeTeamSeasonStat();
    const response: TeamSeasonStatResponseBody = { teamSeasonStat };

    it('calls get with namespace and season id', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(
        teamSeasonStatApi.getTeamSeasonStatByTeamIdAndSeasonId(teamId, seasonId),
      );

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: teamSeasonStatApi.namespace,
          id: teamId,
          endpoint: 'team-season-stats',
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
        teamSeasonStatApi.getTeamSeasonStatByTeamIdAndSeasonId(teamId, seasonId),
      );

      expect(result).toEqual(teamSeasonStat);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(
        firstValueFrom(teamSeasonStatApi.getTeamSeasonStatByTeamIdAndSeasonId(teamId, seasonId)),
      ).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(
        firstValueFrom(teamSeasonStatApi.getTeamSeasonStatByTeamIdAndSeasonId(teamId, seasonId)),
      ).rejects.toBeInstanceOf(Error);
    });
  });
});
