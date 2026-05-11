import { Component, input } from '@angular/core';
import { TransferDay } from '@app/core/api';
import { TransferDayTransfersComponent } from '@app/feature/component/transfer-day-transfers/transfer-day-transfers.component';
import { DatePipe } from '@angular/common';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-transfer-day-transfers-card',
  imports: [Card, DatePipe, TransferDayTransfersComponent],
  templateUrl: './transfer-day-transfers-card.component.html',
})
export class TransferDayTransfersCardComponent {
  transferDay = input.required<TransferDay>();
  draft = input<boolean>(false);
}
