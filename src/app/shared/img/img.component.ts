import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-img',
  imports: [NgOptimizedImage],
  templateUrl: './img.component.html',
})
export class ImgComponent {
  @Input() src!: string;
  @Input() size!: number;
  @Input() alt!: string;
}
