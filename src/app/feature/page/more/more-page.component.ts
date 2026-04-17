import { Component, inject } from '@angular/core';
import { RouterService } from '@app/core/router/router.service';
import { IconComponent, IconPreset } from '@app/shared/icon/icon.component';

interface MoreNavItem {
  label: string;
  icon: IconPreset;
  navigate: () => void;
}

@Component({
  selector: 'app-more-page',
  imports: [IconComponent],
  templateUrl: './more-page.component.html',
})
export class MorePageComponent {
  protected readonly items: MoreNavItem[] = [
    { label: 'Rules', icon: 'rules', navigate: () => this.routerService.navigateToRules() },
    {
      label: 'D11 Teams',
      icon: 'd11_teams',
      navigate: () => this.routerService.navigateToD11Teams(),
    },
  ];

  private routerService = inject(RouterService);
}
