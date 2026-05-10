import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TransferListing } from '@app/core/api';
import { FormMatchPointsComponent } from '@app/shared/form-match-points';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { TeamBaseComponent } from '@app/shared/resource/team-base/team-base.component';
import { D11TeamBaseComponent } from '@app/shared/resource/d11-team-base/d11-team-base.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-transfer-listing-dialog',
  imports: [
    DecimalPipe,
    RatingPipe,
    TeamBaseComponent,
    D11TeamBaseComponent,
    FormMatchPointsComponent,
  ],
  templateUrl: './transfer-listing-dialog.component.html',
})
export class TransferListingDialogComponent {
  protected transferListing = computed<TransferListing>(() => this.config.data.current());

  private config = inject(DynamicDialogConfig);
}
