import { Component, computed } from '@angular/core';
import { PlayerBase } from '@app/core/api/model/player-base.model';
import { TeamBase } from '@app/core/api/model/team-base.model';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';
import { NgClass } from '@angular/common';
import { DynamicListDialogHeaderComponent } from '@app/shared/dialog/dynamic-list-dialog-header/dynamic-list-dialog-header.component';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';

interface PlayerStat {
  player: PlayerBase;
  team: TeamBase;
}

@Component({
  selector: 'app-player-dialog-header',
  imports: [AvatarComponent, NgClass, IconButtonComponent],
  templateUrl: './player-dialog-header.component.html',
})
export class PlayerDialogHeaderComponent extends DynamicListDialogHeaderComponent<PlayerStat> {
  protected player = computed<PlayerBase>(() => this.current().player);
}
