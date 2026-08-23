import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  host: {
    class: 'app-col rounded-2xl p-4',
    '[class.bg-primary]': 'primary()',
    '[class.text-primary-contrast]': 'primary()',
    '[class.bg-surface-0]': '!primary()',
    '[class.border]': '!primary()',
    '[class.border-neutral-300]': '!primary()',
  },
})
export class InfoBoxComponent {
  readonly primary = input(false, { transform: booleanAttribute });
}
