import { Component, computed, inject, signal } from '@angular/core';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { CreatePlayerFormComponent } from '@app/feature/form/create-player/create-player-form.component';

@Component({
  selector: 'app-create-player-page',
  imports: [CreatePlayerFormComponent],
  templateUrl: './create-player-page.component.html',
})
export class CreatePlayerPageComponent {
  private readonly currentService = inject(CurrentService);
  private readonly pageContextService = inject(PageContextService);

  constructor() {
    this.pageContextService.setContext({
      title: signal('New Player'),
      subtitle: computed(() => {
        const name = this.currentService.season()?.name;
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: signal(''),
    });
  }
}
