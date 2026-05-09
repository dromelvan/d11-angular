import { Pipe, PipeTransform } from '@angular/core';

const pluralRules = new Intl.PluralRules('en', { type: 'ordinal' });
const suffixes: Record<Intl.LDMLPluralRule, string> = {
  few: 'rd',
  many: 'th',
  one: 'st',
  other: 'th',
  two: 'nd',
  zero: 'th',
};

@Pipe({
  name: 'ordinal',
})
export class OrdinalPipe implements PipeTransform {
  transform(value: unknown): string | undefined {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) return undefined;
    return `${value}${suffixes[pluralRules.select(value)]}`;
  }
}
