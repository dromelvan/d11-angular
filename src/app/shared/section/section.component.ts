import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  host: { class: 'app-col', '[class.grow]': 'grow()' },
})
export class SectionComponent {
  readonly grow = input(false, { transform: booleanAttribute });
}
