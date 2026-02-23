import { computed, DestroyRef, Injectable, signal, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  readonly isLoading = computed(() => this.loadingSignals().some((loading) => loading()));

  private readonly loadingSignals = signal<Signal<boolean>[]>([]);

  register(destroyRef: DestroyRef, ...signals: Signal<boolean>[]): void {
    this.loadingSignals.update((current) => [...current, ...signals]);

    destroyRef.onDestroy(() => {
      this.loadingSignals.update((current) => current.filter((s) => !signals.includes(s)));
    });
  }
}
