import { Component, inject } from '@angular/core';
import { ApiErrorService } from '@app/core/api/api-error.service';

@Component({
  selector: 'app-api-error-page',
  imports: [],
  templateUrl: './api-error-page.component.html',
})
export class ApiErrorPageComponent {
  protected readonly error = inject(ApiErrorService).error;
}
