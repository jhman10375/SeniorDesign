import { Pipe, PipeTransform } from '@angular/core';

import { BaseballPositionEnum } from '../../enums/position/baseball-position.enum';
import { BasketballPositionEnum } from '../../enums/position/basketball-position.enum';
import { FootballPositionEnum } from '../../enums/position/football-position.enum';
import { SoccerPositionEnum } from '../../enums/position/soccer-position.enum';
import { RosterPositionEnum } from '../../enums/roster-position.enum';
import { SportEnum } from '../../enums/sport.enum';
import { LeagueRosterAthleteModel } from '../../models/league-roster-athlete.model';

@Pipe({
  name: 'rosterPlayerPipe',
})
export class RosterPlayerPipe implements PipeTransform {
  transform(
    position: string,
    leagueType: SportEnum,
    team: Array<LeagueRosterAthleteModel>
  ): LeagueRosterAthleteModel {
    let athlete: LeagueRosterAthleteModel = new LeagueRosterAthleteModel();
    switch (leagueType) {
      case SportEnum.Baseball:
        switch (position) {
          case 'FTUT':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == BaseballPositionEnum.UT
              ) ?? new LeagueRosterAthleteModel();
            break;
          case 'FTINF1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == false &&
                  x.RosterThird == false &&
                  x.Athlete.Position == BaseballPositionEnum.INF
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTINF2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == true &&
                  x.RosterThird == false &&
                  x.Athlete.Position == BaseballPositionEnum.INF
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTOF1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == false &&
                  x.RosterThird == false &&
                  x.Athlete.Position == BaseballPositionEnum.OF
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTOF2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == true &&
                  x.RosterThird == false &&
                  x.Athlete.Position == BaseballPositionEnum.OF
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTOF3':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == false &&
                  x.RosterThird == true &&
                  x.Athlete.Position == BaseballPositionEnum.OF
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTC':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == BaseballPositionEnum.C
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTP':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == BaseballPositionEnum.P
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FT1B':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == BaseballPositionEnum.B1
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FT3B':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == BaseballPositionEnum.B3
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STUT':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == BaseballPositionEnum.UT
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STINF1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.RosterThird == false &&
                  x.Athlete.Position == BaseballPositionEnum.INF
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STINF2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == true &&
                  x.RosterThird == false &&
                  x.Athlete.Position == BaseballPositionEnum.INF
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STOF1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.RosterThird == false &&
                  x.Athlete.Position == BaseballPositionEnum.OF
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STOF2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == true &&
                  x.RosterThird == false &&
                  x.Athlete.Position == BaseballPositionEnum.OF
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STOF3':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.RosterThird == true &&
                  x.Athlete.Position == BaseballPositionEnum.OF
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STC':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == BaseballPositionEnum.C
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STP':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == BaseballPositionEnum.P
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'ST1B':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == BaseballPositionEnum.B1
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'ST3B':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == BaseballPositionEnum.B1
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'B1':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B1) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B2':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B2) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B3':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B3) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B4':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B4) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B5':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B5) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B6':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B6) ??
              new LeagueRosterAthleteModel();
            break;
          case 'IR':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.IR) ??
              new LeagueRosterAthleteModel();
            break;
        }
        break;
      case SportEnum.Basketball:
        switch (position) {
          case 'FTC':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == BasketballPositionEnum.Center
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTF1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.Athlete.Position == BasketballPositionEnum.Forward
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTF2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == true &&
                  x.Athlete.Position == BasketballPositionEnum.Forward
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTG1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.Athlete.Position == BasketballPositionEnum.Guard
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTG2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == true &&
                  x.Athlete.Position == BasketballPositionEnum.Guard
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STC':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == BasketballPositionEnum.Center
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STF1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.Athlete.Position == BasketballPositionEnum.Forward
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STF2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == true &&
                  x.Athlete.Position == BasketballPositionEnum.Forward
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STG1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.Athlete.Position == BasketballPositionEnum.Guard
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STG2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == true &&
                  x.Athlete.Position == BasketballPositionEnum.Guard
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'B1':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B1) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B2':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B2) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B3':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B3) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B4':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B4) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B5':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B5) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B6':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B6) ??
              new LeagueRosterAthleteModel();
            break;
          case 'IR':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.IR) ??
              new LeagueRosterAthleteModel();
            break;
        }
        break;
      case SportEnum.Football:
        switch (position) {
          case 'FTQB':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == FootballPositionEnum.QB
              ) ?? new LeagueRosterAthleteModel();
            break;
          case 'FTRB1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == false &&
                  x.Athlete.Position == FootballPositionEnum.RB
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTRB2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == true &&
                  x.Athlete.Position == FootballPositionEnum.RB
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTWR1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == false &&
                  x.Athlete.Position == FootballPositionEnum.WR
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTWR2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == true &&
                  x.Athlete.Position == FootballPositionEnum.WR
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTTE':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == FootballPositionEnum.TE
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTFLEX':
            athlete =
              team?.find(
                (x) => x.RosterPosition == RosterPositionEnum.FirstStringFlex
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTDST':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == FootballPositionEnum.DST
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTK':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == FootballPositionEnum.P
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STQB':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == FootballPositionEnum.QB
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STRB1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.Athlete.Position == FootballPositionEnum.RB
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STRB2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == true &&
                  x.Athlete.Position == FootballPositionEnum.RB
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STWR1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.Athlete.Position == FootballPositionEnum.WR
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STWR2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == true &&
                  x.Athlete.Position == FootballPositionEnum.WR
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STTE':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == FootballPositionEnum.TE
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STFLEX':
            athlete =
              team?.find(
                (x) => x.RosterPosition == RosterPositionEnum.SecondStringFlex
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STDST':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == FootballPositionEnum.DST
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STK':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == FootballPositionEnum.P
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'B1':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B1) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B2':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B2) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B3':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B3) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B4':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B4) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B5':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B5) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B6':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B6) ??
              new LeagueRosterAthleteModel();
            break;
          case 'IR':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.IR) ??
              new LeagueRosterAthleteModel();
            break;
        }
        break;
      case SportEnum.Soccer:
        switch (position) {
          case 'FTD1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == false &&
                  x.RosterThird == false &&
                  x.Athlete.Position == SoccerPositionEnum.D
              ) ?? new LeagueRosterAthleteModel();
            break;
          case 'FTD2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == true &&
                  x.RosterThird == false &&
                  x.Athlete.Position == SoccerPositionEnum.D
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTD3':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == false &&
                  x.RosterThird == true &&
                  x.Athlete.Position == SoccerPositionEnum.D
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTMD1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == false &&
                  x.RosterThird == false &&
                  x.Athlete.Position == SoccerPositionEnum.MD
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTMD2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == true &&
                  x.RosterThird == false &&
                  x.Athlete.Position == SoccerPositionEnum.MD
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTF1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == false &&
                  x.RosterThird == false &&
                  x.Athlete.Position == SoccerPositionEnum.F
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTF2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == true &&
                  x.RosterThird == false &&
                  x.Athlete.Position == SoccerPositionEnum.F
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTF3':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == false &&
                  x.RosterThird == true &&
                  x.Athlete.Position == SoccerPositionEnum.F
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTGK':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == SoccerPositionEnum.GK
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTFM':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == SoccerPositionEnum.FM
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTM':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == SoccerPositionEnum.M
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STD1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.RosterThird == false &&
                  x.Athlete.Position == SoccerPositionEnum.D
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STD2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == true &&
                  x.RosterThird == false &&
                  x.Athlete.Position == SoccerPositionEnum.D
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STD3':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.RosterThird == true &&
                  x.Athlete.Position == SoccerPositionEnum.D
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STMD1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.RosterThird == false &&
                  x.Athlete.Position == SoccerPositionEnum.MD
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STMD2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == true &&
                  x.RosterThird == false &&
                  x.Athlete.Position == SoccerPositionEnum.MD
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STF1':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.RosterThird == false &&
                  x.Athlete.Position == SoccerPositionEnum.F
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STF2':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == true &&
                  x.RosterThird == false &&
                  x.Athlete.Position == SoccerPositionEnum.F
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STF3':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.RosterThird == true &&
                  x.Athlete.Position == SoccerPositionEnum.F
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STGK':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == SoccerPositionEnum.GK
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STFM':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == SoccerPositionEnum.FM
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STM':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == SoccerPositionEnum.M
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'B1':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B1) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B2':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B2) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B3':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B3) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B4':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B4) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B5':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B5) ??
              new LeagueRosterAthleteModel();
            break;

          case 'B6':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.B6) ??
              new LeagueRosterAthleteModel();
            break;
          case 'IR':
            athlete =
              team?.find((x) => x.RosterPosition == RosterPositionEnum.IR) ??
              new LeagueRosterAthleteModel();
            break;
        }
        break;
    }

    return athlete;
  }
}
