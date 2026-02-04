import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
  selector: 'app-search-autocomplete',
  imports: [AutoComplete, FormsModule],
  templateUrl: './search-autocomplete.component.html',
  styleUrl: './search-autocomplete.component.css',
})
export class SearchAutocompleteComponent {
  suggestions = signal<string[]>([]);

  search(event: { query: string }) {
    this.suggestions.set(
      ['Foo', 'Bar', 'Foobar'].filter((s) => s.toLowerCase().includes(event.query.toLowerCase())),
    );
  }

  select(event: { value: string }) {
    console.log('Selected:', event.value);
  }
}
