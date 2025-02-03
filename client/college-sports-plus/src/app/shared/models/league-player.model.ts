import { HasID } from '../services/firebase/interfaces/has-id.interface';
import { LeagueRosterAthleteModel } from './league-roster-athlete.model';
import { SchoolModel } from './school.model';

export class LeaguePlayerModel implements HasID {
  ID: string;
  LeagueID: string;
  PlayerID: string;
  ConferenceID: string;
  Name: string;
  DraftPickSortOrder: number;
  School: SchoolModel;
  TeamName: string;
  DraftTeamPlayerIDs: Array<string>;
  DraftRoster: Array<LeagueRosterAthleteModel>;
  Logos: Array<string>;

  constructor() {
    this.ID = '';
    this.LeagueID = '';
    this.PlayerID = '';
    this.ConferenceID = '';
    this.Name = '';
    this.DraftPickSortOrder = -1;
    this.School = new SchoolModel();
    this.TeamName = '';
    this.DraftTeamPlayerIDs = [];
    this.DraftRoster = [];
    this.Logos = [];
  }
}
