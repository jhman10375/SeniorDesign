import { DraftPickOrderTypeEnum } from '../../../../../enums/draft-pick-order-type.enum';

export class DraftSettingsDLModel {
  POT: DraftPickOrderTypeEnum;
  ST: number;
  D: Date;
  IBID: boolean;

  constructor() {
    this.POT = DraftPickOrderTypeEnum.RandomSnake;
    this.ST = 90;
    this.D = new Date();
    this.IBID = true;
  }
}
