import { SportEnum } from '../../../enums/sport.enum';
import { HasID } from '../../firebase/interfaces/has-id.interface';

export class LeagueDLModel implements HasID {
  ID: string;
  ManagerID: string;
  Name: string;
  DraftDate: Date;
  SettingsID: string;
  PlayerIDs: Array<string>;
  LeagueType: SportEnum;
  Season: Array<string>;

  constructor() {
    this.ID = '';
    this.Name = '';
    this.ManagerID = '';
    this.DraftDate = new Date();
    this.SettingsID = '';
    this.PlayerIDs = [];
    this.LeagueType = SportEnum.None;
    this.Season = [];
  }
}
