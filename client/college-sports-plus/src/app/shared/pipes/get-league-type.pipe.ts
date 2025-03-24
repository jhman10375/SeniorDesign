import { Pipe, PipeTransform } from '@angular/core';

import { SportEnum } from '../enums/sport.enum';
import { BaseballLeagueSettingsModel } from '../models/baseball-league-settings/baseball-league-settings.model';
import { BasketballLeagueSettingsModel } from '../models/basketball-league-settings/basketball-league-settings.model';
import { FootballLeagueSettingsModel } from '../models/football-league-settings/football-league-settings.model';

@Pipe({
  name: 'leagueTypePipe',
})
export class LeagueTypePipe implements PipeTransform {
  transform(value: any, leagueType: SportEnum | undefined): any {
    switch (leagueType) {
      case SportEnum.Football:
        return value as FootballLeagueSettingsModel;
      case SportEnum.Baseball:
        return value as BaseballLeagueSettingsModel;
      case SportEnum.Basketball:
        return value as BasketballLeagueSettingsModel;
      case SportEnum.Soccer:
    }
  }
}
