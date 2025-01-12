import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DividerModule } from 'primeng/divider';

import { SportEnum } from '../../../enums/sport.enum';
import { LeagueAthleteModel } from '../../../models/league-athlete.model';
import { LeaguePlayerModel } from '../../../models/league-player.model';
import { BaseballRosterModel } from '../../../models/roster/baseball-roster.model';
import { BasketballRosterModel } from '../../../models/roster/basketball-roster.model';
import { FootballRosterModel } from '../../../models/roster/football-roster.model';
import { SoccerRosterModel } from '../../../models/roster/soccer-roster.model';

@Component({
  standalone: true,
  imports: [DividerModule],
  selector: 'roster',
  styleUrls: ['roster.component.scss'],
  templateUrl: 'roster.component.html',
})
export class RosterComponent implements OnInit {
  @Input() team:
    | {
        player: LeaguePlayerModel | undefined;
        roster:
          | BaseballRosterModel
          | BasketballRosterModel
          | FootballRosterModel
          | SoccerRosterModel;
      }
    | undefined = undefined;

  @Input() leagueType: SportEnum = SportEnum.None;

  @Input() reverse: boolean = false;

  @Output() navigateToEmitter = new EventEmitter<string>();

  readonly SportEnum = SportEnum;

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
            retPosition = this.getRosterValue('FTFLEX').Position.toString();
            break;
          case 'STFLEX':
            retPosition = this.getRosterValue('STFLEX').Position.toString();
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
            retPosition = this.getRosterValue('B1').Position.toString();
            break;
          case 'B2':
            retPosition = this.getRosterValue('B2').Position.toString();
            break;
          case 'B3':
            retPosition = this.getRosterValue('B3').Position.toString();
            break;
          case 'B4':
            retPosition = this.getRosterValue('B4').Position.toString();
            break;
          case 'B5':
            retPosition = this.getRosterValue('B5').Position.toString();
            break;
          case 'B6':
            retPosition = this.getRosterValue('B6').Position.toString();
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

  getRosterValue(position: string): LeagueAthleteModel {
    let athlete: LeagueAthleteModel = new LeagueAthleteModel();
    switch (this.leagueType) {
      case SportEnum.Baseball:
        break;
      case SportEnum.Basketball:
        break;
      case SportEnum.Football:
        switch (position) {
          case 'FTQB':
            athlete =
              (this.team?.roster as FootballRosterModel).FirstTeamQB ??
              new LeagueAthleteModel();
            break;
          case 'FTRB1':
            athlete =
              (this.team?.roster as FootballRosterModel).FirstTeamRB1 ??
              new LeagueAthleteModel();
            break;

          case 'FTRB2':
            athlete =
              (this.team?.roster as FootballRosterModel).FirstTeamRB2 ??
              new LeagueAthleteModel();
            break;

          case 'FTWR1':
            athlete =
              (this.team?.roster as FootballRosterModel).FirstTeamWR1 ??
              new LeagueAthleteModel();
            break;

          case 'FTWR2':
            athlete =
              (this.team?.roster as FootballRosterModel).FirstTeamWR2 ??
              new LeagueAthleteModel();
            break;

          case 'FTTE':
            athlete =
              (this.team?.roster as FootballRosterModel).FirstTeamTE ??
              new LeagueAthleteModel();
            break;

          case 'FTFLEX':
            athlete =
              (this.team?.roster as FootballRosterModel).FirstTeamFLEX ??
              new LeagueAthleteModel();
            break;

          case 'FTDST':
            athlete =
              (this.team?.roster as FootballRosterModel).FirstTeamDST ??
              new LeagueAthleteModel();
            break;

          case 'FTK':
            athlete =
              (this.team?.roster as FootballRosterModel).FirstTeamK ??
              new LeagueAthleteModel();
            break;

          case 'STQB':
            athlete =
              (this.team?.roster as FootballRosterModel).SecondTeamQB ??
              new LeagueAthleteModel();
            break;

          case 'STRB1':
            athlete =
              (this.team?.roster as FootballRosterModel).SecondTeamRB1 ??
              new LeagueAthleteModel();
            break;

          case 'STRB2':
            athlete =
              (this.team?.roster as FootballRosterModel).SecondTeamRB2 ??
              new LeagueAthleteModel();
            break;

          case 'STWR1':
            athlete =
              (this.team?.roster as FootballRosterModel).SecondTeamWR1 ??
              new LeagueAthleteModel();
            break;

          case 'STWR2':
            athlete =
              (this.team?.roster as FootballRosterModel).SecondTeamWR2 ??
              new LeagueAthleteModel();
            break;

          case 'STTE':
            athlete =
              (this.team?.roster as FootballRosterModel).SecondTeamTE ??
              new LeagueAthleteModel();
            break;

          case 'STFLEX':
            athlete =
              (this.team?.roster as FootballRosterModel).SecondTeamFLEX ??
              new LeagueAthleteModel();
            break;

          case 'STDST':
            athlete =
              (this.team?.roster as FootballRosterModel).SecondTeamDST ??
              new LeagueAthleteModel();
            break;

          case 'STK':
            athlete =
              (this.team?.roster as FootballRosterModel).SecondTeamK ??
              new LeagueAthleteModel();
            break;

          case 'B1':
            athlete =
              (this.team?.roster as FootballRosterModel).Bench1 ??
              new LeagueAthleteModel();
            break;

          case 'B2':
            athlete =
              (this.team?.roster as FootballRosterModel).Bench2 ??
              new LeagueAthleteModel();
            break;

          case 'B3':
            athlete =
              (this.team?.roster as FootballRosterModel).Bench3 ??
              new LeagueAthleteModel();
            break;

          case 'B4':
            athlete =
              (this.team?.roster as FootballRosterModel).Bench4 ??
              new LeagueAthleteModel();
            break;

          case 'B5':
            athlete =
              (this.team?.roster as FootballRosterModel).Bench5 ??
              new LeagueAthleteModel();
            break;

          case 'B6':
            athlete =
              (this.team?.roster as FootballRosterModel).Bench6 ??
              new LeagueAthleteModel();
            break;
          case 'IR':
            athlete =
              (this.team?.roster as FootballRosterModel).IR ??
              new LeagueAthleteModel();
            break;
        }
        break;
      case SportEnum.Soccer:
        break;
    }

    return athlete;
  }
}
