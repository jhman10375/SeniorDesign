import { SportEnum } from '../enums/sport.enum';
import { LeaguePlayerModel } from './league-player.model';

export class LeagueSearchModel {
  ID: string;
  Manager: LeaguePlayerModel;
  Name: string;
  DraftDate: Date;
  LeagueType: SportEnum;

  constructor() {
    this.ID = '';
    this.Manager = new LeaguePlayerModel();
    this.Name = '';
    this.DraftDate = new Date();
    this.LeagueType = SportEnum.None;
  }
}
