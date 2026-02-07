import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-navbar-link',
  imports: [Menu],
  templateUrl: './navbar-link.component.html',
})
export class NavbarLinkComponent {
  links: MenuItem[] = [
    { label: 'Matches', url: '#' },
    { label: 'Tables', url: '#' },
    { label: 'Players', url: '#' },
    { label: 'Transfers', url: '#' },
  ];

  moreMenuItems: MenuItem[] = [
    { label: 'D11 Teams', icon: 'pi pi-building' },
    { label: 'Rules', icon: 'pi pi-users' },
    { label: 'History', icon: 'pi pi-clock' },
    { label: 'Statistics', icon: 'pi pi-chart-bar' },
    { label: 'About', icon: 'pi pi-info-circle' },
  ];
}
