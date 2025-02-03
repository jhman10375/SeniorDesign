import { Pipe, PipeTransform } from '@angular/core';

import { SeedingTypeEnum } from '../enums/seeding-type.enum';

@Pipe({
  name: 'playoffSeedingTypePipe',
})
export class PlayoffSeedingTypePipe implements PipeTransform {
  transform(value: SeedingTypeEnum): any {
    switch (value) {
      case SeedingTypeEnum.BestByConference:
        return 'Best by Conference';
      case SeedingTypeEnum.BestOverall:
        return 'Best Overall';
      case SeedingTypeEnum.Manual:
        return 'Manual';
    }
  }
}
