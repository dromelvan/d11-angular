import { Component, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { EditPlayerFormComponent } from '@app/feature/form/edit-player/edit-player-form.component';

@Component({
  selector: 'app-edit-player-page',
  imports: [EditPlayerFormComponent],
  templateUrl: './edit-player-page.component.html',
})
export class EditPlayerPageComponent {
  playerId = input.required({ transform: numberAttribute });

  private readonly currentService = inject(CurrentService);
  private readonly pageContextService = inject(PageContextService);

  constructor() {
    this.pageContextService.setContext({
      title: signal('Edit Player'),
      subtitle: computed(() => {
        const name = this.currentService.season()?.name;
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: signal(''),
    });
  }
}
