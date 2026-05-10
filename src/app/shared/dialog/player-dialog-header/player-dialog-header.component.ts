import { Component, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { PlayerBase } from '@app/core/api/model/player-base.model';
import { TeamBase } from '@app/core/api/model/team-base.model';
import { TeamBaseContainer } from '@app/core/api/model/team-base-container';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';
import { DynamicListDialogHeaderComponent } from '@app/shared/dialog/dynamic-list-dialog-header/dynamic-list-dialog-header.component';

@Component({
  selector: 'app-player-dialog-header',
  imports: [AvatarComponent, NgClass, IconButtonComponent],
  templateUrl: './player-dialog-header.component.html',
})
export class PlayerDialogHeaderComponent extends DynamicListDialogHeaderComponent {
  protected override team = computed<TeamBase>(() => {
    const teamSelector = this.config.data.teamSelector as ((item: unknown) => TeamBase) | undefined;
    return teamSelector
      ? teamSelector(this.current())
      : (this.current() as unknown as TeamBaseContainer).team;
  });

  protected player = computed<PlayerBase>(
    () => (this.current() as unknown as { player: PlayerBase }).player,
  );
}
