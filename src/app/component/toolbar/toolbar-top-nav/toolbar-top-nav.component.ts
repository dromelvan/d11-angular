import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'd11-toolbar-top-nav',
    templateUrl: './toolbar-top-nav.component.html',
    styleUrls: ['./toolbar-top-nav.component.scss'],
    imports: [MatToolbarModule, MatButtonModule, MatIconModule],
})
export class ToolbarTopNavComponent {}
