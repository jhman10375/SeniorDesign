import { WeekStatusEnum } from '../../../enums/week-status.enum';
import { LeagueGameDLModel } from './league-game-dl.model';

export class LeagueWeekDLModel {
  ID: string;
  LeagueID: string;
  Week: number;
  Status: WeekStatusEnum;
  Games: Array<LeagueGameDLModel>;

  constructor() {
    this.ID = '';
    this.LeagueID = '';
    this.Week = 0;
    this.Status = WeekStatusEnum.None;
    this.Games = [];
  }
}
