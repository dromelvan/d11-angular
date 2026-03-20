import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { fakeMatchWeek, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe } from 'vitest';
import { MatchWeekApiService } from './match-week-api.service';
import { MatchWeekResponseBody } from './match-week-response-body.model';

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

    it('calls get on getById', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(matchWeekResponse)) as GetFn;

      await firstValueFrom(matchWeekApi.getById(matchWeekId));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          namespace: matchWeekApi.namespace,
          id: matchWeekId,
        }),
      );
    });

    it('maps the result on getById', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(matchWeekResponse)) as GetFn;

      const result = await firstValueFrom(matchWeekApi.getById(matchWeekId));

      expect(result).toEqual(matchWeek);
    });

    it('propagates errors on getById', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(matchWeekApi.getById(matchWeekId))).rejects.toThrow(httpError.message);
    });

    it('does not map the result on getById error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(firstValueFrom(matchWeekApi.getById(matchWeekId))).rejects.toBeInstanceOf(Error);
    });
  });
});
