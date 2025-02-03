import { HasID } from '../../firebase/interfaces/has-id.interface';

export class UserModel implements HasID {
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
