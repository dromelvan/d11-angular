import { Component, computed, inject } from '@angular/core';
import { TransferListing } from '@app/core/api';
import { PlayerStatSummaryComponent } from '@app/feature/component/player-stat-summary/player-stat-summary.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-transfer-listing-dialog',
  imports: [PlayerStatSummaryComponent],
  templateUrl: './transfer-listing.component.html',
})
export class TransferListingComponent {
  protected transferListing = computed<TransferListing>(() => this.config.data.current());

  private config = inject(DynamicDialogConfig);
}
