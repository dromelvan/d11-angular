import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { PRIMARY } from '@app/app.theme';
import { Status, TransferWindow } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';
import { IconComponent } from '@app/shared/icon/icon.component';
import { contrastTextClass } from '@app/shared/util/contrast-text.util';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-transfers-header-card',
  imports: [Card, IconButtonComponent, NgClass, DatePipe, IconComponent],
  templateUrl: './transfers-header-card.component.html',
})
export class TransfersHeaderCardComponent {
  transferWindow = input.required<TransferWindow | undefined>();
  hasPrevious = input.required<boolean>();
  hasNext = input.required<boolean>();

  previous = output<void>();
  next = output<void>();

  protected readonly Status = Status;

  protected readonly backgroundColor = PRIMARY;
  protected readonly textClass = contrastTextClass(PRIMARY);

  private routerService = inject(RouterService);

  protected navigateToMatchWeek(): void {
    if (this.transferWindow()?.matchWeek.id) {
      this.routerService.navigateToMatchWeek(this.transferWindow()!.matchWeek!.id!);
    }
  }
}
