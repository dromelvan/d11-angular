import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { faker } from '@faker-js/faker';
import { GetFn } from '@app/core/api/test/api.mock';
import { fakeSeason } from '@app/core/api/test/faker-util';
import { ApiService } from '@app/core/api/api.service';
import { Season } from '@app/core/api/model/season.model';
import { SeasonApiService } from './season-api.service';
import { SeasonsResponseBody } from './seasons-response-body.model';

describe('SeasonApiService', () => {
  let seasonApi: SeasonApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [SeasonApiService, { provide: ApiService, useValue: { get: vi.fn() as GetFn } }],
    });

    seasonApi = TestBed.inject(SeasonApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
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

    it('propagates errors on getAll', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      await expect(firstValueFrom(seasonApi.getAll())).rejects.toThrow(httpError.message);
    });

    it('does not map the result on getAll error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      await expect(firstValueFrom(seasonApi.getAll())).rejects.toBeInstanceOf(Error);
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
});
