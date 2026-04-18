import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

interface NavLink {
  label: string;
  routerLink: string[];
}

@Component({
  selector: 'app-navbar-link',
  imports: [RouterLink, RouterLinkActive, Menu],
  templateUrl: './navbar-link.component.html',
})
export class NavbarLinkComponent {
  protected readonly links: NavLink[] = [
    { label: 'Matches', routerLink: ['match-weeks'] },
    { label: 'Tables', routerLink: ['seasons'] },
    { label: 'Players', routerLink: ['players'] },
    { label: 'Transfers', routerLink: ['transfers'] },
  ];

  protected readonly moreMenuItems: MenuItem[] = [
    { label: 'D11 Teams', icon: 'pi pi-building', routerLink: ['d11-teams'] },
    { label: 'Rules', icon: 'pi pi-users', routerLink: ['rules'] },
    { label: 'History', icon: 'pi pi-clock' },
    { label: 'Statistics', icon: 'pi pi-chart-bar' },
    { label: 'About', icon: 'pi pi-info-circle' },
  ];
}
