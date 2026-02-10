import { TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { ApiService } from '@app/core/api/api.service';
import { GetFn } from '@app/core/api/test/api.mock';
import { PlayerSearchResult } from '@app/core/api/model/player-search-result.model';
import { PlayerApiService } from './player-api.service';
import { PlayerSearchResultsResponseBody } from './player-search-results-response-body.model';

describe('PlayerApiService', () => {
  let playerApi: PlayerApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerApiService, { provide: ApiService, useValue: { get: vi.fn() as GetFn } }],
    });

    playerApi = TestBed.inject(PlayerApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
  });

  it('is created', () => {
    expect(playerApi).toBeTruthy();
  });

  // Search ----------------------------------------------------------------------------------------

  describe('search', () => {
    const playerSearchResults: PlayerSearchResult[] = [
      { id: 1, name: 'Foo Bar', teamId: 1, teamName: 'TeamA' },
      { id: 2, name: 'Bar Foo', teamId: 2, teamName: 'TeamB' },
    ];

    const searchResponse: PlayerSearchResultsResponseBody = {
      players: playerSearchResults,
    };

    const searchName = 'Foo';

    it('calls get on search', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(searchResponse)) as GetFn;

      await firstValueFrom(playerApi.search(searchName));

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        playerApi.namespace,
        'search',
        expect.objectContaining({
          params: expect.any(HttpParams),
        }),
      );
    });

    it('maps the result on search', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(searchResponse)) as GetFn;

      const results = await firstValueFrom(playerApi.search(searchName));

      expect(results).toEqual(playerSearchResults);
    });

    it('propagates errors on search', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      await expect(firstValueFrom(playerApi.search(searchName))).rejects.toThrow(httpError.message);
    });

    it('does not map the result on search error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      await expect(firstValueFrom(playerApi.search(searchName))).rejects.toBeInstanceOf(Error);
    });
  });
});
