import { DraftPickOrderTypeEnum } from '../../enums/draft-pick-order-type.enum';

export class DraftSettingsModel {
  PickOrderType: DraftPickOrderTypeEnum;
  SelectionTime: number;

  constructor() {
    this.PickOrderType = DraftPickOrderTypeEnum.None;
    this.SelectionTime = 0;
  }
}
