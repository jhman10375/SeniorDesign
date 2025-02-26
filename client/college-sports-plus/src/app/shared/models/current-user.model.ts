import { HasID } from '../services/firebase/interfaces/has-id.interface';

export class CurrentUserModel implements HasID {
  ID: string;
  Name: string;
  LeagueIDs: Array<string>;

  constructor() {
    this.ID = '';
    this.Name = '';
    this.LeagueIDs = [];
  }
}
