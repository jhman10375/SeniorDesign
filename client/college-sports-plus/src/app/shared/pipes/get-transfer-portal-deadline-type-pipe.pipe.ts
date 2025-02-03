import { Pipe, PipeTransform } from '@angular/core';

import { TransferPortalDeadlineTypeEnum } from '../enums/transfer-portal-deadline-type.enum';

@Pipe({
  name: 'transferPortalDeadlineTypePipe',
})
export class TransferPortalDeadlineTypePipe implements PipeTransform {
  transform(value: TransferPortalDeadlineTypeEnum): any {
    switch (value) {
      case TransferPortalDeadlineTypeEnum.IndividualGameStart:
        return 'Game Start';
      case TransferPortalDeadlineTypeEnum.WednesdayNight:
        return 'Wednesday Night';
    }
  }
}
