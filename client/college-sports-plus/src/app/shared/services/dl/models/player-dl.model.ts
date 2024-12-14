export class PlayerDLModel {
  ID: String;
  Name: String;
  DraftPickSortOrder: number;
  School: String;
  TeamName: String;
  TeamPlayerIDs: Array<string>;

  constructor() {
    this.ID = '';
    this.Name = '';
    this.DraftPickSortOrder = -1;
    this.School = '';
    this.TeamName = '';
    this.TeamPlayerIDs = [];
  }
}
