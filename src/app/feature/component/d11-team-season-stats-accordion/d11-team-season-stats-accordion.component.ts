import { Component, inject, input } from '@angular/core';
import { D11TeamSeasonStat } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { FormMatchPointsComponent } from '@app/shared/form-match-points/form-match-points.component';
import { IconComponent } from '@app/shared/icon/icon.component';
import { D11TeamImgComponent } from '@app/shared/img/d11-team-img/d11-team-img.component';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';

@Component({
  selector: 'app-d11-team-season-stats-accordion',
  templateUrl: './d11-team-season-stats-accordion.component.html',
  styleUrl: './d11-team-season-stats-accordion.component.css',
  imports: [
    FormMatchPointsComponent,
    IconComponent,
    SvgIconComponent,
    D11TeamImgComponent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
  ],
  host: { style: 'display: block' },
})
export class D11TeamSeasonStatsAccordionComponent {
  readonly d11TeamSeasonStats = input.required<D11TeamSeasonStat[]>();

  private readonly routerService = inject(RouterService);

  protected navigateToD11Team(stat: D11TeamSeasonStat): void {
    this.routerService.navigateToD11Team(stat.d11Team.id, stat.season.id);
  }

  protected rowBackgroundColor(index: number): string | null {
    if (index === 0) return 'var(--p-primary-color)';
    if (index < 4) return 'var(--p-primary-300)';
    if (index >= this.d11TeamSeasonStats().length - 3) return 'var(--p-surface-500)';
    return null;
  }

  protected rowTextColor(index: number): string | null {
    if (index < 4 || index >= this.d11TeamSeasonStats().length - 3) {
      return 'var(--p-primary-contrast-color)';
    }
    return null;
  }
}
