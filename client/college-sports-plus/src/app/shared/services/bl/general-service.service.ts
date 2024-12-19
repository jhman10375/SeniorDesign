import { Injectable } from '@angular/core';

import { SportEnum } from '../../enums/sport.enum';
import { BaseballLeagueSettingsModel } from '../../models/baseball-league-settings/baseball-league-settings.model';
import { BasketballLeagueSettingsModel } from '../../models/basketball-league-settings/basketball-league-settings.model';
import { FootballLeagueSettingsModel } from '../../models/football-league-settings/football-league-settings.model';
import { SoccerLeagueSettingsModel } from '../../models/soccer-league-settings/soccer-league-settings.model';

@Injectable({ providedIn: 'root' })
export class GeneralService {
  static isMobile(): boolean {
    console.log(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  static GetLeagueSettingsModelMap(): Map<
    SportEnum,
    | FootballLeagueSettingsModel
    | SoccerLeagueSettingsModel
    | BaseballLeagueSettingsModel
    | BasketballLeagueSettingsModel
  > {
    const leagueSettingsModel: Map<
      SportEnum,
      | FootballLeagueSettingsModel
      | SoccerLeagueSettingsModel
      | BaseballLeagueSettingsModel
      | BasketballLeagueSettingsModel
    > = new Map<
      SportEnum,
      | FootballLeagueSettingsModel
      | SoccerLeagueSettingsModel
      | BaseballLeagueSettingsModel
      | BasketballLeagueSettingsModel
    >([
      [SportEnum.Baseball, new BaseballLeagueSettingsModel()],
      [SportEnum.Basketball, new BasketballLeagueSettingsModel()],
      [SportEnum.Football, new FootballLeagueSettingsModel()],
      [SportEnum.Soccer, new SoccerLeagueSettingsModel()],
    ]);

    return leagueSettingsModel;
  }
}
