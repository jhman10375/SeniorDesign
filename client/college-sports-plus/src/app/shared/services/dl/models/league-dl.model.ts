import { SportEnum } from '../../../enums/sport.enum';
import { HasID } from '../../firebase/interfaces/has-id.interface';
import { BaseballLeagueSettingsDLModel } from './settings/Baseball/baseball-league-settings-dl.model';
import { BasketballLeagueSettingsDLModel } from './settings/Basketball/basketball-league-settings-dl.model';
import { FootballLeagueSettingsDLModel } from './settings/Football/football-league-settings-dl.model';
import { SoccerLeagueSettingsDLModel } from './settings/Soccer/soccer-league-settings-dl.model';

export class LeagueDLModel implements HasID {
  ID: string;
  ManagerID: string;
  Name: string;
  DraftDate: Date;
  DraftComplete: boolean;
  Settings:
    | FootballLeagueSettingsDLModel
    | SoccerLeagueSettingsDLModel
    | BaseballLeagueSettingsDLModel
    | BasketballLeagueSettingsDLModel;
  PlayerIDs: Array<string>;
  LeagueType: SportEnum;
  Season: Array<string>;

  constructor() {
    this.ID = '';
    this.Name = '';
    this.ManagerID = '';
    this.DraftDate = new Date();
    this.DraftComplete = false;
    this.PlayerIDs = [];
    this.LeagueType = SportEnum.None;
    this.Season = [];
  }
}
