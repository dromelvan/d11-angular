import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-hero-container',
  templateUrl: './hero-container.component.html',
  imports: [NgClass],
  host: { style: 'display: block' },
})
export class HeroContainerComponent {
  readonly color = input.required<string>();
  readonly height = input<number>(70);
  readonly textClass = input.required<string>();
}
