import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { BreakpointService } from '../../../shared/services/breakpoint.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'd11-toolbar-sidenav',
    imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
    standalone: true,
    templateUrl: './toolbar-sidenav.component.html',
    styleUrls: ['./toolbar-sidenav.component.scss'],
})
export class ToolbarSidenavComponent {
    constructor(
        protected breakpointService: BreakpointService,
        protected sidenav: SidenavComponent,
    ) {}
}
