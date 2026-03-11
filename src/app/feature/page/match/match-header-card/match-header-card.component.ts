import { Component, computed, input } from '@angular/core';
import { PRIMARY } from '@app/app.theme';
import { Match, PlayerMatchStat } from '@app/core/api';
import type { Stadium } from '@app/core/api/model/stadium.model';
import { Card } from 'primeng/card';
import { MatchEvent } from '@app/shared/model';
import { matchEvents } from '@app/shared/util/match-events.util';
import { contrastTextClass } from '@app/shared/util/contrast-text.util';
import { MatchEventsComponent } from '@app/shared/resource/match-events/match-events.component';
import { MatchHeaderComponent } from '@app/feature/page/match/match-header/match-header.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-match-header-card',
  imports: [Card, MatchEventsComponent, MatchHeaderComponent, NgClass],
  templateUrl: './match-header-card.component.html',
})
export class MatchHeaderCardComponent {
  match = input<Match | undefined>();
  stadium = input<Stadium | undefined>();
  playerMatchStats = input<PlayerMatchStat[] | undefined>();

  protected backgroundColor = computed(() => this.match()?.homeTeam.colour ?? PRIMARY);
  protected textClass = computed(() => contrastTextClass(this.backgroundColor()));

  protected matchEvents = computed<MatchEvent[]>(() => {
    const m = this.match();
    if (!m) return [];
    return matchEvents(m, this.playerMatchStats());
  });
}
