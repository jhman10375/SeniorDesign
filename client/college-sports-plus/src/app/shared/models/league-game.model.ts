import { HasID } from '../services/firebase/interfaces/has-id.interface';
import { LeagueRosterAthleteModel } from './league-roster-athlete.model';

export class LeagueGameModel implements HasID {
  ID: string;
  WeekNumber: number;
  HomeTeamPlayerID: string;
  HomeTeam: Array<LeagueRosterAthleteModel>;
  AwayTeamPlayerID: string;
  AwayTeam: Array<LeagueRosterAthleteModel>;
}
