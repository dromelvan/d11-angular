import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerApiService, PlayerSearchResult } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { render, screen, waitFor } from '@testing-library/angular';
import { of, throwError } from 'rxjs';
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
  });

  describe('onSelect', () => {
    it('handles selected player', async () => {
      const mockRouterService = {
        navigateToPlayer: vi.fn().mockResolvedValue(true),
      };

      await TestBed.configureTestingModule({
        imports: [SearchAutocompleteComponent],
        providers: [
          { provide: PlayerApiService, useValue: service },
          { provide: RouterService, useValue: mockRouterService },
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(SearchAutocompleteComponent);
      const component = fixture.componentInstance;
      await fixture.whenStable();

      component.selectedValue.set(playerSearchResult);

      await waitFor(() => {
        component.onSelect();
      });

      expect(mockRouterService.navigateToPlayer).toHaveBeenCalledExactlyOnceWith(
        playerSearchResult.id,
      );

      expect(component.selectedValue()).toBeNull();
    });
  });
});
