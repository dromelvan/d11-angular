import { Component, computed, input } from '@angular/core';
import { MatchEvent } from '@app/shared/model';
import { IconComponent } from '@app/shared/icon/icon.component';

@Component({
  selector: 'app-match-event',
  imports: [IconComponent],
  templateUrl: './match-event.component.html',
})
export class MatchEventComponent {
  matchEvent = input.required<MatchEvent>();

  protected isAway = computed(() => this.matchEvent().team === 'away');

  protected displayName = computed(() => {
    const event = this.matchEvent();
    const typeLength = event.type === 'penalty' ? 2 : event.type === 'ownGoal' ? 3 : 0;

    if (event.player.name.length + typeLength <= 14) {
      return event.player.name;
    } else if (event.player.shortName.length + typeLength <= 14) {
      return event.player.shortName;
    }
    return event.player.lastName;
  });
}
