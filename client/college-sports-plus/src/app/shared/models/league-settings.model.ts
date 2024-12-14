import { DraftPickOrderTypeEnum } from '../enums/draft-pick-order-type.enum';

export class LeagueSettingsModel {
  DraftPickOrderType: DraftPickOrderTypeEnum;
  DraftSelectionTime: number;

  constructor() {
    this.DraftPickOrderType = DraftPickOrderTypeEnum.None;
    this.DraftSelectionTime = 0;
  }
}
