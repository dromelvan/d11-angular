import { Component, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { Transfer } from '@app/core/api';
import { PlayerBase } from '@app/core/api/model/player-base.model';
import { TeamBase } from '@app/core/api/model/team-base.model';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';
import { ButtonIconOldComponent } from '@app/shared/form';
import { DynamicListDialogHeaderComponent } from '@app/shared/dialog/dynamic-list-dialog-header/dynamic-list-dialog-header.component';

@Component({
  selector: 'app-transfer-bids-dialog-header',
  imports: [AvatarComponent, NgClass, ButtonIconOldComponent],
  templateUrl: './transfer-bids-dialog-header.component.html',
})
export class TransferBidsDialogHeaderComponent extends DynamicListDialogHeaderComponent {
  protected override team = computed<TeamBase>(
    () => (this.current() as unknown as Transfer).transferListing.team,
  );
  protected player = computed<PlayerBase>(() => (this.current() as unknown as Transfer).player);
}
