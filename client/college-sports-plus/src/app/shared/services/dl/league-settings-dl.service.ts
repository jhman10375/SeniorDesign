import { Injectable } from '@angular/core';

import { DraftPickOrderTypeEnum } from '../../enums/draft-pick-order-type.enum';
import { LeagueSettingsModel } from '../../models/league-settings.model';

@Injectable({ providedIn: 'root' })
export class LeagueSettingsDLService {
  constructor() {}

  //Need to acutally initialize settings, and manufacture the get operation
  getSettingsModel(id: string): LeagueSettingsModel {
    const leagueSettingsModel = new LeagueSettingsModel();
    leagueSettingsModel.DraftSelectionTime = 10;
    leagueSettingsModel.DraftPickOrderType = DraftPickOrderTypeEnum.RandomSnake;
    return leagueSettingsModel;
  }
}
