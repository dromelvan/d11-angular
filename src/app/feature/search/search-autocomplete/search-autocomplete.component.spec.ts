import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { SearchAutocompleteComponent } from './search-autocomplete.component';

@Component({
  template: ` <app-search-autocomplete data-testid="search-autocomplete" /> `,
  standalone: true,
  imports: [SearchAutocompleteComponent],
})
class HostComponent {}

describe('SearchAutocompleteComponent', () => {
  it('should render', async () => {
    await render(HostComponent, {
      providers: [],
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
      await TestBed.configureTestingModule({
        imports: [SearchAutocompleteComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SearchAutocompleteComponent);
      component = fixture.componentInstance;
      await fixture.whenStable();
    });

    it('initializes suggestions', () => {
      expect(component.suggestions()).toEqual([]);
    });

    it('filters suggestions', () => {
      component.search({ query: 'foo' });

      expect(component.suggestions()).toEqual(['Foo', 'Foobar']);
    });

    it('is case insensitive', () => {
      component.search({ query: 'FOO' });

      expect(component.suggestions()).toEqual(['Foo', 'Foobar']);
    });

    it('is empty when no matches', () => {
      component.search({ query: 'xyz' });

      expect(component.suggestions()).toEqual([]);
    });

    it('does not filter on empty query', () => {
      component.search({ query: '' });

      expect(component.suggestions()).toEqual(['Foo', 'Bar', 'Foobar']);
    });

    it('logs selected value', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      component.select({ value: 'Foo' });

      expect(consoleSpy).toHaveBeenCalledWith('Selected:', 'Foo');
    });
  });
});
