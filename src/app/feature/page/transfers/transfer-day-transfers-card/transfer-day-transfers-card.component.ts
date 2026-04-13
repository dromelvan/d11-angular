import { Component, computed, DestroyRef, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Status, Transfer, TransferDay } from '@app/core/api';
import { TransferApiService } from '@app/core/api/transfer/transfer-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { DatePipe } from '@angular/common';
import { D11TeamImgComponent } from '@app/shared/img/d11-team-img/d11-team-img.component';
import { TeamImgComponent } from '@app/shared/img';
import { FeePipe } from '@app/shared/pipes';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-transfer-day-transfers-card',
  imports: [Card, DatePipe, FeePipe, TeamImgComponent, D11TeamImgComponent],
  templateUrl: './transfer-day-transfers-card.component.html',
})
export class TransferDayTransfersCardComponent {
  transferDay = input.required<TransferDay>();
  draft = input<boolean>(false);

  protected readonly Status = Status;

  protected rxTransfers = rxResource<Transfer[], number>({
    params: () => this.transferDay().id,
    stream: ({ params: id }) => this.transferApiService.getTransfersByTransferDayId(id),
  });

  protected transfers = computed(() =>
    this.draft()
      ? (this.rxTransfers.value() ?? [])
      : (this.rxTransfers
          .value()
          ?.sort((a, b) => a.transferListing.ranking - b.transferListing.ranking) ?? []),
  );
  protected isLoading = computed(() => this.rxTransfers.isLoading());

  private transferApiService = inject(TransferApiService);
  private loadingService = inject(LoadingService);
  private dynamicDialogService = inject(DynamicDialogService);
  private routerService = inject(RouterService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
  }

  protected openDialog(transfer: Transfer): void {
    this.dynamicDialogService.openTransfer(transfer, this.transfers(), {
      label: 'Player profile',
      icon: 'player',
      onClick: (current) => this.routerService.navigateToPlayer((current as unknown as Transfer).player.id),
    });
  }
}
