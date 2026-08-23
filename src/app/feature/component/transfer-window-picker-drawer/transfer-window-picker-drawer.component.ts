import { Component, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SeasonBase, Status, TransferWindow } from '@app/core/api';
import { Drawer } from 'primeng/drawer';

@Component({
  selector: 'app-transfer-window-picker-drawer',
  imports: [Drawer, DatePipe],
  templateUrl: './transfer-window-picker-drawer.component.html',
})
export class TransferWindowPickerDrawerComponent {
  transferWindows = input<TransferWindow[]>([]);
  selectedId = input<number | undefined>(undefined);
  currentId = input<number | undefined>(undefined);
  seasons = input<SeasonBase[]>([]);
  selectedSeasonId = input<number | undefined>(undefined);
  currentSeasonId = input<number | undefined>(undefined);

  transferWindowSelected = output<number>();
  seasonSelected = output<number>();

  protected readonly Status = Status;
  protected visible = signal(false);

  open(): void {
    this.visible.set(true);
  }

  protected close(): void {
    this.visible.set(false);
  }

  protected onTransferWindowChange(id: number): void {
    this.transferWindowSelected.emit(id);
    this.close();
  }

  protected onSeasonChange(id: number): void {
    this.seasonSelected.emit(id);
    this.close();
  }
}
