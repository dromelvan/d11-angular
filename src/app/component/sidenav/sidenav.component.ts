import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

@Component({
    imports: [MatSidenavModule, MatListModule, MatIconModule],
    standalone: true,
    selector: 'd11-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
    @ViewChild('sidenav') sidenav!: MatSidenav;

    toggle() {
        this.sidenav.toggle();
    }

    onOpen(): void {
        // CSS to prevent background scrolling is in global styles.scss
        document.body.classList.add('sidenav-open');
    }

    onClosed(): void {
        document.body.classList.remove('sidenav-open');
    }
}
