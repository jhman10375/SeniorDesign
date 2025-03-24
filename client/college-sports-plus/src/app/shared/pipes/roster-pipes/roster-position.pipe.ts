import { Pipe, PipeTransform } from '@angular/core';

import { SportEnum } from '../../enums/sport.enum';
import { LeagueRosterAthleteModel } from '../../models/league-roster-athlete.model';
import { RosterPlayerPipe } from './roster-player.pipe';

@Pipe({
  name: 'rosterPositionPipe',
})
export class RosterPositionPipe implements PipeTransform {
  transform(
    position: string,
    leagueType: SportEnum,
    team: Array<LeagueRosterAthleteModel>
  ): string {
    const rosterPositionPipe = new RosterPlayerPipe();
    let retPosition: string = '';
    switch (leagueType) {
      case SportEnum.Baseball:
        switch (position) {
          case 'FTP':
          case 'STP':
            retPosition = 'P';
            break;
          case 'FTC':
          case 'STC':
            retPosition = 'C';
            break;
          case 'FTINF1':
          case 'FTINF2':
          case 'STINF1':
          case 'STINF2':
            retPosition = 'INF';
            break;
          case 'FTOF1':
          case 'FTOF2':
          case 'FTOF3':
          case 'STOF1':
          case 'STOF2':
          case 'STOF3':
            retPosition = 'OF';
            break;
          case 'FTUT':
          case 'STUT':
            retPosition = 'UT';
            break;
          case 'FT1B':
          case 'ST1B':
            retPosition = '1B';
            break;
          case 'FT3B':
          case 'ST3B':
            retPosition = '3B';
            break;
          case 'B1':
            retPosition = rosterPositionPipe
              .transform('B1', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B2':
            retPosition = rosterPositionPipe
              .transform('B2', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B3':
            retPosition = rosterPositionPipe
              .transform('B3', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B4':
            retPosition = rosterPositionPipe
              .transform('B4', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B5':
            retPosition = rosterPositionPipe
              .transform('B5', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B6':
            retPosition = rosterPositionPipe
              .transform('B6', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'IR':
            retPosition = 'IR';
            break;
        }
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
            retPosition = rosterPositionPipe
              .transform('FTFLEX', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'STFLEX':
            retPosition = rosterPositionPipe
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
            retPosition = rosterPositionPipe
              .transform('B1', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B2':
            retPosition = rosterPositionPipe
              .transform('B2', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B3':
            retPosition = rosterPositionPipe
              .transform('B3', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B4':
            retPosition = rosterPositionPipe
              .transform('B4', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B5':
            retPosition = rosterPositionPipe
              .transform('B5', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B6':
            retPosition = rosterPositionPipe
              .transform('B6', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'IR':
            retPosition = 'IR';
            break;
        }
        break;
      case SportEnum.Basketball:
        switch (position) {
          case 'FTC':
          case 'STC':
            retPosition = 'C';
            break;
          case 'FTF':
          case 'STF':
            retPosition = 'F';
            break;
          case 'FTG':
          case 'STG':
            retPosition = 'G';
            break;
          case 'B1':
            retPosition = rosterPositionPipe
              .transform('B1', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B2':
            retPosition = rosterPositionPipe
              .transform('B2', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B3':
            retPosition = rosterPositionPipe
              .transform('B3', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B4':
            retPosition = rosterPositionPipe
              .transform('B4', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B5':
            retPosition = rosterPositionPipe
              .transform('B5', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'B6':
            retPosition = rosterPositionPipe
              .transform('B6', leagueType, team ?? [])
              .Athlete.Position.toString();
            break;
          case 'IR':
            retPosition = 'IR';
            break;
        }
        break;
      case SportEnum.Soccer:
        break;
    }
    return retPosition;
  }
}
