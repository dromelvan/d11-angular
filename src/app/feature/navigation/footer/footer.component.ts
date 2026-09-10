import { Component, signal } from '@angular/core';
import { APP_VERSION } from '@app/version';
import { NavbarIconComponent } from '@app/feature/navigation/navbar-icon/navbar-icon.component';

@Component({
  selector: 'app-footer',
  imports: [NavbarIconComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  version = signal(APP_VERSION);
}
