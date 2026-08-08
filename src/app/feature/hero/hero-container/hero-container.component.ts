import { Component, computed, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { PageContextService } from '@app/core/page-context/page-context.service';

@Component({
  selector: 'app-hero-container',
  templateUrl: './hero-container.component.html',
  imports: [NgClass],
  host: { style: 'display: block' },
})
export class HeroContainerComponent {
  readonly height = input<number>(70);

  protected readonly backgroundColor = computed(() => this.pageContextService.backgroundColor());
  protected readonly textClass = computed(() => this.pageContextService.textClass());

  private readonly pageContextService = inject(PageContextService);
}
