import { SportEnum } from '../enums/sport.enum';
import { BaseballLeagueSettingsDLModel } from '../services/dl/models/settings/Baseball/baseball-league-settings-dl.model';
import { BasketballLeagueSettingsDLModel } from '../services/dl/models/settings/Basketball/basketball-league-settings-dl.model';
import { FootballLeagueSettingsDLModel } from '../services/dl/models/settings/Football/football-league-settings-dl.model';
import { SoccerLeagueSettingsDLModel } from '../services/dl/models/settings/Soccer/soccer-league-settings-dl.model';
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
  Settings:
    | FootballLeagueSettingsDLModel
    | BasketballLeagueSettingsDLModel
    | BaseballLeagueSettingsDLModel
    | SoccerLeagueSettingsDLModel;

  constructor() {
    this.ID = '';
    this.Manager = new LeaguePlayerModel();
    this.Name = '';
    this.DraftDate = new Date();
    this.LeagueType = SportEnum.None;
    this.CurrentPlayers = 0;
    this.MaxPlayers = 0;
    this.Settings = new FootballLeagueSettingsDLModel();
  }
}
