import { Component, computed, input } from '@angular/core';
import { Status, TransferWindow } from '@app/core/api';
import { InfoBoxComponent } from '@app/shared/info-box/info-box.component';

@Component({
  selector: 'app-position-count-info-box',
  imports: [InfoBoxComponent],
  templateUrl: './position-count-info-box.component.html',
  host: { class: 'app-fill app-col' },
})
export class PositionCountInfoBoxComponent {
  readonly transferWindow = input<TransferWindow | undefined>();

  protected readonly Status = Status;

  protected readonly positionCountGridRows = computed(() => {
    const counts = this.transferWindow()?.transferWindowPositionCounts ?? [];
    return `repeat(${Math.ceil(counts.length / 2)}, auto)`;
  });
}
