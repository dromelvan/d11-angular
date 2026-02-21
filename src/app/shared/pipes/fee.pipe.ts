import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fee',
})
export class FeePipe implements PipeTransform {
  transform(value: unknown): string | undefined {
    if (typeof value !== 'number' || isNaN(value)) return undefined;
    const decimal = value / 10;
    return decimal.toFixed(1);
  }
}
