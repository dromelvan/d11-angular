import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ApiErrorService } from '@app/core/api/api-error.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-api-error-page',
  imports: [SectionComponent],
  templateUrl: './api-error-page.component.html',
})
export class ApiErrorPageComponent {
  protected readonly error = inject(ApiErrorService).error;

  private readonly pageContextService = inject(PageContextService);

  constructor() {
    this.pageContextService.register(inject(DestroyRef), {
      title: signal('Api Error'),
      subtitle: signal(undefined),
      backgroundColor: signal(''),
    });
  }
}
