import { SeasonSettingsPlayoffSeasonDLModel } from './season-settings-playoff-season-dl.model';
import { SeasonSettingsRegularSeasonDLModel } from './season-settings-regular-season-dl.model';

export class SeasonDLModel {
  RSS: SeasonSettingsRegularSeasonDLModel;
  PSS: SeasonSettingsPlayoffSeasonDLModel;

  constructor() {
    this.RSS = new SeasonSettingsRegularSeasonDLModel();
    this.PSS = new SeasonSettingsPlayoffSeasonDLModel();
  }
}
