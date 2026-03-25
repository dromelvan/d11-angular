import { Component, computed, input } from '@angular/core';
import { TeamBase } from '@app/core/api';
import { TeamImgComponent } from '@app/shared/img';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-team-base',
  imports: [TeamImgComponent, NgClass],
  templateUrl: './team-base.component.html',
})
export class TeamBaseComponent {
  team = input.required<TeamBase>();
  justify = input<'start' | 'center' | 'end'>();
  imgWidth = input<string>();
  maxLength = input<number>();

  protected displayName = computed(() => {
    const t = this.team();
    const max = this.maxLength();
    return max !== undefined && t.name.length > max ? t.shortName : t.name;
  });
}
