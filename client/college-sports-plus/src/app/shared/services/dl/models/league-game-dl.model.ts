import { BaseballRosterDLModel } from './roster/baseball-roster-dl.model';
import { BasketballRosterDLModel } from './roster/basketball-roster-dl.model';
import { FootballRosterDLModel } from './roster/football-roster-dl.model';
import { SoccerRosterDLModel } from './roster/soccer-roster-dl.model';

export class LeagueGameDLModel {
  ID: string;
  WeekNumber: number;
  HomeTeamPlayerID: string;
  HomeTeam:
    | BaseballRosterDLModel
    | BasketballRosterDLModel
    | FootballRosterDLModel
    | SoccerRosterDLModel;
  AwayTeamPlayerID: string;
  AwayTeam:
    | BaseballRosterDLModel
    | BasketballRosterDLModel
    | FootballRosterDLModel
    | SoccerRosterDLModel;

  constructor() {
    this.ID = '';
    this.WeekNumber = 0;
    this.HomeTeamPlayerID = '';
    this.HomeTeam = new FootballRosterDLModel();
    this.AwayTeamPlayerID = '';
    this.AwayTeam = new FootballRosterDLModel();
  }
}
