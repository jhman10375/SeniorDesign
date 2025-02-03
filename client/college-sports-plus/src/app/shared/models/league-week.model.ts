import { WeekStatusEnum } from '../enums/week-status.enum';
import { HasID } from '../services/firebase/interfaces/has-id.interface';
import { LeagueGameModel } from './league-game.model';

export class LeagueWeekModel implements HasID {
  ID: string;
  LeagueID: string;
  Week: number;
  Status: WeekStatusEnum;
  Games: Array<LeagueGameModel>;
}
