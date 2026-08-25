import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TransferDay } from '@app/core/api';
import { TransferDayTransfersAccordionComponent } from '@app/feature/accordion/transfer-day-transfers-accordion/transfer-day-transfers-accordion.component';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-transfer-day-transfers-section',
  templateUrl: './transfer-day-transfers-section.component.html',
  imports: [SectionComponent, TransferDayTransfersAccordionComponent, DatePipe],
})
export class TransferDayTransfersSectionComponent {
  readonly transferDay = input.required<TransferDay>();
  readonly draft = input<boolean>(false);
}
