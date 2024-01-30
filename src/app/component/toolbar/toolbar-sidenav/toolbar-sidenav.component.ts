import { Component, HostListener } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { CommonModule } from '@angular/common';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { BreakpointService } from '../../../shared/services/breakpoint.service';

@Component({
    selector: 'd11-toolbar-sidenav',
    imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
    standalone: true,
    templateUrl: './toolbar-sidenav.component.html',
    styleUrls: ['./toolbar-sidenav.component.scss'],
    animations: [
        trigger('scrollTrigger', [
            state(
                'hidden',
                style({
                    transform: 'translateY(-70px)',
                }),
            ),
            state(
                'shown',
                style({
                    transform: 'translateY(0px)',
                }),
            ),
            transition('shown => hidden', [animate('0.3s ease-in-out')]),
            transition('hidden => shown', [animate('0.3s ease-in-out')]),
        ]),
    ],
})
export class ToolbarSidenavComponent {
    constructor(
        protected breakpointService: BreakpointService,
        private sidenav: SidenavComponent,
    ) {}

    public hidden: boolean = false;

    public toggleSidenav(): void {
        this.sidenav.toggle();
    }

    @HostListener('window:scroll', [])
    private onWindowScroll(): void {
        // This works without requestAnimationFrame for Chrome and Firefox but not for Safari
        requestAnimationFrame(() => {
            this.hidden = window.scrollY > 30;
        });
    }
}
