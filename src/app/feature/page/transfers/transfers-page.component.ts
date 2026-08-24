import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SeasonBase, Status, TransferWindow } from '@app/core/api';
import { TransferWindowApiService } from '@app/core/api/transfer-window/transfer-window-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { TransferWindowPickerButtonComponent } from '@app/feature/component/transfer-window-picker-button/transfer-window-picker-button.component';
import { TransferWindowScrollPickerComponent } from '@app/feature/component/transfer-window-scroll-picker/transfer-window-scroll-picker.component';
import { DeadlinesSectionComponent } from '@app/feature/section/deadlines-section/deadlines-section.component';
import { PositionCountSectionComponent } from '@app/feature/section/position-count-section/position-count-section.component';
import { TransferDayTransferListingsSectionComponent } from '@app/feature/section/transfer-day-transfer-listings-section/transfer-day-transfer-listings-section.component';
import { TransferDayTransfersSectionComponent } from '@app/feature/section/transfer-day-transfers-section/transfer-day-transfers-section.component';

@Component({
  selector: 'app-transfers-page',
  imports: [
    TransferWindowScrollPickerComponent,
    TransferWindowPickerButtonComponent,
    DeadlinesSectionComponent,
    PositionCountSectionComponent,
    TransferDayTransferListingsSectionComponent,
    TransferDayTransfersSectionComponent,
  ],
  templateUrl: './transfers-page.component.html',
})
export class TransfersPageComponent {
  readonly transferWindowId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v != null && v !== '' ? numberAttribute(v as string) : undefined),
  });

  protected readonly Status = Status;

  protected season = signal<SeasonBase | undefined>(undefined);
  protected transferWindow = signal<TransferWindow | undefined>(undefined);

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
    const current =
      this.transferWindowId() != null
        ? this.rxTransferWindow.value()
        : (this.rxCurrentTransferWindow.value() ?? this.rxTransferWindow.value());
    const transferWindow = current ?? this.transferWindow();
    const transferDays = [...(transferWindow?.transferDays ?? [])].sort(
      (a, b) => b.transferDayNumber - a.transferDayNumber,
    );

    return { transferWindow, transferDays };
  });

  private transferWindowApiService = inject(TransferWindowApiService);
  private currentService = inject(CurrentService);
  private routerService = inject(RouterService);
  private pageContextService = inject(PageContextService);

  constructor() {
    const destroyRef = inject(DestroyRef);

    this.pageContextService.register(destroyRef, {
      title: computed(() => {
        const transferWindow = this.model().transferWindow;
        if (!transferWindow) return undefined;
        return transferWindow.draft
          ? 'Draft'
          : `Transfer Window ${transferWindow.transferWindowNumber}`;
      }),
      subtitle: computed(() => {
        const name = this.model().transferWindow?.matchWeek.season.name;
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: signal(''),
    });

    effect(() => {
      const transferWindow = this.rxTransferWindow.value() ?? this.rxCurrentTransferWindow.value();
      if (transferWindow) {
        this.transferWindow.set(transferWindow);
        this.season.set(transferWindow.season);
      } else if (!this.season()) {
        const currentSeason = this.currentService.season();
        if (currentSeason) this.season.set(currentSeason);
      }
    });
  }

  protected onLiveClick(): void {
    const currentTransferWindowId = this.currentService.transferWindow()?.id;
    if (currentTransferWindowId)
      this.routerService.navigateToTransferWindow(currentTransferWindowId);
  }

  protected onTransferWindowSelected(transferWindow: TransferWindow): void {
    this.season.set(transferWindow.season);
    this.routerService.navigateToTransferWindow(transferWindow.id);
  }
}
