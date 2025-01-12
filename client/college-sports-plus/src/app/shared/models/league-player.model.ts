import { BaseballRosterModel } from './roster/baseball-roster.model';
import { BasketballRosterModel } from './roster/basketball-roster.model';
import { FootballRosterModel } from './roster/football-roster.model';
import { SoccerRosterModel } from './roster/soccer-roster.model';
import { SchoolModel } from './school.model';

export class LeaguePlayerModel {
  ID: string;
  Name: string;
  DraftPickSortOrder: number;
  School: SchoolModel;
  TeamName: string;
  DraftTeamPlayerIDs: Array<string>;
  DraftRoster:
    | BaseballRosterModel
    | BasketballRosterModel
    | FootballRosterModel
    | SoccerRosterModel;

  constructor() {
    this.ID = '';
    this.Name = '';
    this.DraftPickSortOrder = -1;
    this.School = new SchoolModel();
    this.TeamName = '';
    this.DraftTeamPlayerIDs = [];
    this.DraftRoster = new FootballRosterModel();
  }
}
