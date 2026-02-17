import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true,
})
export class AgePipe implements PipeTransform {
  transform(dateString?: string | undefined): number | undefined {
    if (!dateString) return undefined;

    const dateOfBirth = new Date(dateString);
    if (isNaN(dateOfBirth.getTime())) return undefined;

    const today = new Date();

    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }
}
