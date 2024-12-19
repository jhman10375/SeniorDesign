import { Injectable } from '@angular/core';

import { DraftPickOrderTypeEnum } from '../../enums/draft-pick-order-type.enum';
import { SportEnum } from '../../enums/sport.enum';
import { BaseballLeagueSettingsModel } from '../../models/baseball-league-settings/baseball-league-settings.model';
import { BasketballLeagueSettingsModel } from '../../models/basketball-league-settings/basketball-league-settings.model';
import { FootballLeagueSettingsModel } from '../../models/football-league-settings/football-league-settings.model';
import { SoccerLeagueSettingsModel } from '../../models/soccer-league-settings/soccer-league-settings.model';
import { GeneralService } from '../bl/general-service.service';

@Injectable({ providedIn: 'root' })
export class LeagueSettingsDLService {
  constructor() {}

  //Need to acutally initialize settings, and manufacture the get operation
  getSettingsModel(
    id: string,
    leagueType: SportEnum
  ):
    | FootballLeagueSettingsModel
    | SoccerLeagueSettingsModel
    | BaseballLeagueSettingsModel
    | BasketballLeagueSettingsModel {
    const settingsModel =
      GeneralService.GetLeagueSettingsModelMap().get(leagueType);
    if (settingsModel) {
      settingsModel.DraftSettingsModel.DraftSelectionTime = 10;
      settingsModel.DraftSettingsModel.DraftPickOrderType =
        DraftPickOrderTypeEnum.RandomSnake;
      return settingsModel;
    } else {
      return new FootballLeagueSettingsModel();
    }
  }
}
