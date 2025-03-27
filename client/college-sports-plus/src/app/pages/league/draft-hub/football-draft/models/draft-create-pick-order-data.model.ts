import { DraftPickOrderTypeEnum } from '../../../../../shared/enums/draft-pick-order-type.enum';

export class DraftCreatePickOrderDataWSModel {
  draft_type: DraftPickOrderTypeEnum;
  user_ids: Array<string>;
  number_of_rounds: number;

  constructor() {
    this.draft_type = DraftPickOrderTypeEnum.RandomSnake;
    this.user_ids = [];
    this.number_of_rounds = 0;
  }
}
