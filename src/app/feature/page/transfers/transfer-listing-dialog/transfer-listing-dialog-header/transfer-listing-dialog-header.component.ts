import { Component, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { TransferListing } from '@app/core/api';
import { PlayerBase } from '@app/core/api/model/player-base.model';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';
import { ButtonIconOldComponent } from '@app/shared/form';
import { DynamicListDialogHeaderComponent } from '@app/shared/dialog/dynamic-list-dialog-header/dynamic-list-dialog-header.component';

@Component({
  selector: 'app-transfer-listing-dialog-header',
  imports: [AvatarComponent, NgClass, ButtonIconOldComponent],
  templateUrl: './transfer-listing-dialog-header.component.html',
})
export class TransferListingDialogHeaderComponent extends DynamicListDialogHeaderComponent<TransferListing> {
  protected player = computed<PlayerBase>(() => this.current().player);
}
