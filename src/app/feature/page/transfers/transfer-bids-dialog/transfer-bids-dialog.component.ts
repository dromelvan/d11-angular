import { Component, computed, DestroyRef, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Transfer, TransferBid } from '@app/core/api';
import { TransferBidApiService } from '@app/core/api/transfer-bid/transfer-bid-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { D11TeamBaseComponent } from '@app/shared/resource/d11-team-base/d11-team-base.component';
import { FeePipe } from '@app/shared/pipes';
import { IconComponent } from '@app/shared/icon/icon.component';

@Component({
  selector: 'app-transfer-bids-dialog',
  imports: [D11TeamBaseComponent, FeePipe, IconComponent],
  templateUrl: './transfer-bids-dialog.component.html',
})
export class TransferBidsDialogComponent {
  protected transfer = computed<Transfer>(() => this.config.data.current());

  protected rxTransferBids = rxResource<TransferBid[], { transferDayId: number; playerId: number }>(
    {
      params: () => ({
        transferDayId: this.transfer().transferDay.id,
        playerId: this.transfer().player.id,
      }),
      stream: ({ params }) =>
        this.transferBidApiService.getTransferBidsByTransferDayIdAndPlayerId(
          params.transferDayId,
          params.playerId,
        ),
    },
  );

  protected transferBids = computed(() => this.rxTransferBids.value() ?? []);
  protected isLoading = computed(() => this.rxTransferBids.isLoading());

  private config = inject(DynamicDialogConfig);
  private transferBidApiService = inject(TransferBidApiService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
  }
}
