import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { PlayerSearchResult } from '@app/core/api';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';
import { RouterService } from '@app/core/router/router.service';
import { PlayerSearchService } from '@app/feature/search/player-search.service';

@Component({
  selector: 'app-search-autocomplete',
  imports: [AutoComplete, FormsModule, AvatarComponent],
  templateUrl: './search-autocomplete.component.html',
  styleUrl: './search-autocomplete.component.css',
  providers: [PlayerSearchService],
})
export class SearchAutocompleteComponent {
  protected selectedValue = signal<PlayerSearchResult | null>(null);
  protected results = computed(() => this.playerSearchService.results() ?? []);

  private playerSearchService = inject(PlayerSearchService);
  private routerService = inject(RouterService);

  search(event: { query: string }) {
    this.playerSearchService.search(event.query);
  }

  onSelect() {
    this.routerService.navigateToPlayer(this.selectedValue()!.id).then(() => {
      this.selectedValue.set(null);
    });
  }
}
