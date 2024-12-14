import { SchoolModel } from './school.model';

export class LeaguePlayerModel {
  ID: string;
  Name: string;
  DraftPickSortOrder: number;
  School: SchoolModel;
  TeamName: string;
  TeamPlayerIDs: Array<string>;

  constructor() {
    this.ID = '';
    this.Name = '';
    this.DraftPickSortOrder = -1;
    this.School = new SchoolModel();
    this.TeamName = '';
    this.TeamPlayerIDs = [];
  }
}
