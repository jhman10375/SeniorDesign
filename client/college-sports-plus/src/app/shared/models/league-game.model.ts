import { HasID } from '../services/firebase/interfaces/has-id.interface';
import { LeagueRosterAthleteModel } from './league-roster-athlete.model';

export class LeagueGameModel implements HasID {
  ID: string;
  WeekNumber: number;
  HomeTeamPlayerID: string;
  HomeTeam: Array<LeagueRosterAthleteModel>;
  // HomeTeam:
  //   | BaseballRosterModel
  //   | BasketballRosterModel
  //   | FootballRosterModel
  //   | SoccerRosterModel;
  AwayTeamPlayerID: string;
  AwayTeam: Array<LeagueRosterAthleteModel>;
  // AwayTeam:
  //   | BaseballRosterModel
  //   | BasketballRosterModel
  //   | FootballRosterModel
  //   | SoccerRosterModel;
}
