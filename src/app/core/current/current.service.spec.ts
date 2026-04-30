import { TestBed } from '@angular/core/testing';
import { waitFor } from '@testing-library/angular';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CurrentApiService } from '@app/core/api/current/current-api.service';
import { Current } from '@app/core/api/model/current.model';
import { fakeCurrent } from '@app/test/faker-util';
import { CurrentService } from './current.service';

describe('CurrentService', () => {
  const mockCurrent: Current = fakeCurrent();

  let mockCurrentApiService: { getCurrent: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    mockCurrentApiService = {
      getCurrent: vi.fn().mockReturnValue(of(mockCurrent)),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: CurrentApiService, useValue: mockCurrentApiService }],
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('is created', () => {
    expect(TestBed.inject(CurrentService)).toBeTruthy();
  });

  it('loads current data on creation', async () => {
    const service = TestBed.inject(CurrentService);
    await waitFor(() => expect(service.rxCurrent.value()).toEqual(mockCurrent));
  });

  it('exposes season from current data', async () => {
    const service = TestBed.inject(CurrentService);
    await waitFor(() => expect(service.season()).toEqual(mockCurrent.season));
  });

  it('exposes matchWeek from current data', async () => {
    const service = TestBed.inject(CurrentService);
    await waitFor(() => expect(service.matchWeek()).toEqual(mockCurrent.matchWeek));
  });

  it('exposes transferWindow from current data', async () => {
    const service = TestBed.inject(CurrentService);
    await waitFor(() => expect(service.transferWindow()).toEqual(mockCurrent.transferWindow));
  });

  it('exposes transferDay from current data', async () => {
    const service = TestBed.inject(CurrentService);
    await waitFor(() => expect(service.transferDay()).toEqual(mockCurrent.transferDay));
  });

  it('caches current data in localStorage', async () => {
    TestBed.inject(CurrentService);
    await waitFor(() => {
      const stored = localStorage.getItem('d11:current');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.value).toEqual(mockCurrent);
      expect(parsed.expiry).toBeDefined();
    });
  });

  it('does not fetch from API when localStorage cache is valid', async () => {
    const futureExpiry = Date.now() + 60 * 60 * 1000;
    localStorage.setItem(
      'd11:current',
      JSON.stringify({ value: mockCurrent, expiry: futureExpiry }),
    );

    TestBed.inject(CurrentService);

    await waitFor(() => {
      expect(mockCurrentApiService.getCurrent).not.toHaveBeenCalled();
    });
  });

  it('fetches from API when localStorage cache is expired', async () => {
    const pastExpiry = Date.now() - 1000;
    localStorage.setItem('d11:current', JSON.stringify({ value: mockCurrent, expiry: pastExpiry }));

    TestBed.inject(CurrentService);

    await waitFor(() => expect(mockCurrentApiService.getCurrent).toHaveBeenCalledOnce());
  });
});
