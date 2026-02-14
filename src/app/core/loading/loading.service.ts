import { computed, DestroyRef, Injectable, signal } from '@angular/core';
import { LoadableResource } from './loadable-resource.model';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  isLoading = computed(() => this.resources().some((resource) => resource.isLoading()));

  private resources = signal<LoadableResource[]>([]);

  register(destroyRef: DestroyRef, ...resources: LoadableResource[]): void {
    this.resources.update((current) => [...current, ...resources]);

    destroyRef.onDestroy(() => {
      this.resources.update((current) => current.filter((r) => !resources.includes(r)));
    });
  }
}
