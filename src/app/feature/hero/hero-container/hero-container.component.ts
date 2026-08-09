import { Component, computed, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { PRIMARY } from '@app/app.theme';
import { contrastTextClass } from '@app/shared/util/contrast-text.util';
import { PageContextService } from '@app/core/page-context/page-context.service';

@Component({
  selector: 'app-hero-container',
  templateUrl: './hero-container.component.html',
  imports: [NgClass],
  host: { style: 'display: block' },
})
export class HeroContainerComponent {
  readonly height = input<number>(70);

  protected readonly backgroundColor = computed(
    () => this.pageContextService.backgroundColor() ?? PRIMARY,
  );
  protected readonly textClass = computed(() => contrastTextClass(this.backgroundColor()));

  private readonly pageContextService = inject(PageContextService);
}
