export class UserModel {
  ID: string;
  FirstName: string;
  LastName: string;
  LeagueIDs: Array<string>;

  constructor() {
    this.ID = '';
    this.FirstName = '';
    this.LastName = '';
    this.LeagueIDs = [];
  }
}
