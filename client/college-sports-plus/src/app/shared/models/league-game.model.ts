import { BaseballRosterModel } from './roster/baseball-roster.model';
import { BasketballRosterModel } from './roster/basketball-roster.model';
import { FootballRosterModel } from './roster/football-roster.model';
import { SoccerRosterModel } from './roster/soccer-roster.model';

export class LeagueGameModel {
  ID: string;
  WeekNumber: number;
  HomeTeamPlayerID: string;
  HomeTeam:
    | BaseballRosterModel
    | BasketballRosterModel
    | FootballRosterModel
    | SoccerRosterModel;
  AwayTeamPlayerID: string;
  AwayTeam:
    | BaseballRosterModel
    | BasketballRosterModel
    | FootballRosterModel
    | SoccerRosterModel;
}
