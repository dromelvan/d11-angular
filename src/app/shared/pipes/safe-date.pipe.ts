import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeDate',
  standalone: true,
})
export class SafeDatePipe implements PipeTransform {
  private datePipe = new DatePipe('en-US');

  transform(value: string | Date | null | undefined, format = 'd.M yyyy'): string {
    if (!value) return 'Unknown';

    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Unknown';

    try {
      return this.datePipe.transform(date, format) ?? 'Unknown';
    } catch {
      return 'Unknown';
    }
  }
}
