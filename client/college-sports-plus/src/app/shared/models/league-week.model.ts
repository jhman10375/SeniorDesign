import { WeekStatusEnum } from '../enums/week-status.enum';
import { LeagueGameModel } from './league-game.model';

export class LeagueWeekModel {
  ID: string;
  LeagueID: string;
  Week: number;
  Status: WeekStatusEnum;
  Games: Array<LeagueGameModel>;
}
