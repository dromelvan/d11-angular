import { Component, computed, inject } from '@angular/core';
import { TransferListing } from '@app/core/api';
import { PlayerSeasonStatComponent } from '@app/feature/page/player/player-season-stat/player-season-stat.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-transfer-listing-dialog',
  imports: [PlayerSeasonStatComponent],
  templateUrl: './transfer-listing-dialog.component.html',
})
export class TransferListingDialogComponent {
  protected transferListing = computed<TransferListing>(() => this.config.data.current());

  private config = inject(DynamicDialogConfig);
}
