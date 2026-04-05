import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { faker } from '@faker-js/faker';
import { fakePosition, GetFn } from '@app/test';
import { ApiService } from '@app/core/api/api.service';
import { Position } from '@app/core/api/model/position.model';
import { PositionApiService } from './position-api.service';
import { PositionsResponseBody } from './positions-response-body.model';

describe('PositionApiService', () => {
  let positionApi: PositionApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [PositionApiService, { provide: ApiService, useValue: { get: vi.fn() as GetFn } }],
    });

    positionApi = TestBed.inject(PositionApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
  });

  it('is created', () => {
    expect(positionApi).toBeTruthy();
  });

  // getPositions ---------------------------------------------------------------------------------

  describe('getPositions', () => {
    const positions: Position[] = faker.helpers.multiple(fakePosition, { count: 2 });

    const positionsResponse: PositionsResponseBody = {
      positions: positions,
    };

    it('calls get with namespace', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(positionsResponse)) as GetFn;

      await firstValueFrom(positionApi.getPositions());

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith({
        namespace: positionApi.namespace,
      });
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(positionsResponse)) as GetFn;

      const results = await firstValueFrom(positionApi.getPositions());

      expect(results).toEqual(positions);
    });

    it('propagates errors', async () => {
      const httpError = new Error('NOT_FOUND');

      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => httpError)) as GetFn;

      expect(firstValueFrom(positionApi.getPositions())).rejects.toThrow(httpError.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('NOT_FOUND'))) as GetFn;

      expect(firstValueFrom(positionApi.getPositions())).rejects.toBeInstanceOf(Error);
    });

    it('retrieves cached in memory result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(positionsResponse)) as GetFn;

      const result1 = await firstValueFrom(positionApi.getPositions());
      const result2 = await firstValueFrom(positionApi.getPositions());
      const result3 = await firstValueFrom(positionApi.getPositions());

      expect(result1).toEqual(positions);
      expect(result2).toEqual(positions);
      expect(result3).toEqual(positions);
      expect(apiServiceMock.get).toHaveBeenCalledOnce();
    });

    it('retrieves cached localStorage result on new service instance', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(positionsResponse)) as GetFn;

      await firstValueFrom(positionApi.getPositions());
      expect(apiServiceMock.get).toHaveBeenCalledOnce();

      const newPositionApi = TestBed.inject(PositionApiService);
      const result = await firstValueFrom(newPositionApi.getPositions());

      expect(result).toEqual(positions);
      expect(apiServiceMock.get).toHaveBeenCalledOnce();
    });
  });
});
