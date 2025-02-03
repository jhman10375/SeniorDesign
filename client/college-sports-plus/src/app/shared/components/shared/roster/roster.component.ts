import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DividerModule } from 'primeng/divider';

import { FootballPositionEnum } from '../../../enums/position/football-position.enum';
import { RosterPositionEnum } from '../../../enums/roster-position.enum';
import { SportEnum } from '../../../enums/sport.enum';
import { LeagueRosterAthleteModel } from '../../../models/league-roster-athlete.model';

@Component({
  standalone: true,
  imports: [CommonModule, DividerModule],
  selector: 'roster',
  styleUrls: ['roster.component.scss'],
  templateUrl: 'roster.component.html',
})
export class RosterComponent implements OnInit {
  @Input() team: Array<LeagueRosterAthleteModel> | undefined = undefined;

  @Input() leagueType: SportEnum = SportEnum.None;

  @Input() reverse: boolean = false;

  @Output() navigateToEmitter = new EventEmitter<string>();

  readonly SportEnum = SportEnum;

  readonly RosterPositionEnum = RosterPositionEnum;

  positions: Array<string>;

  positionsMap: Map<SportEnum, Array<string>> = new Map<
    SportEnum,
    Array<string>
  >([
    [SportEnum.Baseball, new Array<string>()],
    [SportEnum.Basketball, new Array<string>()],
    [
      SportEnum.Football,
      [
        'FTQB',
        'FTRB1',
        'FTRB2',
        'FTWR1',
        'FTWR2',
        'FTTE',
        'FTFLEX',
        'FTDST',
        'FTK',
        'STQB',
        'STRB1',
        'STRB2',
        'STWR1',
        'STWR2',
        'STTE',
        'STFLEX',
        'STDST',
        'STK',
        'B1',
        'B2',
        'B3',
        'B4',
        'B5',
        'B6',
        'IR',
      ],
    ],
    [SportEnum.Soccer, new Array<string>()],
  ]);

  constructor() {}

  ngOnInit() {
    this.positions =
      this.positionsMap.get(this.leagueType ?? SportEnum.None) ?? [];
  }

  navigateTo(playerID: string): void {
    this.navigateToEmitter.emit(playerID);
  }

  getPosition(position: string): string {
    let retPosition: string = '';
    switch (this.leagueType) {
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
            retPosition =
              this.getRosterValue('FTFLEX').Athlete.Position.toString();
            break;
          case 'STFLEX':
            retPosition =
              this.getRosterValue('STFLEX').Athlete.Position.toString();
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
            retPosition = this.getRosterValue('B1').Athlete.Position.toString();
            break;
          case 'B2':
            retPosition = this.getRosterValue('B2').Athlete.Position.toString();
            break;
          case 'B3':
            retPosition = this.getRosterValue('B3').Athlete.Position.toString();
            break;
          case 'B4':
            retPosition = this.getRosterValue('B4').Athlete.Position.toString();
            break;
          case 'B5':
            retPosition = this.getRosterValue('B5').Athlete.Position.toString();
            break;
          case 'B6':
            retPosition = this.getRosterValue('B6').Athlete.Position.toString();
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

  getRosterValue(position: string): LeagueRosterAthleteModel {
    let athlete: LeagueRosterAthleteModel = new LeagueRosterAthleteModel();
    switch (this.leagueType) {
      case SportEnum.Baseball:
        break;
      case SportEnum.Basketball:
        break;
      case SportEnum.Football:
        switch (position) {
          case 'FTQB':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == FootballPositionEnum.QB
              ) ?? new LeagueRosterAthleteModel();
            break;
          case 'FTRB1':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == false &&
                  x.Athlete.Position == FootballPositionEnum.RB
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTRB2':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == true &&
                  x.Athlete.Position == FootballPositionEnum.RB
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTWR1':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == false &&
                  x.Athlete.Position == FootballPositionEnum.WR
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTWR2':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.RosterBackup == true &&
                  x.Athlete.Position == FootballPositionEnum.WR
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTTE':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == FootballPositionEnum.TE
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTFLEX':
            athlete =
              this.team?.find(
                (x) => x.RosterPosition == RosterPositionEnum.FirstStringFlex
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTDST':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == FootballPositionEnum.DST
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'FTK':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.FirstString &&
                  x.Athlete.Position == FootballPositionEnum.P
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STQB':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == FootballPositionEnum.QB
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STRB1':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.Athlete.Position == FootballPositionEnum.RB
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STRB2':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == true &&
                  x.Athlete.Position == FootballPositionEnum.RB
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STWR1':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == false &&
                  x.Athlete.Position == FootballPositionEnum.WR
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STWR2':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.RosterBackup == true &&
                  x.Athlete.Position == FootballPositionEnum.WR
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STTE':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == FootballPositionEnum.TE
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STFLEX':
            athlete =
              this.team?.find(
                (x) => x.RosterPosition == RosterPositionEnum.SecondStringFlex
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STDST':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == FootballPositionEnum.DST
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'STK':
            athlete =
              this.team?.find(
                (x) =>
                  x.RosterPosition == RosterPositionEnum.SecondString &&
                  x.Athlete.Position == FootballPositionEnum.P
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'B1':
            athlete =
              this.team?.find(
                (x) => x.RosterPosition == RosterPositionEnum.B1
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'B2':
            athlete =
              this.team?.find(
                (x) => x.RosterPosition == RosterPositionEnum.B2
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'B3':
            athlete =
              this.team?.find(
                (x) => x.RosterPosition == RosterPositionEnum.B3
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'B4':
            athlete =
              this.team?.find(
                (x) => x.RosterPosition == RosterPositionEnum.B4
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'B5':
            athlete =
              this.team?.find(
                (x) => x.RosterPosition == RosterPositionEnum.B5
              ) ?? new LeagueRosterAthleteModel();
            break;

          case 'B6':
            athlete =
              this.team?.find(
                (x) => x.RosterPosition == RosterPositionEnum.B6
              ) ?? new LeagueRosterAthleteModel();
            break;
          case 'IR':
            athlete =
              this.team?.find(
                (x) => x.RosterPosition == RosterPositionEnum.IR
              ) ?? new LeagueRosterAthleteModel();
            break;
        }
        break;
      case SportEnum.Soccer:
        break;
    }

    return athlete;
  }
}
