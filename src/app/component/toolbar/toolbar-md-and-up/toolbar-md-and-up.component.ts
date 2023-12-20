import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-toolbar-md-and-up',
  imports: [ MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule ],
  standalone: true,
  templateUrl: './toolbar-md-and-up.component.html',
  styleUrls: ['./toolbar-md-and-up.component.scss']
})
export class ToolbarMdAndUpComponent {

}
