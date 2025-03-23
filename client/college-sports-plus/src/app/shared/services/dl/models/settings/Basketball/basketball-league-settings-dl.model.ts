import { HasID } from '../../../../firebase/interfaces/has-id.interface';
import { DraftSettingsDLModel } from './league-settings-draft-settings-dl.model';
import { GeneralSettingsDLModel } from './league-settings-general-settings-dl.model';
import { LeagueSettingsDLModel } from './league-settings-league-settings-dl.model';
import { PositionDLModel } from './league-settings-position-dl.model';
import { SeasonDLModel } from './league-settings-season-dl.model';

export class BasketballLeagueSettingsDLModel implements HasID {
  ID: string;
  LID: string;
  DSM: DraftSettingsDLModel;
  GSM: GeneralSettingsDLModel;
  LSM: LeagueSettingsDLModel;
  PM: PositionDLModel;
  SM: SeasonDLModel;

  constructor() {
    this.DSM = new DraftSettingsDLModel();
    this.GSM = new GeneralSettingsDLModel();
    this.LSM = new LeagueSettingsDLModel();
    this.PM = new PositionDLModel();
    this.SM = new SeasonDLModel();
  }
}
