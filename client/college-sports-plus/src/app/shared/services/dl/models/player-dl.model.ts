import { HasID } from '../../firebase/interfaces/has-id.interface';

export class PlayerDLModel implements HasID {
  ID: string;
  UserID: string;
  Name: string;
  DraftPickSortOrder: number;
  School: string;
  TeamName: string;
  TeamPlayerIDs: Array<string>;

  constructor() {
    this.ID = '';
    this.UserID = '';
    this.Name = '';
    this.DraftPickSortOrder = -1;
    this.School = '';
    this.TeamName = '';
    this.TeamPlayerIDs = [];
  }
}
