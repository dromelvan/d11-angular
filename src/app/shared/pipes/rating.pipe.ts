import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rating',
})
export class RatingPipe implements PipeTransform {
  transform(value: unknown): string | undefined {
    if (typeof value !== 'number' || isNaN(value)) return undefined;
    const decimal = value / 100;
    return decimal.toFixed(2);
  }
}
