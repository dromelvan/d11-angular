import { Component, inject } from '@angular/core';
import { RouterService } from '@app/core/router/router.service';

interface NavItem {
  label: string;
  icon: string;
  url?: string;
  navigateTo?: 'currentMatchWeek' | 'players' | 'table';
}

@Component({
  selector: 'app-navbar-icon',
  imports: [],
  templateUrl: './navbar-icon.component.html',
})
export class NavbarIconComponent {
  protected readonly links: NavItem[] = [
    { label: 'Matches', icon: 'pi pi-calendar', navigateTo: 'currentMatchWeek' },
    { label: 'Tables', icon: 'pi pi-trophy', navigateTo: 'table' },
    { label: 'Players', icon: 'pi pi-users', navigateTo: 'players' },
    { label: 'Transfers', icon: 'pi pi-arrow-right-arrow-left', url: '#' },
    { label: 'More', icon: 'pi pi-ellipsis-h', url: '#' },
  ];

  private readonly routerService = inject(RouterService);

  protected navigate(item: NavItem): void {
    if (item.navigateTo === 'currentMatchWeek') {
      this.routerService.navigateToCurrentMatchWeek();
    } else if (item.navigateTo === 'players') {
      this.routerService.navigateToPlayers();
    } else if (item.navigateTo === 'table') {
      this.routerService.navigateToCurrentSeason();
    }
  }
}
