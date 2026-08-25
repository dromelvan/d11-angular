import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TransferListing } from '@app/core/api';
import { TransferListingApiService } from '@app/core/api/transfer-listing/transfer-listing-api.service';
import { RouterService } from '@app/core/router/router.service';
import { D11TeamImgComponent, TeamImgComponent } from '@app/shared/img';
import { FormMatchPointsComponent } from '@app/shared/form-match-points';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-transfer-day-transfer-listings-accordion',
  templateUrl: './transfer-day-transfer-listings-accordion.component.html',
  imports: [
    TeamImgComponent,
    D11TeamImgComponent,
    FormMatchPointsComponent,
    RatingPipe,
    SvgIconComponent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    ProgressSpinner,
  ],
})
export class TransferDayTransferListingsAccordionComponent {
  readonly transferDayId = input.required<number>();

  protected readonly transferListings = computed(() => this.rxTransferListings.value() ?? []);
  protected readonly isLoading = computed(() => this.rxTransferListings.isLoading());

  private readonly rxTransferListings = rxResource<TransferListing[], number>({
    params: () => this.transferDayId(),
    stream: ({ params: id }) =>
      this.transferListingApiService.getTransferListingsByTransferDayId(id, undefined, false),
  });

  private readonly routerService = inject(RouterService);
  private readonly transferListingApiService = inject(TransferListingApiService);

  protected navigateToPlayer(listing: TransferListing): void {
    this.routerService.navigateToPlayer(listing.player.id);
  }
}
