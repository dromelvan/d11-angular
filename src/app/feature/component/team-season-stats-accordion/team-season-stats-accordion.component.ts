import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TeamSeasonStat } from '@app/core/api';
import { TeamSeasonStatApiService } from '@app/core/api/team-season-stat/team-season-stat-api.service';
import { RouterService } from '@app/core/router/router.service';
import { FormMatchPointsComponent } from '@app/shared/form-match-points/form-match-points.component';
import { IconComponent } from '@app/shared/icon/icon.component';
import { TeamImgComponent } from '@app/shared/img/team-img/team-img.component';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-team-season-stats-accordion',
  templateUrl: './team-season-stats-accordion.component.html',
  styleUrl: './team-season-stats-accordion.component.css',
  imports: [
    FormMatchPointsComponent,
    IconComponent,
    SvgIconComponent,
    TeamImgComponent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    ProgressSpinner,
  ],
  host: { class: 'min-h-211' },
})
export class TeamSeasonStatsAccordionComponent {
  readonly seasonId = input.required<number>();

  protected readonly teamSeasonStats = computed(() => this.rxTeamSeasonStats.value() ?? []);
  protected readonly isLoading = computed(() => this.rxTeamSeasonStats.isLoading());

  private readonly rxTeamSeasonStats = rxResource<TeamSeasonStat[], number>({
    params: () => this.seasonId(),
    stream: ({ params }) => this.teamSeasonStatApiService.getTeamSeasonStatsBySeasonId(params),
  });

  private readonly routerService = inject(RouterService);
  private readonly teamSeasonStatApiService = inject(TeamSeasonStatApiService);

  protected navigateToTeam(stat: TeamSeasonStat): void {
    this.routerService.navigateToTeam(stat.team.id, stat.season.id);
  }

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
