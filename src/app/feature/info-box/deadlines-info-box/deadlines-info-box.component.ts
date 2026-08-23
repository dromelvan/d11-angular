import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TransferWindow } from '@app/core/api';
import { InfoBoxComponent } from '@app/shared/info-box/info-box.component';

@Component({
  selector: 'app-deadlines-info-box',
  imports: [DatePipe, InfoBoxComponent],
  templateUrl: './deadlines-info-box.component.html',
  host: { class: 'app-fill app-col' },
})
export class DeadlinesInfoBoxComponent {
  readonly transferWindow = input<TransferWindow | undefined>();
}
