import { Component, inject } from '@angular/core';
import { RouterService } from '@app/core/router/router.service';
import { Current, CurrentApiService } from '@app/core/api';
import { rxResource } from '@angular/core/rxjs-interop';

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

  private rxCurrent = rxResource<Current, void>({
    stream: () => this.currentApiService.getCurrent(),
  });

  private readonly routerService = inject(RouterService);
  private readonly currentApiService = inject(CurrentApiService);

  protected navigate(item: NavItem): void {
    if (item.navigateTo === 'currentMatchWeek') {
      this.routerService.navigateToMatchWeek(this.rxCurrent.value()?.matchWeek?.id as number);
    } else if (item.navigateTo === 'players') {
      this.routerService.navigateToPlayers();
    } else if (item.navigateTo === 'table') {
      this.routerService.navigateToSeason(this.rxCurrent.value()?.season?.id as number);
    } else if (item.navigateTo === 'transfers') {
      this.routerService.navigateToTransferWindow(
        this.rxCurrent.value()?.transferWindow?.id as number,
      );
    } else if (item.navigateTo === 'more') {
      this.routerService.navigateToMore();
    }
  }
}
