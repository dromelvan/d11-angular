import { Component, input } from '@angular/core';
import { TransferDayTransferListingsAccordionComponent } from '@app/feature/component/transfer-day-transfer-listings-accordion/transfer-day-transfer-listings-accordion.component';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-transfer-day-transfer-listings-section',
  templateUrl: './transfer-day-transfer-listings-section.component.html',
  imports: [SectionComponent, TransferDayTransferListingsAccordionComponent],
})
export class TransferDayTransferListingsSectionComponent {
  readonly transferDayId = input.required<number>();
}
