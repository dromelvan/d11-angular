import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'd11-toolbar-menu',
    imports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule],
    standalone: true,
    templateUrl: './toolbar-menu.component.html',
    styleUrls: ['./toolbar-menu.component.scss']
})
export class ToolbarMenuComponent {

}
