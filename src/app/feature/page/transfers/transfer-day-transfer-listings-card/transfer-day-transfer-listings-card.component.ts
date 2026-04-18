import { Component, computed, DestroyRef, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TransferDay, TransferListing } from '@app/core/api';
import { TransferListingApiService } from '@app/core/api/transfer-listing/transfer-listing-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { D11TeamImgComponent } from '@app/shared/img/d11-team-img/d11-team-img.component';
import { TeamImgComponent } from '@app/shared/img';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-transfer-day-transfer-listings-card',
  imports: [Card, TeamImgComponent, D11TeamImgComponent],
  templateUrl: './transfer-day-transfer-listings-card.component.html',
})
export class TransferDayTransferListingsCardComponent {
  transferDay = input.required<TransferDay>();

  protected rxTransferListings = rxResource<TransferListing[], number>({
    params: () => this.transferDay().id,
    stream: ({ params: id }) =>
      this.transferListingApiService.getTransferListingsByTransferDayId(id, undefined, false),
  });

  protected transferListings = computed(() => this.rxTransferListings.value() ?? []);
  protected isLoading = computed(() => this.rxTransferListings.isLoading());

  private transferListingApiService = inject(TransferListingApiService);
  private loadingService = inject(LoadingService);
  private dynamicDialogService = inject(DynamicDialogService);
  private routerService = inject(RouterService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
  }

  protected openDialog(transferListing: TransferListing): void {
    this.dynamicDialogService.openTransferListing(transferListing, this.transferListings(), {
      label: 'Player profile',
      icon: 'player',
      onClick: (current) => this.routerService.navigateToPlayer(current.player.id),
    });
  }
}
