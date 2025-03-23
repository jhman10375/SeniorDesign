import { Pipe, PipeTransform } from '@angular/core';

import { BasketballPositionEnum } from '../../enums/position/basketball-position.enum';
import { FootballPositionEnum } from '../../enums/position/football-position.enum';
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

          case 'FTF':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == BasketballPositionEnum.Forward
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTG':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
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

          case 'STF':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == BasketballPositionEnum.Forward
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STG':
            athlete =
              team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
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
        break;
    }

    return athlete;
  }
}
