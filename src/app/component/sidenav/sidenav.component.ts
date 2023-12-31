import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

@Component({
    imports: [
        MatSidenavModule,
        MatListModule,
        MatIconModule
    ],
    standalone: true,
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

    @ViewChild('sidenav') sidenav!: MatSidenav;

    toggle(): void {
        this.sidenav.toggle();
    }

}
