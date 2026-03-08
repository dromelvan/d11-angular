import { Component, computed, input } from '@angular/core';

export type IconPreset = 'account_circle' | 'check' | 'test';

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
