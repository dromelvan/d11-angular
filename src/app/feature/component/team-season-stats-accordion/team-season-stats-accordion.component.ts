import { Component, input } from '@angular/core';
import { TeamSeasonStat } from '@app/core/api';
import { IconComponent } from '@app/shared/icon/icon.component';
import { TeamImgComponent } from '@app/shared/img/team-img/team-img.component';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';

@Component({
  selector: 'app-team-season-stats-accordion',
  templateUrl: './team-season-stats-accordion.component.html',
  styleUrl: './team-season-stats-accordion.component.css',
  imports: [
    IconComponent,
    TeamImgComponent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
  ],
  host: { style: 'display: block' },
})
export class TeamSeasonStatsAccordionComponent {
  readonly teamSeasonStats = input.required<TeamSeasonStat[]>();

  protected rowBackgroundColor(index: number): string | null {
    if (index === 0) return 'var(--p-primary-color)';
    if (index < 4) return 'var(--p-primary-300)';
    if (index >= this.teamSeasonStats().length - 3) return 'var(--p-surface-500)';
    return null;
  }

  protected rowTextColor(index: number): string | null {
    if (index < 4 || index >= this.teamSeasonStats().length - 3) {
      return 'var(--p-primary-contrast-color)';
    }
    return null;
  }
}
