import { Component, input } from '@angular/core';
import { MatchEvent } from '@app/shared/model';
import { SectionComponent } from '@app/shared/section/section.component';
import { IconComponent } from '@app/shared/icon/icon.component';

@Component({
  selector: 'app-match-events-section',
  templateUrl: './match-events-section.component.html',
  imports: [SectionComponent, IconComponent],
  host: { style: 'display: block' },
})
export class MatchEventsSectionComponent {
  readonly events = input.required<MatchEvent[]>();
}
