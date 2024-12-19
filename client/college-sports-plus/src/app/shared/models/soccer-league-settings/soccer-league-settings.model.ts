import { DraftSettingsModel } from './league-settings-draft-settings.model';
import { GeneralSettingsModel } from './league-settings-general-settings.model';
import { LeagueSettingsModel } from './league-settings-league-settings.model';
import { PositionPointModel } from './league-settings-position-point.model';

export class SoccerLeagueSettingsModel {
  DraftSettingsModel: DraftSettingsModel;
  GeneralSettingsModel: GeneralSettingsModel;
  LeagueSettingsModel: LeagueSettingsModel;
  PositionPointModel: PositionPointModel;

  constructor() {
    this.DraftSettingsModel = new DraftSettingsModel();
    this.GeneralSettingsModel = new GeneralSettingsModel();
    this.LeagueSettingsModel = new LeagueSettingsModel();
    this.PositionPointModel = new PositionPointModel();
  }
}
