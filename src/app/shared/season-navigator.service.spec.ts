import { TestBed } from '@angular/core/testing';
import { Season } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { fakeSeason } from '@app/test';
import { Observable, of } from 'rxjs';
import { expect, vi } from 'vitest';
import { SeasonNavigatorService } from './season-navigator.service';

describe('SeasonNavigatorService', () => {
  const mockSeasonApi = {
    getAll: vi.fn<() => Observable<Season[]>>(),
  };

  let seasons: Season[];
  let service: SeasonNavigatorService;

  beforeEach(() => {
    vi.clearAllMocks();
    seasons = [
      { ...fakeSeason(), date: '2023-08-01' },
      { ...fakeSeason(), date: '2022-08-01' },
      { ...fakeSeason(), date: '2021-08-01' },
    ];
    mockSeasonApi.getAll.mockReturnValue(of(seasons));
    TestBed.configureTestingModule({
      providers: [SeasonNavigatorService, { provide: SeasonApiService, useValue: mockSeasonApi }],
    });
    service = TestBed.inject(SeasonNavigatorService);
    TestBed.tick();
  });

  it('is created', () => {
    expect(service).toBeTruthy();
  });

  it('fetches all seasons', () => {
    expect(mockSeasonApi.getAll).toHaveBeenCalled();
  });

  describe('sortedSeasons', () => {
    it('sorts seasons by date descending', () => {
      expect(service.sortedSeasons().map((s) => s.date)).toEqual([
        '2023-08-01',
        '2022-08-01',
        '2021-08-01',
      ]);
    });
  });

  describe('currentSeason', () => {
    it('defaults to the most recent season when no ID is set', () => {
      expect(service.currentSeason()).toEqual(seasons[0]);
    });

    it('resolves to the season matching the set ID', () => {
      service.setSeasonId(seasons[1].id);

      expect(service.currentSeason()).toEqual(seasons[1]);
    });
  });

  describe('hasPrevious', () => {
    it('is true when not at the oldest season', () => {
      service.setSeasonId(seasons[1].id);

      expect(service.hasPrevious()).toBe(true);
    });

    it('is false when at the oldest season', () => {
      service.setSeasonId(seasons[2].id);

      expect(service.hasPrevious()).toBe(false);
    });
  });

  describe('hasNext', () => {
    it('is true when not at the newest season', () => {
      service.setSeasonId(seasons[1].id);

      expect(service.hasNext()).toBe(true);
    });

    it('is false when at the newest season', () => {
      service.setSeasonId(seasons[0].id);

      expect(service.hasNext()).toBe(false);
    });
  });

  describe('setSeasonId', () => {
    it('updates currentSeason to match the given ID', () => {
      service.setSeasonId(seasons[2].id);

      expect(service.currentSeason()).toEqual(seasons[2]);
    });
  });
});
