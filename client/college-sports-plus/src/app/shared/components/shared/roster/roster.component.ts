import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DividerModule } from 'primeng/divider';

import { RosterPositionEnum } from '../../../enums/roster-position.enum';
import { SportEnum } from '../../../enums/sport.enum';
import { LeagueRosterAthleteModel } from '../../../models/league-roster-athlete.model';
import { PipesModule } from '../../../pipes/pipes.module';
import { RosterPlayerPipe } from '../../../pipes/roster-pipes/roster-player.pipe';
import { GeneralService } from '../../../services/bl/general-service.service';

@Component({
  standalone: true,
  imports: [CommonModule, DividerModule, PipesModule],
  selector: 'roster',
  styleUrls: ['roster.component.scss'],
  templateUrl: 'roster.component.html',
})
export class RosterComponent implements OnInit {
  @Input() team: Array<LeagueRosterAthleteModel> | undefined = undefined;

  @Input() leagueType: SportEnum = SportEnum.None;

  @Input() reverse: boolean = false;

  @Input() canEditTeam: boolean = false;

  @Input() game: boolean = false;

  @Output() navigateToEmitter = new EventEmitter<string>();

  @Output() editTeamEmitter = new EventEmitter<string>();

  isMobile: boolean = false;

  readonly SportEnum = SportEnum;

  readonly RosterPositionEnum = RosterPositionEnum;

  positions: Array<string>;

  positionsMap: Map<SportEnum, Array<string>> = new Map<
    SportEnum,
    Array<string>
  >([
    [
      SportEnum.Baseball,
      [
        'FTP',
        'FTC',
        'FTINF1',
        'FTINF2',
        'FTOF1',
        'FTOF2',
        'FTOF3',
        'FTUT',
        'FT1B',
        'FT3B',
        'STP',
        'STC',
        'STINF1',
        'STINF2',
        'STOF1',
        'STOF2',
        'STOF3',
        'STUT',
        'ST1B',
        'ST3B',
        'B1',
        'B2',
        'B3',
        'B4',
        'B5',
        'B6',
        'IR',
      ],
    ],
    [
      SportEnum.Basketball,
      [
        'FTC',
        'FTF1',
        'FTF2',
        'FTG1',
        'FTG2',
        'STC',
        'STF1',
        'STF2',
        'STG1',
        'STG2',
        'B1',
        'B2',
        'B3',
        'B4',
        'B5',
        'B6',
        'IR',
      ],
    ],
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
    [
      SportEnum.Soccer,
      [
        'FTF1',
        'FTF2',
        'FTF3',
        'FTMD1',
        'FTMD2',
        'FTD1',
        'FTD2',
        'FTD3',
        'FTFM',
        'FTM',
        'FTGK',
        'STF1',
        'STF2',
        'STF3',
        'STMD1',
        'STMD2',
        'STD1',
        'STD2',
        'STD3',
        'STFM',
        'STM',
        'STGK',
        'B1',
        'B2',
        'B3',
        'B4',
        'B5',
        'B6',
        'IR',
      ],
    ],
  ]);

  constructor() {
    this.isMobile = GeneralService.isMobile();
  }

  ngOnInit() {
    this.positions =
      this.positionsMap.get(this.leagueType ?? SportEnum.None) ?? [];
  }

  navigateTo(pos: string): void {
    const player: LeagueRosterAthleteModel = this.getPlayer(pos);
    this.navigateToEmitter.emit(player.Athlete.AthleteID);
  }

  onEditTeam(pos: string): void {
    this.editTeamEmitter.emit(pos);
  }

  getPlayer(pos: string): LeagueRosterAthleteModel {
    const footballRosterPositionPipe = new RosterPlayerPipe();
    return footballRosterPositionPipe.transform(
      pos,
      this.leagueType,
      this.team ?? []
    );
  }
}

/////// TODO NEXT
/*

3. update player-search to have a filter for available, take
4. update player-search-player view to have a add button for available players on in non-draft view
5. update player-search-player view to have team name (if on a different team), recruit button (if free agent), transfer button (to drop player)

*/
