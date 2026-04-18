import { TestBed } from '@angular/core/testing';
import { PlayerApiService, PlayerSearchResult } from '@app/core/api';
import { fakePlayerSearchResult } from '@app/test';
import { Observable, of } from 'rxjs';
import { expect, vi } from 'vitest';
import { PlayerSearchService } from './player-search.service';

async function advance(ms = 300): Promise<void> {
  await vi.advanceTimersByTimeAsync(ms);
  TestBed.tick();
}

describe('PlayerSearchService', () => {
  const mockPlayerApi = {
    search: vi.fn<(name: string) => Observable<PlayerSearchResult[]>>(),
  };

  let service: PlayerSearchService;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockPlayerApi.search.mockReturnValue(of<PlayerSearchResult[]>([]));
    TestBed.configureTestingModule({
      providers: [PlayerSearchService, { provide: PlayerApiService, useValue: mockPlayerApi }],
    });
    service = TestBed.inject(PlayerSearchService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('is created', () => {
    expect(service).toBeTruthy();
  });

  describe('search', () => {
    it('does not call the API for terms shorter than 3 characters', async () => {
      service.search('ab');
      await advance();

      expect(mockPlayerApi.search).not.toHaveBeenCalled();
    });

    it('calls the API after debounce for 3+ character terms', async () => {
      const players: PlayerSearchResult[] = [fakePlayerSearchResult()];
      mockPlayerApi.search.mockReturnValue(of(players));

      service.search('abc');
      await advance();

      expect(mockPlayerApi.search).toHaveBeenCalledWith('abc');
      expect(service.results()).toEqual(players);
    });

    it('debounces rapid input and only searches with the final term', async () => {
      service.search('a');
      service.search('ab');
      service.search('abc');
      await advance();

      expect(mockPlayerApi.search).toHaveBeenCalledOnce();
      expect(mockPlayerApi.search).toHaveBeenCalledWith('abc');
    });

    it('does not search again for the same term', async () => {
      service.search('abc');
      await advance();
      service.search('abc');
      await advance();

      expect(mockPlayerApi.search).toHaveBeenCalledOnce();
    });

    it('returns empty results when term drops below 3 characters', async () => {
      const players: PlayerSearchResult[] = [fakePlayerSearchResult()];
      mockPlayerApi.search.mockReturnValue(of(players));

      service.search('abc');
      await advance();
      expect(service.results()).toEqual(players);

      mockPlayerApi.search.mockReturnValue(of<PlayerSearchResult[]>([]));
      service.search('ab');
      await advance();
      expect(service.results()).toEqual([]);
    });
  });
});
