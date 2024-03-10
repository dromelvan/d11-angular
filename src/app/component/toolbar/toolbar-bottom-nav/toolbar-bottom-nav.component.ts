import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
    standalone: true,
    selector: 'd11-toolbar-bottom-nav',
    templateUrl: './toolbar-bottom-nav.component.html',
    styleUrls: ['./toolbar-bottom-nav.component.scss'],
    imports: [MatIconModule, MatToolbarModule, MatButtonModule],
})
export class ToolbarBottomNavComponent {}
