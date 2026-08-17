import { Component, computed, input } from '@angular/core';

export type SvgIconName =
  | 'chevron-left'
  | 'chevron-right'
  | 'chevrons-left'
  | 'chevrons-right'
  | 'search'
  | 'person'
  | 'shield';
type SvgIconSize = 'sm' | 'md' | 'lg';

interface PathElement {
  type: 'path';
  d: string;
}
interface CircleElement {
  type: 'circle';
  cx: number;
  cy: number;
  r: number;
}
type SvgElement = PathElement | CircleElement;

const SVG_ICONS: Record<SvgIconName, SvgElement[]> = {
  'chevron-left': [{ type: 'path', d: 'M15 18l-6-6 6-6' }],
  'chevron-right': [{ type: 'path', d: 'M9 18l6-6-6-6' }],
  'chevrons-left': [
    { type: 'path', d: 'M11 18l-5-6 5-6' },
    { type: 'path', d: 'M17 18l-5-6 5-6' },
  ],
  'chevrons-right': [
    { type: 'path', d: 'M7 18l5-6-5-6' },
    { type: 'path', d: 'M13 18l5-6-5-6' },
  ],
  search: [
    { type: 'circle', cx: 11, cy: 11, r: 7 },
    { type: 'path', d: 'M20 20l-3.5-3.5' },
  ],
  person: [
    { type: 'circle', cx: 12, cy: 8, r: 4 },
    { type: 'path', d: 'M4 20c0-4 3.6-7 8-7s8 3 8 7' },
  ],
  shield: [
    { type: 'path', d: 'M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z' },
  ],
};

@Component({
  selector: 'app-svg-icon',
  templateUrl: './svg-icon.component.html',
  host: { class: 'contents' },
})
export class SvgIconComponent {
  readonly name = input.required<SvgIconName>();
  readonly size = input<SvgIconSize>('md');

  protected readonly elements = computed(() => SVG_ICONS[this.name()]);

  protected readonly sizeClass = computed(() => {
    switch (this.size()) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-7 h-7';
      default:
        return 'w-6 h-6';
    }
  });
}
