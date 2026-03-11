import { Component, input } from '@angular/core';
import { MatchEvent } from '@app/shared/model';
import { MatchEventComponent } from '@app/shared/resource/match-event/match-event.component';

@Component({
  selector: 'app-match-events',
  imports: [MatchEventComponent],
  templateUrl: './match-events.component.html',
})
export class MatchEventsComponent {
  matchEvents = input.required<MatchEvent[]>();
}
