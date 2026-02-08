import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar-icon',
  imports: [],
  templateUrl: './navbar-icon.component.html',
})
export class NavbarIconComponent {
  links: MenuItem[] = [
    { label: 'Matches', icon: 'pi pi-calendar', url: '#' },
    { label: 'Tables', icon: 'pi pi-trophy', url: '#' },
    { label: 'Players', icon: 'pi pi-users', url: '#' },
    { label: 'Transfers', icon: 'pi pi-arrow-right-arrow-left', url: '#' },
    { label: 'More', icon: 'pi pi-ellipsis-h', url: '#' },
  ];
}
