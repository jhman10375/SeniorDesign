import { HasID } from '../../services/firebase/interfaces/has-id.interface';
import { DraftSettingsModel } from './league-settings-draft-settings.model';
import { GeneralSettingsModel } from './league-settings-general-settings.model';
import { LeagueSettingsModel } from './league-settings-league-settings.model';
import { PositionModel } from './league-settings-position.model';

export class SoccerLeagueSettingsModel implements HasID {
  ID: string;
  DraftSettingsModel: DraftSettingsModel;
  GeneralSettingsModel: GeneralSettingsModel;
  LeagueSettingsModel: LeagueSettingsModel;
  PositionModel: PositionModel;

  constructor() {
    this.DraftSettingsModel = new DraftSettingsModel();
    this.GeneralSettingsModel = new GeneralSettingsModel();
    this.LeagueSettingsModel = new LeagueSettingsModel();
    this.PositionModel = new PositionModel();
  }
}
