import { Component, input, output, signal } from '@angular/core';
import { SeasonBase } from '@app/core/api';
import { Drawer } from 'primeng/drawer';

@Component({
  selector: 'app-season-picker-drawer',
  imports: [Drawer],
  templateUrl: './season-picker-drawer.component.html',
})
export class SeasonPickerDrawerComponent {
  seasons = input<SeasonBase[]>([]);
  selectedSeasonId = input<number | undefined>(undefined);
  currentSeasonId = input<number | undefined>(undefined);

  seasonSelected = output<number>();

  protected visible = signal(false);

  open(): void {
    this.visible.set(true);
  }

  protected close(): void {
    this.visible.set(false);
  }

  protected onSeasonChange(id: number): void {
    this.seasonSelected.emit(id);
    this.close();
  }
}
