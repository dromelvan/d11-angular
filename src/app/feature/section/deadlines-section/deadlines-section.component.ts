import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TransferWindow } from '@app/core/api';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-deadlines-section',
  imports: [DatePipe, SectionComponent],
  templateUrl: './deadlines-section.component.html',
  host: { class: 'app-fill app-col' },
})
export class DeadlinesSectionComponent {
  readonly transferWindow = input<TransferWindow | undefined>();
}
