import { Component, input, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-transfers-page',
  imports: [],
  templateUrl: './transfers-page.component.html',
})
export class TransfersPageComponent {
  readonly seasonId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v != null && v !== '' ? numberAttribute(v as string) : undefined),
  });
}
