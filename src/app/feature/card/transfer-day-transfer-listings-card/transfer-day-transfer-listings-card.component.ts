import { Component, input } from '@angular/core';
import { TransferDay } from '@app/core/api';
import { TransferDayTransferListingsComponent } from '@app/feature/component/transfer-day-transfer-listings/transfer-day-transfer-listings.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-transfer-day-transfer-listings-card',
  imports: [Card, TransferDayTransferListingsComponent],
  templateUrl: './transfer-day-transfer-listings-card.component.html',
})
export class TransferDayTransferListingsCardComponent {
  transferDay = input.required<TransferDay>();
}
