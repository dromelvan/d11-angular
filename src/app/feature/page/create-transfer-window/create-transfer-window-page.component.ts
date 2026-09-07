import { Component, computed, inject, signal } from '@angular/core';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { CreateTransferWindowFormComponent } from '@app/feature/form/create-transfer-window/create-transfer-window-form.component';

@Component({
  selector: 'app-create-transfer-window-page',
  imports: [CreateTransferWindowFormComponent],
  templateUrl: './create-transfer-window-page.component.html',
})
export class CreateTransferWindowPageComponent {
  private readonly currentService = inject(CurrentService);
  private readonly pageContextService = inject(PageContextService);

  constructor() {
    this.pageContextService.setContext({
      title: signal('New Transfer Window'),
      subtitle: computed(() => {
        const name = this.currentService.season()?.name;
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: signal(''),
    });
  }
}
