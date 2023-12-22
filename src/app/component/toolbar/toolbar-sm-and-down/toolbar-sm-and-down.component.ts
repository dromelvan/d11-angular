import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { BreakpointService } from './../../../shared/services/breakpoint.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-toolbar-sm-and-down',
    imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule
    ],
    standalone: true,
    templateUrl: './toolbar-sm-and-down.component.html',
    styleUrls: ['./toolbar-sm-and-down.component.scss']
})
export class ToolbarSmAndDownComponent {

    constructor(protected breakpointService: BreakpointService, protected sidenav: SidenavComponent) { }

}
