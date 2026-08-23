import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TransferWindow } from '@app/core/api';
import { TransferWindowApiService } from '@app/core/api/transfer-window/transfer-window-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { ScrollPickerComponent } from '@app/shared/scroll-picker/scroll-picker.component';
import { ScrollPickerItem } from '@app/shared/scroll-picker/scroll-picker-item.model';

@Component({
  selector: 'app-transfer-window-scroll-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollPickerComponent],
  templateUrl: './transfer-window-scroll-picker.component.html',
})
export class TransferWindowScrollPickerComponent {
  seasonId = input.required<number>();
  transferWindowId = input<number | undefined>(undefined);

  transferWindowSelected = output<TransferWindow>();

  protected scrollItems = computed<ScrollPickerItem[]>(() =>
    [...this.transferWindows()].reverse().map((transferWindow) => ({
      id: transferWindow.id,
      label: transferWindow.draft ? 'Draft' : `TW ${transferWindow.transferWindowNumber}`,
      preserveCase: transferWindow.draft,
      date: transferWindow.datetime,
      current: transferWindow.id === this.currentService.transferWindow()?.id,
    })),
  );

  protected selectedId = computed(() => this.transferWindow()?.id ?? 0);

  private rxTransferWindows = rxResource<TransferWindow[], number>({
    params: () => this.seasonId(),
    stream: ({ params }) => this.transferWindowApiService.getTransferWindowsBySeasonId(params),
  });

  private transferWindows = computed<TransferWindow[]>(() => {
    const transferWindows = this.rxTransferWindows.value() ?? [];
    if (transferWindows.length === 0) return [];
    return transferWindows[0].matchWeek.season.id === this.seasonId() ? transferWindows : [];
  });

  private transferWindow = computed<TransferWindow | undefined>(() => {
    const transferWindows = this.transferWindows();
    const findById = (id: number | undefined) =>
      transferWindows.find((transferWindow) => transferWindow.id === id);
    const byTransferWindowId = findById(this.transferWindowId());
    if (byTransferWindowId) return byTransferWindowId;
    if (this.transferWindowId() != null) return undefined;
    return findById(this.currentService.transferWindow()?.id) ?? transferWindows[0];
  });

  private isLoading = computed(
    () => this.rxTransferWindows.isLoading() || this.currentService.rxCurrent.isLoading(),
  );

  private transferWindowApiService = inject(TransferWindowApiService);
  private currentService = inject(CurrentService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);

    effect(() => {
      if (this.isLoading()) return;
      const transferWindow = this.transferWindow();
      if (transferWindow && transferWindow.id !== this.transferWindowId()) {
        this.transferWindowSelected.emit(transferWindow);
      }
    });
  }

  protected onTransferWindowSelected(id: number): void {
    const transferWindow = this.transferWindows().find((tw) => tw.id === id);
    if (transferWindow) this.transferWindowSelected.emit(transferWindow);
  }
}
