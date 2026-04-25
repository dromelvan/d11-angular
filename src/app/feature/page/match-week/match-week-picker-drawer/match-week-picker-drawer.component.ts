import { Component, input, output, signal } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { MatchWeek, Status } from '@app/core/api';
import { Drawer } from 'primeng/drawer';

@Component({
  selector: 'app-match-week-picker-drawer',
  imports: [Drawer, DatePipe, UpperCasePipe],
  templateUrl: './match-week-picker-drawer.component.html',
})
export class MatchWeekPickerDrawerComponent {
  matchWeeks = input<MatchWeek[]>([]);
  selectedId = input<number | undefined>(undefined);
  currentId = input<number | undefined>(undefined);

  matchWeekSelected = output<number>();

  protected readonly Status = Status;
  protected visible = signal(false);

  open(): void {
    this.visible.set(true);
  }

  protected close(): void {
    this.visible.set(false);
  }

  protected onMatchWeekChange(id: number): void {
    this.matchWeekSelected.emit(id);
    this.close();
  }
}
