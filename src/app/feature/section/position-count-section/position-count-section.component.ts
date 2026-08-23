import { Component, computed, input } from '@angular/core';
import { Status, TransferWindow } from '@app/core/api';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-position-count-section',
  imports: [SectionComponent],
  templateUrl: './position-count-section.component.html',
  host: { class: 'app-fill app-col' },
})
export class PositionCountSectionComponent {
  readonly transferWindow = input<TransferWindow | undefined>();

  protected readonly Status = Status;

  protected readonly positionCountGridRows = computed(() => {
    const counts = this.transferWindow()?.transferWindowPositionCounts ?? [];
    return `repeat(${Math.ceil(counts.length / 2)}, auto)`;
  });
}
