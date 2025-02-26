import { Injectable } from '@angular/core';

import { DraftPickOrderTypeEnum } from '../../enums/draft-pick-order-type.enum';
import { SportEnum } from '../../enums/sport.enum';
import { BaseballLeagueSettingsModel } from '../../models/baseball-league-settings/baseball-league-settings.model';
import { BasketballLeagueSettingsModel } from '../../models/basketball-league-settings/basketball-league-settings.model';
import { FootballLeagueSettingsModel } from '../../models/football-league-settings/football-league-settings.model';
import { LeaguePlayerModel } from '../../models/league-player.model';
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
    const leaguePlayerModel = new LeaguePlayerModel();
    leaguePlayerModel.Name = 'John Smith';
    if (settingsModel) {
      if (leagueType === SportEnum.Football) {
        (
          settingsModel as FootballLeagueSettingsModel
        ).GeneralSettingsModel.PrimaryColor = '#e00122';
        (
          settingsModel as FootballLeagueSettingsModel
        ).GeneralSettingsModel.SecondaryColor = '#000000';
      }
      settingsModel.GeneralSettingsModel.Name = `smith's league`;
      settingsModel.GeneralSettingsModel.LeagueManager = leaguePlayerModel;
      settingsModel.DraftSettingsModel.SelectionTime = 10;
      settingsModel.DraftSettingsModel.PickOrderType =
        DraftPickOrderTypeEnum.RandomSnake;
      return settingsModel;
    } else {
      return new FootballLeagueSettingsModel();
    }
  }
}
