import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { ScrollPickerItem } from './scroll-picker-item.model';

@Component({
  selector: 'app-scroll-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
      '[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]',
  },
  templateUrl: './scroll-picker.component.html',
})
export class ScrollPickerComponent {
  items = input.required<ScrollPickerItem[]>();
  selectedId = input.required<number>();
  selected = output<number>();

  private host = inject(ElementRef<HTMLElement>);

  constructor() {
    let initialized = false;

    effect(() => {
      const id = this.selectedId();
      const behavior: ScrollBehavior = initialized ? 'smooth' : 'instant';
      initialized = true;

      // Defer one tick. The effect runs during Angular's rendering cycle, before the DOM is fully
      // updated, so the [data-id] element may not exist yet. The timeout lets Angular finish
      // rendering first.
      setTimeout(() => {
        const button = this.host.nativeElement.querySelector(
          `[data-id="${id}"]`,
        ) as HTMLElement | null;

        button?.scrollIntoView({ inline: 'center', block: 'nearest', behavior });
      });
    });
  }
}
