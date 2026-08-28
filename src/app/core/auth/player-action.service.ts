import { computed, inject, Injectable, signal } from '@angular/core';
import type { Player, PlayerTransferContext } from '@app/core/api';
import { UserActionService } from './user-action.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerActionService {
  readonly drawerVisible = signal(false);
  readonly player = signal<Player | undefined>(undefined);
  readonly transferContext = signal<PlayerTransferContext | undefined>(undefined);
  readonly isAdministrator = computed(() => this.userActionService.isAdministrator());
  readonly loggedIn = computed(() => this.userActionService.loggedIn());

  private userActionService = inject(UserActionService);

  open(player: Player, transferContext?: PlayerTransferContext): void {
    this.player.set(player);
    this.transferContext.set(transferContext);
    this.drawerVisible.set(true);
  }

  close(): void {
    this.drawerVisible.set(false);
    this.player.set(undefined);
    this.transferContext.set(undefined);
  }
}
