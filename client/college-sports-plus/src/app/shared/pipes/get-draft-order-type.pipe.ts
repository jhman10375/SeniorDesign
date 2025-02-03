import { Pipe, PipeTransform } from '@angular/core';

import { DraftPickOrderTypeEnum } from '../enums/draft-pick-order-type.enum';

@Pipe({
  name: 'draftOrderTypePipe',
})
export class DraftOrderTypeTypePipe implements PipeTransform {
  transform(value: DraftPickOrderTypeEnum): any {
    switch (value) {
      case DraftPickOrderTypeEnum.AlphabeticalSequence:
        return 'Alphabetical Sequence';
      case DraftPickOrderTypeEnum.AlphabeticalSnake:
        return 'Alphabetical Snake';
      case DraftPickOrderTypeEnum.CustomSequence:
        return 'Custom Sequence';
      case DraftPickOrderTypeEnum.CustomSnake:
        return 'Custom Snake';
      case DraftPickOrderTypeEnum.RandomSequence:
        return 'Random Sequence';
      case DraftPickOrderTypeEnum.RandomSnake:
        return 'Random Snake';
    }
  }
}
