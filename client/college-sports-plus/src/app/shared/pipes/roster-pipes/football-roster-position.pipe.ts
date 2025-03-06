import { Pipe, PipeTransform } from '@angular/core';

import { SportEnum } from '../../enums/sport.enum';
import { LeagueRosterAthleteModel } from '../../models/league-roster-athlete.model';
import { FootballRosterPlayerPipe } from './football-roster-player.pipe';

@Pipe({
  name: 'footballRosterPositionPipe',
})
export class FootballRosterPositionPipe implements PipeTransform {
  transform(
    position: string,
    leagueType: SportEnum,
    team: Array<LeagueRosterAthleteModel>
  ): string {
    const footballRosterPositionPipe = new FootballRosterPlayerPipe();
    let retPosition: string = '';
    switch (leagueType) {
      case SportEnum.Baseball:
        break;
      case SportEnum.Football:
        switch (position) {
          case 'FTQB':
          case 'STQB':
            retPosition = 'QB';
            break;
          case 'FTRB1':
          case 'FTRB2':
          case 'STRB1':
          case 'STRB2':
            retPosition = 'RB';
            break;
          case 'FTWR1':
          case 'FTWR2':
          case 'STWR1':
          case 'STWR2':
            retPosition = 'WR';
            break;
          case 'FTTE':
          case 'STTE':
            retPosition = 'TE';
            break;
          case 'FTFLEX':
            retPosition = footballRosterPositionPipe
              .transform('FTFLEX', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'STFLEX':
            retPosition = footballRosterPositionPipe
              .transform('STFLEX', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'FTDST':
          case 'STDST':
            retPosition = 'DST';
            break;
          case 'FTK':
          case 'STK':
            retPosition = 'K';
            break;
          case 'B1':
            retPosition = footballRosterPositionPipe
              .transform('B1', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B2':
            retPosition = footballRosterPositionPipe
              .transform('B2', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B3':
            retPosition = footballRosterPositionPipe
              .transform('B3', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B4':
            retPosition = footballRosterPositionPipe
              .transform('B4', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B5':
            retPosition = footballRosterPositionPipe
              .transform('B5', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B6':
            retPosition = footballRosterPositionPipe
              .transform('B6', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'IR':
            retPosition = 'IR';
            break;
        }
        break;
      case SportEnum.Basketball:
        break;
      case SportEnum.Soccer:
        break;
    }
    return retPosition;
  }
}
