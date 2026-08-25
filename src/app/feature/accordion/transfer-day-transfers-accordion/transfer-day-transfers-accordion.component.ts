import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Transfer, TransferApiService, TransferBid, TransferBidApiService } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { D11TeamImgComponent, TeamImgComponent } from '@app/shared/img';
import { FeePipe } from '@app/shared/pipes';
import { D11TeamBaseComponent } from '@app/shared/resource/d11-team-base/d11-team-base.component';
import { IconComponent } from '@app/shared/icon/icon.component';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-transfer-day-transfers-accordion',
  templateUrl: './transfer-day-transfers-accordion.component.html',
  imports: [
    TeamImgComponent,
    D11TeamImgComponent,
    D11TeamBaseComponent,
    IconComponent,
    SvgIconComponent,
    FeePipe,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    ProgressSpinner,
  ],
})
export class TransferDayTransfersAccordionComponent {
  readonly transferDayId = input.required<number>();
  readonly draft = input<boolean>(false);

  protected readonly transfers = computed(() => {
    const transfers = this.rxTransfers.value() ?? [];
    if (!this.draft()) return transfers;
    return [...transfers].sort(
      (a, b) =>
        a.d11Team.name.localeCompare(b.d11Team.name) ||
        a.transferListing.position.sortOrder - b.transferListing.position.sortOrder,
    );
  });
  protected readonly transferBids = computed(() => this.rxTransferBids.value() ?? []);
  protected readonly isLoading = computed(
    () => this.rxTransfers.isLoading() || this.rxTransferBids.isLoading(),
  );

  private readonly rxTransfers = rxResource<Transfer[], number>({
    params: () => this.transferDayId(),
    stream: ({ params: id }) => this.transferApiService.getTransfersByTransferDayId(id),
  });

  private readonly rxTransferBids = rxResource<TransferBid[], number>({
    params: () => this.transferDayId(),
    stream: ({ params: id }) => this.transferBidApiService.getTransferBidsByTransferDayId(id),
  });

  private readonly routerService = inject(RouterService);
  private readonly transferApiService = inject(TransferApiService);
  private readonly transferBidApiService = inject(TransferBidApiService);

  protected transferBidsForTransfer(transfer: Transfer): TransferBid[] {
    return this.transferBids().filter((bid) => bid.player.id === transfer.player.id);
  }

  protected navigateToPlayer(transfer: Transfer): void {
    this.routerService.navigateToPlayer(transfer.player.id);
  }
}
