import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { PlayerApiService, PlayerSearchResult } from '@app/core/api';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';
import { RouterService } from '@app/core/router/router.service';

@Component({
  selector: 'app-search-autocomplete',
  imports: [AutoComplete, FormsModule, AvatarComponent],
  templateUrl: './search-autocomplete.component.html',
  styleUrl: './search-autocomplete.component.css',
})
export class SearchAutocompleteComponent {
  result = signal<PlayerSearchResult[]>([]);
  selectedValue = signal<PlayerSearchResult | null>(null);

  private playerApiService = inject(PlayerApiService);
  private routerService = inject(RouterService);

  search(event: { query: string }) {
    if (event.query.length >= 3) {
      this.playerApiService.search(event.query).subscribe({
        next: (result) => {
          this.result.set(result);
        },
        error: () => {},
      });
    }
  }

  onSelect() {
    this.routerService.navigateToPlayer(this.selectedValue()!.id).then(() => {
      this.selectedValue.set(null);
    });
  }
}
