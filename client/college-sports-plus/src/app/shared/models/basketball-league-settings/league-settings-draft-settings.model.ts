import { DraftPickOrderTypeEnum } from '../../enums/draft-pick-order-type.enum';

export class DraftSettingsModel {
  PickOrderType: DraftPickOrderTypeEnum;
  SelectionTime: number;
  Date: Date;
  IncludeBenchInDraft: boolean;

  constructor() {
    this.PickOrderType = DraftPickOrderTypeEnum.RandomSnake;
    this.SelectionTime = 90;
    this.Date = new Date();
    this.IncludeBenchInDraft = true;
  }
}
