import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'heightPipe',
})
export class HeightPipe implements PipeTransform {
  transform(value: number | null, unit: 'feet' | 'cm' = 'feet'): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (unit === 'feet') {
      const feet = Math.floor(value / 12);
      const inches = value % 12;
      return `${feet}' ${inches}"`;
    } else if (unit === 'cm') {
      return `${value} cm`;
    } else {
      return '';
    }
  }
}
