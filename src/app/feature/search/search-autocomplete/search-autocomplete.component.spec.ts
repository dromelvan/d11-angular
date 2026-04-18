import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerSearchResult } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakePlayerSearchResult } from '@app/test';
import { waitFor } from '@testing-library/angular';
import { expect, vi } from 'vitest';
import { PlayerSearchService } from '../player-search.service';
import { SearchAutocompleteComponent } from './search-autocomplete.component';

interface TestableSearchAutocomplete {
  selectedValue: WritableSignal<PlayerSearchResult | null>;
}

describe('SearchAutocompleteComponent', () => {
  const mockSearchService = {
    results: signal<PlayerSearchResult[] | undefined>(undefined),
    search: vi.fn(),
  };
  const mockRouterService = { navigateToPlayer: vi.fn().mockResolvedValue(true) };

  let fixture: ComponentFixture<SearchAutocompleteComponent>;
  let instance: TestableSearchAutocomplete;

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [SearchAutocompleteComponent],
      providers: [{ provide: RouterService, useValue: mockRouterService }],
    })
      .overrideComponent(SearchAutocompleteComponent, {
        set: { providers: [{ provide: PlayerSearchService, useValue: mockSearchService }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SearchAutocompleteComponent);
    instance = fixture.componentInstance as unknown as TestableSearchAutocomplete;
    fixture.detectChanges();
  });

  it('renders', () => {
    expect(fixture.nativeElement.querySelector('p-autocomplete')).toBeTruthy();
  });

  describe('search', () => {
    it('delegates to PlayerSearchService', () => {
      fixture.componentInstance.search({ query: 'foo' });

      expect(mockSearchService.search).toHaveBeenCalledWith('foo');
    });
  });

  describe('onSelect', () => {
    it('navigates to the selected player', async () => {
      const player = fakePlayerSearchResult();

      instance.selectedValue.set(player);
      fixture.componentInstance.onSelect();

      await waitFor(() =>
        expect(mockRouterService.navigateToPlayer).toHaveBeenCalledWith(player.id),
      );
    });

    it('clears the selected value after navigation', async () => {
      const player = fakePlayerSearchResult();

      instance.selectedValue.set(player);
      fixture.componentInstance.onSelect();

      await waitFor(() => expect(instance.selectedValue()).toBeNull());
    });
  });
});
