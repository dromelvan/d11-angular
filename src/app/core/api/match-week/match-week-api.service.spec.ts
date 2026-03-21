import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { fakeMatchWeek, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe } from 'vitest';
import { MatchWeekApiService } from './match-week-api.service';
import { MatchWeekResponseBody } from './match-week-response-body.model';
import { MatchWeeksResponseBody } from './match-weeks-response-body.model';

describe('MatchWeekApiService', () => {
  let matchWeekApi: MatchWeekApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MatchWeekApiService,
        { provide: ApiService, useValue: { get: vi.fn() as GetFn } },
      ],
    });

    matchWeekApi = TestBed.inject(MatchWeekApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
  });

  it('is created', () => {
    expect(matchWeekApi).toBeTruthy();
  });

  // getById ---------------------------------------------------------------------------------------

  describe('getById', () => {
    const matchWeek = fakeMatchWeek();
    const matchWeekResponse: MatchWeekResponseBody = { matchWeek };
    const matchWeekId = matchWeek.id;

    it('calls get', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(matchWeekResponse)) as GetFn;

      await firstValueFrom(matchWeekApi.getById(matchWeekId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: matchWeekApi.namespace,
          id: matchWeekId,
        }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(matchWeekResponse)) as GetFn;

      const result = await firstValueFrom(matchWeekApi.getById(matchWeekId));

      expect(result).toEqual(matchWeek);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(matchWeekApi.getById(matchWeekId))).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(firstValueFrom(matchWeekApi.getById(matchWeekId))).rejects.toBeInstanceOf(Error);
    });
  });

  // getCurrentMatchWeek ---------------------------------------------------------------------------

  describe('getCurrentMatchWeek', () => {
    const matchWeek = fakeMatchWeek();
    const matchWeekResponse: MatchWeekResponseBody = { matchWeek };

    it('calls get', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(matchWeekResponse)) as GetFn;

      await firstValueFrom(matchWeekApi.getCurrentMatchWeek());

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: matchWeekApi.namespace,
          endpoint: 'current',
        }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(matchWeekResponse)) as GetFn;

      const result = await firstValueFrom(matchWeekApi.getCurrentMatchWeek());

      expect(result).toEqual(matchWeek);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(matchWeekApi.getCurrentMatchWeek())).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(firstValueFrom(matchWeekApi.getCurrentMatchWeek())).rejects.toBeInstanceOf(Error);
    });
  });

  // getMatchWeeksBySeasonId -----------------------------------------------------------------------

  describe('getMatchWeeksBySeasonId', () => {
    const seasonId = 1;
    const matchWeeks = [fakeMatchWeek(), fakeMatchWeek()];
    const matchWeeksResponse: MatchWeeksResponseBody = { matchWeeks };

    it('calls get', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(matchWeeksResponse)) as GetFn;

      await firstValueFrom(matchWeekApi.getMatchWeeksBySeasonId(seasonId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: matchWeekApi.namespace,
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
      apiServiceMock.get = vi.fn().mockReturnValue(of(matchWeeksResponse)) as GetFn;

      const result = await firstValueFrom(matchWeekApi.getMatchWeeksBySeasonId(seasonId));

      expect(result).toEqual(matchWeeks);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(matchWeekApi.getMatchWeeksBySeasonId(seasonId))).rejects.toThrow(
        httpError.message,
      );
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(firstValueFrom(matchWeekApi.getMatchWeeksBySeasonId(seasonId))).rejects.toBeInstanceOf(
        Error,
      );
    });
  });
});
