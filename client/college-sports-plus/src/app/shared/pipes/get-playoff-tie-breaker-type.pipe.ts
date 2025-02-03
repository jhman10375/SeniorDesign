import { Pipe, PipeTransform } from '@angular/core';

import { TieBreakerTypeEnum } from '../enums/tie-breaker-type.enum';

@Pipe({
  name: 'playoffTieBreakerTypePipe',
})
export class PlayoffTieBreakerTypePipe implements PipeTransform {
  transform(value: TieBreakerTypeEnum): any {
    switch (value) {
      case TieBreakerTypeEnum.PointsAgainst:
        return 'Points Against';
      case TieBreakerTypeEnum.Combo:
        return 'Combo';
      case TieBreakerTypeEnum.PointsFor:
        return 'Points For';
    }
  }
}
