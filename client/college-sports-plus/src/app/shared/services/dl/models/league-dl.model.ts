import { SportEnum } from '../../../enums/sport.enum';

export class LeagueDLModel {
  ID: string;
  ManagerID: string;
  Name: string;
  DraftDate: Date;
  SettingsID: string;
  PlayerIDs: Array<string>;
  LeagueType: SportEnum;

  constructor() {
    this.ID = '';
    this.Name = '';
    this.ManagerID = '';
    this.DraftDate = new Date();
    this.SettingsID = '';
    this.PlayerIDs = [];
    this.LeagueType = SportEnum.None;
  }
}
