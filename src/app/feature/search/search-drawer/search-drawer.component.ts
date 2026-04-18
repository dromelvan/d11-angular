import { Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerSearchResult } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';
import { InputText } from 'primeng/inputtext';
import { IconComponent } from '@app/shared/icon/icon.component';
import { NgClass } from '@angular/common';
import { PlayerSearchService } from '@app/feature/search/player-search.service';

@Component({
  selector: 'app-search-drawer',
  imports: [InputText, FormsModule, AvatarComponent, IconComponent, NgClass],
  templateUrl: './search-drawer.component.html',
  providers: [PlayerSearchService],
})
export class SearchDrawerComponent {
  protected value = signal<string>('');
  protected results = computed(() => this.playerSearchService.results() ?? []);
  protected visible = false;

  @ViewChild('searchInput') private searchInput!: ElementRef<HTMLInputElement>;

  private playerSearchService = inject(PlayerSearchService);
  private routerService = inject(RouterService);

  open(): void {
    this.visible = true;
    this.searchInput.nativeElement.focus();
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.playerSearchService.search(value);
  }

  protected select(player: PlayerSearchResult): void {
    this.onClose();
    this.routerService.navigateToPlayer(player.id, undefined, false);
  }

  protected onClose(): void {
    this.visible = false;
    this.value.set('');
    this.playerSearchService.search('');
  }
}
