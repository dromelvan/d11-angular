import { NgOptimizedImage } from '@angular/common';
import { booleanAttribute, Component, Input } from '@angular/core';

@Component({
  selector: 'app-img',
  imports: [NgOptimizedImage],
  templateUrl: './img.component.html',
})
export class ImgComponent {
  @Input() src!: string;
  @Input() size!: number;
  @Input() alt!: string;
  @Input({ transform: booleanAttribute }) priority = false;
}
