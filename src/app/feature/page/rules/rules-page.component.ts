import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-rules-page',
  imports: [SectionComponent],
  templateUrl: './rules-page.component.html',
})
export class RulesPageComponent {
  private readonly currentService = inject(CurrentService);
  private readonly pageContextService = inject(PageContextService);

  constructor() {
    const destroyRef = inject(DestroyRef);

    this.pageContextService.register(destroyRef, {
      title: signal('Rules'),
      subtitle: computed(() => {
        const name = this.currentService.season()?.name;
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: signal(''),
    });
  }
}
