import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SeasonBase, TransferWindow } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { TransferWindowApiService } from '@app/core/api/transfer-window/transfer-window-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { IconComponent } from '@app/shared/icon/icon.component';
import { TransferWindowPickerDrawerComponent } from '@app/feature/drawer/transfer-window-picker-drawer/transfer-window-picker-drawer.component';

@Component({
  selector: 'app-transfer-window-picker-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, TransferWindowPickerDrawerComponent],
  templateUrl: './transfer-window-picker-button.component.html',
})
export class TransferWindowPickerButtonComponent {
  seasonId = input.required<number>();
  transferWindowId = input<number | undefined>(undefined);

  transferWindowSelected = output<TransferWindow>();

  protected seasons = computed<SeasonBase[]>(() => this.rxSeasons.value() ?? []);
  protected selectedSeasonId = computed(() => this.localSeasonId() ?? this.seasonId());

  protected transferWindows = computed<TransferWindow[]>(() => {
    const transferWindows = this.rxTransferWindows.value() ?? [];
    if (transferWindows.length === 0) return [];
    return transferWindows[0].matchWeek.season.id === this.selectedSeasonId()
      ? transferWindows
      : [];
  });

  protected currentTransferWindowId = computed(() => this.currentService.transferWindow()?.id);
  protected currentSeasonId = computed(() => this.currentService.season()?.id);

  private localSeasonId = signal<number | undefined>(undefined);
  private pendingSeasonNavigation = signal(false);

  private rxSeasons = rxResource({
    stream: () => this.seasonApiService.getAll(),
  });

  private rxTransferWindows = rxResource<TransferWindow[], number>({
    params: () => this.selectedSeasonId(),
    stream: ({ params }) => this.transferWindowApiService.getTransferWindowsBySeasonId(params),
  });

  private drawer = viewChild.required(TransferWindowPickerDrawerComponent);

  private transferWindowApiService = inject(TransferWindowApiService);
  private seasonApiService = inject(SeasonApiService);
  private currentService = inject(CurrentService);

  constructor() {
    effect(() => {
      if (!this.pendingSeasonNavigation()) return;
      const transferWindows = this.transferWindows();
      if (transferWindows.length === 0) return;
      this.pendingSeasonNavigation.set(false);
      this.transferWindowSelected.emit(transferWindows[0]);
    });
  }

  protected onMoreClick(): void {
    this.drawer().open();
  }

  protected onTransferWindowSelected(id: number): void {
    const transferWindow = this.transferWindows().find((tw) => tw.id === id);
    if (transferWindow) this.transferWindowSelected.emit(transferWindow);
  }

  protected onSeasonSelected(id: number): void {
    this.localSeasonId.set(id);
    this.pendingSeasonNavigation.set(true);
  }
}
