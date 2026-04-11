import { Component, computed, DestroyRef, inject, input, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Status, TransferWindow } from '@app/core/api';
import { TransferWindowApiService } from '@app/core/api/transfer-window/transfer-window-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { TransferDayTransferListingsCardComponent } from './transfer-day-transfer-listings-card/transfer-day-transfer-listings-card.component';
import { TransferDayTransfersCardComponent } from './transfer-day-transfers-card/transfer-day-transfers-card.component';
import { TransfersHeaderCardComponent } from './transfers-header-card/transfers-header-card.component';

@Component({
  selector: 'app-transfers-page',
  imports: [
    Tabs,
    TabPanels,
    TabPanel,
    TabList,
    Tab,
    TransfersHeaderCardComponent,
    TransferDayTransfersCardComponent,
    TransferDayTransferListingsCardComponent,
  ],
  templateUrl: './transfers-page.component.html',
})
export class TransfersPageComponent {
  readonly transferWindowId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v != null && v !== '' ? numberAttribute(v as string) : undefined),
  });

  protected rxCurrentTransferWindow = rxResource<TransferWindow, void>({
    stream: () => this.transferWindowApiService.getCurrentTransferWindow(),
  });

  protected rxTransferWindow = rxResource<TransferWindow, number | null>({
    params: () => this.transferWindowId() ?? null,
    stream: ({ params: id }) =>
      id !== null
        ? this.transferWindowApiService.getTransferWindowById(id)
        : this.transferWindowApiService.getCurrentTransferWindow(),
  });

  protected model = computed(() => {
    const transferWindow =
      this.transferWindowId() != null
        ? this.rxTransferWindow.value()
        : (this.rxCurrentTransferWindow.value() ?? this.rxTransferWindow.value());
    const transferDays = [...(transferWindow?.transferDays ?? [])].sort(
      (a, b) => b.transferDayNumber - a.transferDayNumber,
    );

    const columns: string[] = [];
    if (transferWindow && transferWindow.status !== Status.PENDING) {
      if (transferDays.some((d) => d.status === Status.FINISHED)) {
        columns.push('Transfers');
      }
      columns.push('Transfer Listings');
    }

    const lastTransferDay = transferDays.length ? transferDays[transferDays.length - 1] : undefined;

    return { transferWindow, transferDays, columns, lastTransferDay };
  });

  protected isLoading = computed(() => this.rxTransferWindow.isLoading());

  protected hasPrevious = computed(() => (this.rxTransferWindow.value()?.id ?? 1) > 1);
  protected hasNext = computed(
    () =>
      (this.rxTransferWindow.value()?.id ?? 0) < (this.rxCurrentTransferWindow.value()?.id ?? 0),
  );
  protected readonly Status = Status;

  private transferWindowApiService = inject(TransferWindowApiService);
  private routerService = inject(RouterService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
  }

  protected navigateToPrevious(): void {
    const id = this.transferWindowId() ?? this.rxTransferWindow.value()?.id;
    if (id) this.routerService.navigateToTransferWindow(id - 1);
  }

  protected navigateToNext(): void {
    const id = this.transferWindowId() ?? this.rxTransferWindow.value()?.id;
    if (id) this.routerService.navigateToTransferWindow(id + 1);
  }
}
