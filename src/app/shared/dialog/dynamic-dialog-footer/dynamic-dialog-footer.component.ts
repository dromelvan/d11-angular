import { Component, computed, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

export interface DialogFooterAction {
  label: string;
  icon?: string;
  onClick: () => void;
}

@Component({
  selector: 'app-dynamic-dialog-footer',
  imports: [],
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
    this.action()?.onClick();
    this.close();
  }
}
