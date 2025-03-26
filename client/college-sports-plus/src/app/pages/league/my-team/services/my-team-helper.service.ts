import { Injectable } from '@angular/core';

import { RosterPositionEnum } from '../../../../shared/enums/roster-position.enum';
import { SportEnum } from '../../../../shared/enums/sport.enum';
import { LeagueRosterAthleteModel } from '../../../../shared/models/league-roster-athlete.model';

@Injectable()
export class MyTeamHelperService {
  constructor() {}

  getFootballPositions(pos: string): Array<string> {
    const retVal: Array<string> = [];
    switch (true) {
      case pos.includes('QB'):
        retVal.push('FTQB');
        retVal.push('STQB');
        break;
      case pos.includes('RB'):
        retVal.push('FTRB1');
        retVal.push('FTRB2');
        retVal.push('STRB1');
        retVal.push('STRB2');
        break;
      case pos.includes('WR'):
        retVal.push('FTWR1');
        retVal.push('FTWR2');
        retVal.push('STWR1');
        retVal.push('STWR2');
        break;
      case pos.includes('TE'):
        retVal.push('FTTE');
        retVal.push('STTE');
        break;
      case pos.includes('FLEX'):
        retVal.push('FTFLEX');
        retVal.push('STFLEX');
        break;
      case pos.includes('DST'):
        retVal.push('FTDST');
        retVal.push('STDST');
        break;
      case pos.includes('K'):
        retVal.push('FTK');
        retVal.push('STK');
        break;
    }

    return retVal;
  }

  getBasketballPositions(pos: string): Array<string> {
    const retVal: Array<string> = [];
    switch (true) {
      case pos.includes('C'):
        retVal.push('FTC');
        retVal.push('STC');
        break;
      case pos.includes('F'):
        retVal.push('FTF');
        retVal.push('STF');
        break;
      case pos.includes('G'):
        retVal.push('FTG');
        retVal.push('STG');
        break;
    }

    return retVal;
  }

  getBaseballPositions(pos: string): Array<string> {
    const retVal: Array<string> = [];
    switch (true) {
      case pos.includes('UT'):
        retVal.push('FTUT');
        retVal.push('STUT');
        break;
      case pos.includes('INF'):
        retVal.push('FTINF1');
        retVal.push('FTINF2');
        retVal.push('STINF1');
        retVal.push('STINF2');
        break;
      case pos.includes('OF'):
        retVal.push('FTOF1');
        retVal.push('FTOF2');
        retVal.push('FTOF3');
        retVal.push('STOF1');
        retVal.push('STOF2');
        retVal.push('STOF3');
        break;
      case pos.includes('C'):
        retVal.push('FTC');
        retVal.push('STC');
        break;
      case pos.includes('P'):
        retVal.push('FTP');
        retVal.push('STP');
        break;
      case pos.includes('1B'):
        retVal.push('FT1B');
        retVal.push('ST1B');
        break;
      case pos.includes('3B'):
        retVal.push('FT3B');
        retVal.push('ST3B');
        break;
    }

    return retVal;
  }

  getSoccerPositions(pos: string): Array<string> {
    const retVal: Array<string> = [];
    switch (true) {
      case pos.includes('F'):
        retVal.push('FTF1');
        retVal.push('FTF2');
        retVal.push('FTF3');
        retVal.push('STF1');
        retVal.push('STF2');
        retVal.push('STF3');
        break;
      case pos.includes('MD'):
        retVal.push('FTMD1');
        retVal.push('FTMD2');
        retVal.push('STMD1');
        retVal.push('STMD2');
        break;
      case pos.includes('D'):
        retVal.push('FTD1');
        retVal.push('FTD2');
        retVal.push('FTD3');
        retVal.push('STD2');
        retVal.push('STD2');
        retVal.push('STD3');
        break;
      case pos.includes('FM'):
        retVal.push('FTFM');
        retVal.push('STFM');
        break;
      case pos.includes('M'):
        retVal.push('FTM');
        retVal.push('STM');
        break;
      case pos.includes('GK'):
        retVal.push('FTGK');
        retVal.push('STGK');
        break;
    }

    return retVal;
  }

  updateTeam(
    leagueType: SportEnum,
    positionsToUpdate: Array<string>,
    playersToUpdate: Array<LeagueRosterAthleteModel>,
    team: Array<LeagueRosterAthleteModel>
  ): Array<LeagueRosterAthleteModel> {
    switch (leagueType) {
      case SportEnum.Football:
        return this.updateFootballTeam(
          positionsToUpdate,
          playersToUpdate,
          team
        );
      case SportEnum.Baseball:
        return this.updateBaseballTeam(
          positionsToUpdate,
          playersToUpdate,
          team
        );
      case SportEnum.Basketball:
        return this.updateBasketballTeam(
          positionsToUpdate,
          playersToUpdate,
          team
        );
      case SportEnum.Soccer:
        return this.updateSoccerTeam(positionsToUpdate, playersToUpdate, team);
      default:
        return [];
    }
  }

  transferPlayer(
    athlete: LeagueRosterAthleteModel,
    team: Array<LeagueRosterAthleteModel>
  ): Array<LeagueRosterAthleteModel> {
    return team.filter(
      (x) =>
        x.Athlete.AthleteID != athlete.Athlete.AthleteID &&
        athlete.Athlete.AthleteID.length > 0
    );
  }

  private updateFootballTeam(
    positionsToUpdate: Array<string>,
    playersToUpdate: Array<LeagueRosterAthleteModel>,
    team: Array<LeagueRosterAthleteModel>
  ): Array<LeagueRosterAthleteModel> {
    console.log('football', positionsToUpdate, playersToUpdate, team);
    positionsToUpdate.forEach((pos, index) => {
      const player: LeagueRosterAthleteModel = playersToUpdate[index];
      if (player) {
        if (pos.length > 2 && pos.includes('2')) {
          player.RosterBackup = true;
        } else {
          player.RosterBackup = false;
        }
        if (pos.includes('FT')) {
          if (pos.includes('FLEX')) {
            player.RosterPosition = RosterPositionEnum.FirstStringFlex;
          } else {
            player.RosterPosition = RosterPositionEnum.FirstString;
          }
        } else if (pos.includes('ST')) {
          if (pos.includes('FLEX')) {
            player.RosterPosition = RosterPositionEnum.SecondStringFlex;
          } else {
            player.RosterPosition = RosterPositionEnum.SecondString;
          }
        } else {
          player.RosterPosition =
            RosterPositionEnum[pos as keyof typeof RosterPositionEnum];
        }
      }
    });

    playersToUpdate.forEach((player) => {
      team = team.filter(
        (x) => x.Athlete.AthleteID != player.Athlete.AthleteID
      );
      team.push(player);
    });

    return team;
  }

  private updateBaseballTeam(
    positionsToUpdate: Array<string>,
    playersToUpdate: Array<LeagueRosterAthleteModel>,
    team: Array<LeagueRosterAthleteModel>
  ): Array<LeagueRosterAthleteModel> {
    console.log('baseball', positionsToUpdate, playersToUpdate, team);
    return team;
  }

  private updateBasketballTeam(
    positionsToUpdate: Array<string>,
    playersToUpdate: Array<LeagueRosterAthleteModel>,
    team: Array<LeagueRosterAthleteModel>
  ): Array<LeagueRosterAthleteModel> {
    console.log('basketball', positionsToUpdate, playersToUpdate, team);
    return team;
  }

  private updateSoccerTeam(
    positionsToUpdate: Array<string>,
    playersToUpdate: Array<LeagueRosterAthleteModel>,
    team: Array<LeagueRosterAthleteModel>
  ): Array<LeagueRosterAthleteModel> {
    console.log('soccer', positionsToUpdate, playersToUpdate, team);
    return team;
  }
}
