import { inject, Injectable, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PlayerApiService, PlayerSearchResult } from '@app/core/api';
import { debounceTime, distinctUntilChanged, of } from 'rxjs';

@Injectable()
export class PlayerSearchService {
  private readonly searchResource = rxResource<PlayerSearchResult[], string>({
    params: () => this.debouncedTerm(),
    stream: ({ params }) => (params.length >= 3 ? this.playerApiService.search(params) : of([])),
  });

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly results = this.searchResource.value;

  private readonly searchTerm = signal('');
  private readonly debouncedTerm = toSignal(
    toObservable(this.searchTerm).pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  private playerApiService = inject(PlayerApiService);

  search(term: string): void {
    this.searchTerm.set(term);
  }
}
