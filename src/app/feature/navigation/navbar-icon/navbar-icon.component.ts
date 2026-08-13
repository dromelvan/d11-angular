import { Component, inject } from '@angular/core';
import { RouterService } from '@app/core/router/router.service';
import { CurrentService } from '@app/core/current/current.service';

interface NavItem {
  label: string;
  icon: string;
  navigateTo: 'currentMatchWeek' | 'players' | 'table' | 'transfers' | 'more';
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
    { label: 'Transfers', icon: 'pi pi-arrow-right-arrow-left', navigateTo: 'transfers' },
    { label: 'More', icon: 'pi pi-ellipsis-h', navigateTo: 'more' },
  ];

  private readonly currentService = inject(CurrentService);
  private readonly routerService = inject(RouterService);

  protected navigate(item: NavItem): void {
    if (item.navigateTo === 'currentMatchWeek') {
      const matchWeekId = this.currentService.matchWeek()?.id;
      if (matchWeekId) {
        this.routerService.navigateToMatchWeekMatches(matchWeekId);
      } else {
        this.routerService.navigateToMatches();
      }
    } else if (item.navigateTo === 'players') {
      this.routerService.navigateToPlayers();
    } else if (item.navigateTo === 'table') {
      this.routerService.navigateToSeason(this.currentService.season()?.id as number);
    } else if (item.navigateTo === 'transfers') {
      this.routerService.navigateToTransferWindow(
        this.currentService.transferWindow()?.id as number,
      );
    } else if (item.navigateTo === 'more') {
      this.routerService.navigateToMore();
    }
  }
}
