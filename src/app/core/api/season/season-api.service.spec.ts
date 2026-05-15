import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { faker } from '@faker-js/faker';
import { fakeSeason, fakeSeasonWinners, GetFn, PutFn } from '@app/test';
import { ApiService } from '@app/core/api/api.service';
import { Season } from '@app/core/api/model/season.model';
import { SeasonWinners } from '@app/core/api/model/season-winners.model';
import { SeasonApiService } from './season-api.service';
import { SeasonResponseBody } from './season-response-body.model';
import { SeasonWinnersResponseBody } from './season-winners-response-body.model';
import { SeasonsResponseBody } from './seasons-response-body.model';

describe('SeasonApiService', () => {
  let seasonApi: SeasonApiService;
  let apiServiceMock: { get: GetFn; put: PutFn };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        SeasonApiService,
        {
          provide: ApiService,
          useValue: { get: vi.fn() as GetFn, put: vi.fn() as PutFn },
        },
      ],
    });

    seasonApi = TestBed.inject(SeasonApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn; put: PutFn };
  });

  it('is created', () => {
    expect(seasonApi).toBeTruthy();
  });

  // getAll ----------------------------------------------------------------------------------------

  describe('getAll', () => {
    const seasons: Season[] = faker.helpers.multiple(fakeSeason, { count: 2 });

    const seasonsResponse: SeasonsResponseBody = {
      seasons: seasons,
    };

    it('calls get with namespace', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(seasonsResponse)) as GetFn;

      await firstValueFrom(seasonApi.getAll());

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith({
        namespace: seasonApi.namespace,
      });
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(seasonsResponse)) as GetFn;

      const results = await firstValueFrom(seasonApi.getAll());

      expect(results).toEqual(seasons);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(seasonApi.getAll())).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(firstValueFrom(seasonApi.getAll())).rejects.toBeInstanceOf(Error);
    });

    it('retrieves cached in memory result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(seasonsResponse)) as GetFn;

      const result1 = await firstValueFrom(seasonApi.getAll());
      const result2 = await firstValueFrom(seasonApi.getAll());
      const result3 = await firstValueFrom(seasonApi.getAll());

      expect(result1).toEqual(seasons);
      expect(result2).toEqual(seasons);
      expect(result3).toEqual(seasons);
      expect(apiServiceMock.get).toHaveBeenCalledOnce();
    });

    it('retrieves cached localStorage result on new service instance', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(seasonsResponse)) as GetFn;

      await firstValueFrom(seasonApi.getAll());
      expect(apiServiceMock.get).toHaveBeenCalledOnce();

      const newSeasonApi = TestBed.inject(SeasonApiService);
      const result = await firstValueFrom(newSeasonApi.getAll());

      expect(result).toEqual(seasons);
      expect(apiServiceMock.get).toHaveBeenCalledOnce();
    });
  });

  // getCurrentSeason ------------------------------------------------------------------------------

  describe('getCurrentSeason', () => {
    it('calls get with namespace', async () => {
      const season = fakeSeason();
      const seasonsResponse: SeasonsResponseBody = { seasons: [season] };
      apiServiceMock.get = vi.fn().mockReturnValue(of(seasonsResponse)) as GetFn;

      await firstValueFrom(seasonApi.getCurrentSeason());

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith({
        namespace: seasonApi.namespace,
      });
    });

    it('maps the result', async () => {
      const first = { ...fakeSeason(), date: '2023-01-01' };
      const current = { ...fakeSeason(), date: '2025-01-01' };
      const second = { ...fakeSeason(), date: '2024-06-01' };
      const seasonsResponse: SeasonsResponseBody = { seasons: [first, current, second] };
      apiServiceMock.get = vi.fn().mockReturnValue(of(seasonsResponse)) as GetFn;

      const result = await firstValueFrom(seasonApi.getCurrentSeason());

      expect(result).toEqual(current);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(seasonApi.getCurrentSeason())).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(firstValueFrom(seasonApi.getCurrentSeason())).rejects.toBeInstanceOf(Error);
    });

    it('retrieves cached in memory result', async () => {
      const season = fakeSeason();
      const seasonsResponse: SeasonsResponseBody = { seasons: [season] };
      apiServiceMock.get = vi.fn().mockReturnValue(of(seasonsResponse)) as GetFn;

      await firstValueFrom(seasonApi.getCurrentSeason());
      await firstValueFrom(seasonApi.getCurrentSeason());

      expect(apiServiceMock.get).toHaveBeenCalledOnce();
    });

    it('retrieves cached localStorage result on new service instance', async () => {
      const season = fakeSeason();
      const seasonsResponse: SeasonsResponseBody = { seasons: [season] };
      apiServiceMock.get = vi.fn().mockReturnValue(of(seasonsResponse)) as GetFn;

      await firstValueFrom(seasonApi.getCurrentSeason());
      expect(apiServiceMock.get).toHaveBeenCalledOnce();

      const newSeasonApi = TestBed.inject(SeasonApiService);
      const result = await firstValueFrom(newSeasonApi.getCurrentSeason());

      expect(result).toEqual(season);
      expect(apiServiceMock.get).toHaveBeenCalledOnce();
    });
  });

  // getSeasonById ---------------------------------------------------------------------------------

  describe('getSeasonById', () => {
    const season = fakeSeason();
    const response: SeasonResponseBody = { season };

    it('calls get with namespace and id', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(seasonApi.getSeasonById(season.id!));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ namespace: seasonApi.namespace, id: season.id }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(seasonApi.getSeasonById(season.id!));

      expect(result).toEqual(season);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      await expect(firstValueFrom(seasonApi.getSeasonById(season.id!))).rejects.toThrow(
        httpError.message,
      );
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => new Error())) as GetFn;

      await expect(firstValueFrom(seasonApi.getSeasonById(season.id!))).rejects.toBeInstanceOf(
        Error,
      );
    });
  });

  // updateSeason ----------------------------------------------------------------------------------

  describe('updateSeason', () => {
    const season = fakeSeason();
    const response: SeasonResponseBody = { season };

    it('calls put with namespace, id and body', async () => {
      apiServiceMock.put = vi.fn().mockReturnValue(of(response)) as PutFn;

      await firstValueFrom(seasonApi.updateSeason(season.id!, season));

      expect(apiServiceMock.put).toHaveBeenCalledExactlyOnceWith(seasonApi.namespace, season.id, {
        season,
      });
    });

    it('maps the result', async () => {
      apiServiceMock.put = vi.fn().mockReturnValue(of(response)) as PutFn;

      const result = await firstValueFrom(seasonApi.updateSeason(season.id!, season));

      expect(result).toEqual(season);
    });

    it('propagates errors', async () => {
      const httpError = new Error('UNAUTHORIZED');
      apiServiceMock.put = vi.fn().mockReturnValue(throwError(() => httpError)) as PutFn;

      await expect(firstValueFrom(seasonApi.updateSeason(season.id!, season))).rejects.toThrow(
        httpError.message,
      );
    });

    it('does not map the result on error', async () => {
      apiServiceMock.put = vi.fn().mockReturnValue(throwError(() => new Error())) as PutFn;

      await expect(
        firstValueFrom(seasonApi.updateSeason(season.id!, season)),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  // getSeasonWinners ------------------------------------------------------------------------------

  describe('getSeasonWinners', () => {
    const seasonWinners: SeasonWinners[] = [fakeSeasonWinners(), fakeSeasonWinners()];
    const response: SeasonWinnersResponseBody = { seasonWinners };

    it('calls get with namespace and endpoint', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(seasonApi.getSeasonWinners());

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ namespace: seasonApi.namespace, endpoint: 'winners' }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(seasonApi.getSeasonWinners());

      expect(result).toEqual(seasonWinners);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(seasonApi.getSeasonWinners())).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(firstValueFrom(seasonApi.getSeasonWinners())).rejects.toBeInstanceOf(Error);
    });
  });
});
