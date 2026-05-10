import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export type FormType = 'player' | 'team';

@Component({
  selector: 'app-form-match-points',
  imports: [NgClass],
  templateUrl: './form-match-points.component.html',
  host: { class: 'contents' },
})
export class FormMatchPointsComponent {
  readonly formMatchPoints = input.required<number[]>();
  readonly type = input.required<FormType>();

  protected readonly badges = computed(() => {
    const type = this.type();
    return this.formMatchPoints().map((points) => ({
      label: type === 'team' ? (points === 3 ? 'W' : points === 1 ? 'D' : 'L') : String(points),
      bgClass:
        type === 'team'
          ? points === 3
            ? 'bg-success'
            : points === 1
              ? 'bg-neutral'
              : 'bg-error'
          : points > 0
            ? 'bg-success'
            : points < 0
              ? 'bg-error'
              : 'bg-neutral',
    }));
  });
}
