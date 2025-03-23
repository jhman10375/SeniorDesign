import { SeasonSettingsPlayoffSeasonModel } from './season-settings-playoff-season.model';
import { SeasonSettingsRegularSeasonModel } from './season-settings-regular-season.model';

export class SeasonModel {
  RegularSeasonSettings: SeasonSettingsRegularSeasonModel;
  PlayoffSeasonSettings: SeasonSettingsPlayoffSeasonModel;

  constructor() {
    this.RegularSeasonSettings = new SeasonSettingsRegularSeasonModel();
    this.PlayoffSeasonSettings = new SeasonSettingsPlayoffSeasonModel();
  }
}
