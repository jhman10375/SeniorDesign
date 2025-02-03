import { Pipe, PipeTransform } from '@angular/core';

import { SportEnum } from '../enums/sport.enum';
import { FootballLeagueSettingsModel } from '../models/football-league-settings/football-league-settings.model';

@Pipe({
  name: 'leagueTypePipe',
})
export class LeagueTypePipe implements PipeTransform {
  transform(value: any, leagueType: SportEnum): any {
    switch (leagueType) {
      case SportEnum.Football:
        return value as FootballLeagueSettingsModel;
      case SportEnum.Baseball:
      case SportEnum.Basketball:
      case SportEnum.Soccer:
    }
  }
}
