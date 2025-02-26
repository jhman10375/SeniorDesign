import { GameFAPIModel } from './game-fapi.model';

export class WeekFAPIModel {
  week_num: number;
  week_matches: Array<GameFAPIModel>;

  constructor() {
    this.week_num = -1;
    this.week_matches = [];
  }
}
