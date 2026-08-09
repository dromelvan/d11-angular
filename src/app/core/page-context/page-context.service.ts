import { computed, DestroyRef, inject, Injectable, signal, Signal } from '@angular/core';
import { CurrentService } from '@app/core/current/current.service';
import { contrastTextClass } from '@app/shared/util/contrast-text.util';

export interface PageContext {
  backgroundColor: Signal<string>;
  subtitle?: Signal<string | undefined>;
  title: Signal<string | undefined>;
}

@Injectable({
  providedIn: 'root',
})
export class PageContextService {
  readonly title = computed(() => this.activeContext()?.title() ?? 'D11');
  readonly subtitle = computed(
    () => this.activeContext()?.subtitle?.() ?? this.currentService.season()?.name ?? '',
  );
  readonly backgroundColor = computed(() => this.activeContext()?.backgroundColor());
  readonly textClass = computed(() => {
    const color = this.backgroundColor();
    return color ? contrastTextClass(color) : undefined;
  });

  private readonly currentService = inject(CurrentService);
  private readonly activeContext = signal<PageContext | undefined>(undefined);

  register(destroyRef: DestroyRef, context: PageContext): void {
    this.activeContext.set(context);
    destroyRef.onDestroy(() => this.activeContext.set(undefined));
  }
}
