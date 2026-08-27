import { Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerSearchResult } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';
import { InputText } from 'primeng/inputtext';
import { NgClass } from '@angular/common';
import { PlayerSearchService } from '@app/feature/component/search/player-search.service';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';

@Component({
  selector: 'app-search-drawer',
  imports: [InputText, FormsModule, AvatarComponent, NgClass, SvgIconComponent],
  templateUrl: './search-drawer.component.html',
  providers: [PlayerSearchService],
})
export class SearchDrawerComponent {
  protected readonly results = computed(() => this.playerSearchService.results() ?? []);
  protected readonly value = signal<string>('');
  protected readonly visible = signal(false);

  @ViewChild('searchInput') private searchInput!: ElementRef<HTMLInputElement>;

  private playerSearchService = inject(PlayerSearchService);
  private routerService = inject(RouterService);

  open(): void {
    this.visible.set(true);
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
    this.visible.set(false);
    this.value.set('');
    this.playerSearchService.search('');
  }
}
