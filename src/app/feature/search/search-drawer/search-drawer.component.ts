import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerApiService, PlayerSearchResult } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';
import { InputText } from 'primeng/inputtext';
import { IconComponent } from '@app/shared/icon/icon.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-search-drawer',
  imports: [InputText, FormsModule, AvatarComponent, IconComponent, NgClass],
  templateUrl: './search-drawer.component.html',
})
export class SearchDrawerComponent {
  protected visible = false;
  protected results = signal<PlayerSearchResult[]>([]);
  protected value = signal<string>('');

  @ViewChild('searchInput') private searchInput!: ElementRef<HTMLInputElement>;

  private playerApiService = inject(PlayerApiService);
  private routerService = inject(RouterService);

  open(): void {
    this.visible = true;
    this.searchInput.nativeElement.focus();
  }

  protected onInput(value: string): void {
    this.value.set(value);
    if (value.length >= 3) {
      this.playerApiService.search(value).subscribe({
        next: (result) => this.results.set(result),
        error: () => {},
      });
    } else {
      this.results.set([]);
    }
  }

  protected select(player: PlayerSearchResult): void {
    this.onClose();
    this.routerService.navigateToPlayer(player.id, undefined, false);
  }

  protected onClose(): void {
    this.visible = false;
    this.value.set('');
    this.results.set([]);
  }
}
