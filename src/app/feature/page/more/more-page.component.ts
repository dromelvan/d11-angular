import { Component, computed, inject, signal } from '@angular/core';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { IconComponent, IconPreset } from '@app/shared/icon/icon.component';
import { SectionComponent } from '@app/shared/section/section.component';

interface MoreNavItem {
  label: string;
  icon: IconPreset;
  navigate: () => void;
}

@Component({
  selector: 'app-more-page',
  imports: [IconComponent, SectionComponent],
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
    { label: 'History', icon: 'history', navigate: () => this.routerService.navigateToHistory() },
  ];

  private readonly currentService = inject(CurrentService);
  private readonly pageContextService = inject(PageContextService);
  private readonly routerService = inject(RouterService);

  constructor() {
    this.pageContextService.setContext({
      title: signal('More'),
      subtitle: computed(() => {
        const name = this.currentService.season()?.name;
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: signal(''),
    });
  }
}
