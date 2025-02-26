import { SportEnum } from '../enums/sport.enum';
import { HasID } from '../services/firebase/interfaces/has-id.interface';
import { LeaguePlayerModel } from './league-player.model';

export class LeagueSearchModel implements HasID {
  ID: string;
  Manager: LeaguePlayerModel;
  Name: string;
  DraftDate: Date;
  LeagueType: SportEnum;
  CurrentPlayers: number;
  MaxPlayers: number;

  constructor() {
    this.ID = '';
    this.Manager = new LeaguePlayerModel();
    this.Name = '';
    this.DraftDate = new Date();
    this.LeagueType = SportEnum.None;
    this.CurrentPlayers = 0;
    this.MaxPlayers = 0;
  }
}
