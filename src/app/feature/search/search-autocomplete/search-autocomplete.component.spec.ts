import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { of, throwError } from 'rxjs';
import { PlayerApiService, PlayerSearchResult } from '@app/core/api';
import { SearchAutocompleteComponent } from './search-autocomplete.component';

@Component({
  template: ` <app-search-autocomplete data-testid="search-autocomplete" /> `,
  standalone: true,
  imports: [SearchAutocompleteComponent],
})
class HostComponent {}

describe('SearchAutocompleteComponent', () => {
  const playerSearchResult: PlayerSearchResult = {
    id: 1,
    name: 'Foo Bar',
    teamId: 1,
    teamName: 'Team A',
  };

  const service = {
    search: vi.fn((query: string) => {
      return query === 'foo' ? of([playerSearchResult]) : of([]);
    }),
  };

  it('should render', async () => {
    await render(HostComponent, {
      providers: [{ provide: PlayerApiService, useValue: service }],
    });

    const component = screen.getByTestId('search-autocomplete');

    expect(component).toBeInTheDocument();

    const autocomplete = component.querySelector('p-autocomplete');
    expect(autocomplete).toBeInTheDocument();
  });

  describe('search', () => {
    let component: SearchAutocompleteComponent;
    let fixture: ComponentFixture<SearchAutocompleteComponent>;

    beforeEach(async () => {
      vi.clearAllMocks();

      await TestBed.configureTestingModule({
        imports: [SearchAutocompleteComponent],
        providers: [{ provide: PlayerApiService, useValue: service }],
      }).compileComponents();

      fixture = TestBed.createComponent(SearchAutocompleteComponent);
      component = fixture.componentInstance;
      await fixture.whenStable();
    });

    it('initializes result', () => {
      expect(component.result()).toEqual([]);
    });

    it('finds matching players', () => {
      component.search({ query: 'foo' });

      expect(component.result()).toEqual([playerSearchResult]);
      expect(service.search).toHaveBeenCalledExactlyOnceWith('foo');
    });

    it('is empty when no matches', () => {
      component.search({ query: 'xyz' });

      expect(component.result()).toEqual([]);
      expect(service.search).toHaveBeenCalledExactlyOnceWith('xyz');
    });

    it('requires at least 3 characters', () => {
      component.search({ query: '' });
      component.search({ query: 'f' });
      component.search({ query: 'fo' });

      expect(service.search).not.toHaveBeenCalled();

      component.search({ query: 'foo' });

      expect(service.search).toHaveBeenCalledExactlyOnceWith('foo');
    });

    it('handles search errors', () => {
      service.search.mockReturnValueOnce(throwError(() => new Error('500')));

      component.search({ query: 'foo' });

      expect(component.result()).toEqual([]);
    });

    it('handles selected player', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      component.selectedValue.set(playerSearchResult);
      component.onSelect();

      expect(consoleSpy).toHaveBeenCalledWith(playerSearchResult);
      expect(component.selectedValue()).toBe(null);
    });
  });
});
