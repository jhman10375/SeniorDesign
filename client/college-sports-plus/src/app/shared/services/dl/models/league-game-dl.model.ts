import { HasID } from '../../firebase/interfaces/has-id.interface';
import { LeagueRosterAthleteDLModel } from './league-roster-athlete-dl.model';

export class LeagueGameDLModel implements HasID {
  ID: string;
  WeekNumber: number;
  HomeTeamPlayerID: string;
  HomeTeam: Array<LeagueRosterAthleteDLModel>;
  AwayTeamPlayerID: string;
  AwayTeam: Array<LeagueRosterAthleteDLModel>;

  constructor() {
    this.ID = '';
    this.WeekNumber = 0;
    this.HomeTeamPlayerID = '';
    this.HomeTeam = [];
    this.AwayTeamPlayerID = '';
    this.AwayTeam = [];
  }
}
