import { Component, inject } from '@angular/core';
import { D11LionLightImgComponent } from '@app/shared/img/d11-lion-light-img/d11-lion-light-img.component';
import { NavbarLinkComponent } from '@app/feature/navigation/navbar-link/navbar-link.component';
import { UtilityBarComponent } from '@app/feature/navigation/utility-bar/utility-bar.component';
import { RouterSectionComponent } from '@app/feature/navigation/router-section/router-section.component';
import { RouterService } from '@app/core/router/router.service';
import { IconComponent } from '@app/shared/icon/icon.component';

@Component({
  selector: 'app-header',
  imports: [
    D11LionLightImgComponent,
    NavbarLinkComponent,
    UtilityBarComponent,
    RouterSectionComponent,
    IconComponent,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  protected readonly routerService = inject(RouterService);
}
