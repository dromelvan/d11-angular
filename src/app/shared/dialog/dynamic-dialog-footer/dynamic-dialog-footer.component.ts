import { Component, computed, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconComponent, IconPreset } from '@app/shared/icon/icon.component';

export interface DialogFooterAction<T = unknown> {
  label: string;
  icon?: IconPreset;
  onClick: (current: T) => void;
}

@Component({
  selector: 'app-dynamic-dialog-footer',
  imports: [IconComponent],
  templateUrl: './dynamic-dialog-footer.component.html',
})
export class DynamicDialogFooterComponent {
  protected action = computed<DialogFooterAction | null>(() => this.config.data?.action ?? null);

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  protected close(): void {
    this.ref.close();
  }

  protected onAction(): void {
    this.action()?.onClick(this.config.data.current());
    this.close();
  }
}
