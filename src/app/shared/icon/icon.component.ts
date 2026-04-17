import { Component, computed, input } from '@angular/core';

export type IconPreset =
  | 'account_circle'
  | 'check'
  | 'chevron_left'
  | 'chevron_right'
  | 'd11_teams'
  | 'goal'
  | 'league_table'
  | 'match'
  | 'match_week'
  | 'mom'
  | 'more_horizontal'
  | 'more_vertical'
  | 'own_goal'
  | 'player'
  | 'ranking_down'
  | 'ranking_up'
  | 'red_card'
  | 'rules'
  | 'search'
  | 'shared_mom'
  | 'substitution_off'
  | 'substitution_on'
  | 'yellow_card'
  | 'test';

export const ICON_PRESETS: Record<
  IconPreset,
  {
    name: string;
    fill?: boolean;
    weight: 100 | 200 | 300 | 400 | 500 | 600 | 700;
    size?: number;
    class?: string;
  }
> = {
  account_circle: { name: 'account_circle', weight: 300 },
  check: { name: 'check', weight: 600, class: 'text-success' },
  chevron_left: { name: 'chevron_left', weight: 300, size: 42 },
  chevron_right: { name: 'chevron_right', weight: 300, size: 42 },
  d11_teams: { name: 'groups', fill: true, weight: 400 },
  goal: { name: 'sports_and_outdoors', weight: 200, size: 22 },
  league_table: { name: 'table_rows_narrow', weight: 300 },
  match: { name: 'date_range', weight: 300, size: 32 },
  match_week: { name: 'date_range', weight: 300 },
  mom: { name: 'star', fill: true, weight: 400, class: 'text-primary' },
  more_horizontal: { name: 'more_horiz', fill: false, weight: 300, size: 28 },
  more_vertical: { name: 'more_vert', fill: false, weight: 300, size: 28 },
  own_goal: { name: 'sports_and_outdoors', weight: 200, size: 22, class: 'text-error' },
  player: { name: 'person', fill: true, weight: 200 },
  ranking_down: { name: 'arrow_downward', fill: true, weight: 500, class: 'text-error' },
  ranking_up: { name: 'arrow_upward', fill: true, weight: 500, class: 'text-success' },
  red_card: { name: 'crop_portrait', fill: true, weight: 400, class: 'text-error' },
  rules: { name: 'gavel', fill: true, weight: 400 },
  search: { name: 'search', weight: 200 },
  shared_mom: { name: 'star_half', fill: true, weight: 400, class: 'text-primary' },
  substitution_off: { name: 'arrow_downward', fill: true, weight: 400, class: 'text-error' },
  substitution_on: { name: 'arrow_upward', fill: true, weight: 400, class: 'text-success' },
  yellow_card: { name: 'crop_portrait', fill: true, weight: 400, class: 'text-warning' },

  test: { name: 'bug_report', fill: true, weight: 700, size: 56, class: 'text-2xl' },
};

@Component({
  selector: 'app-icon',
  template: '',
  host: {
    '[class]': 'resolvedClass()',
    '[textContent]': 'resolvedName()',
    '[style.font-size.px]': 'resolvedSize()',
    '[style.font-variation-settings]': 'variationSettings()',
  },
})
export class IconComponent {
  readonly icon = input<IconPreset>();
  readonly name = input<string>();
  readonly fill = input<boolean>();
  readonly weight = input<100 | 200 | 300 | 400 | 500 | 600 | 700>();
  readonly size = input<number>();

  protected readonly resolvedName = computed(() => {
    const icon_name = this.icon();
    return this.name() ?? (icon_name ? ICON_PRESETS[icon_name].name : '');
  });

  protected readonly resolvedClass = computed(() => {
    const icon_name = this.icon();
    const presetClass = icon_name ? ICON_PRESETS[icon_name].class : undefined;
    return ['material-symbols-outlined', presetClass].filter(Boolean).join(' ');
  });

  protected readonly resolvedFill = computed(() => {
    const icon_name = this.icon();
    const fill = this.fill() ?? (icon_name ? ICON_PRESETS[icon_name].fill : false);
    return fill ? 1 : 0;
  });

  protected readonly resolvedWeight = computed(() => {
    const icon_name = this.icon();
    return this.weight() ?? (icon_name ? ICON_PRESETS[icon_name].weight : 400);
  });

  protected readonly resolvedSize = computed(() => {
    const icon_name = this.icon();
    return this.size() ?? (icon_name ? ICON_PRESETS[icon_name].size : undefined) ?? 24;
  });

  protected readonly variationSettings = computed(
    () =>
      `'FILL' ${this.resolvedFill()}, 'wght' ${this.resolvedWeight()}, 'GRAD' 0, 'opsz' ${this.resolvedSize()}`,
  );
}
