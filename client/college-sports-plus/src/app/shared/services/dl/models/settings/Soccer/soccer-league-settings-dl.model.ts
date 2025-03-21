import { HasID } from '../../../../firebase/interfaces/has-id.interface';
import { DraftSettingsDLModel } from './league-settings-draft-settings-dl.model';
import { GeneralSettingsDLModel } from './league-settings-general-settings-dl.model';
import { LeagueSettingsDLModel } from './league-settings-league-settings-dl.model';
import { PositionPointDLModel } from './league-settings-position-point-dl.model';

export class SoccerLeagueSettingsDLModel implements HasID {
  ID: string;
  DSM: DraftSettingsDLModel;
  GSM: GeneralSettingsDLModel;
  LSM: LeagueSettingsDLModel;
  PPM: PositionPointDLModel;

  constructor() {
    this.DSM = new DraftSettingsDLModel();
    this.GSM = new GeneralSettingsDLModel();
    this.LSM = new LeagueSettingsDLModel();
    this.PPM = new PositionPointDLModel();
  }
}
