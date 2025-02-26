import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { LeagueGameModel } from '../../../models/league-game.model';
import { LeaguePlayerModel } from '../../../models/league-player.model';
import { LeagueScorboardModel } from '../../../models/league-scoreboard.model';
import { LeagueWeekModel } from '../../../models/league-week.model';
import { MobileGameInformationScoreboardComponent } from './mobile-game-information-scoreboard/mobile-game-information-scoreboard.component';
import { MobileLeagueInformationScoreboardComponent } from './mobile-league-information-scoreboard/mobile-league-information-scoreboard.component';
import { MobileTeamScoreboardComponent } from './mobile-team-scoreboard/mobile-team-scoreboard.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MobileLeagueInformationScoreboardComponent,
    MobileTeamScoreboardComponent,
    MobileGameInformationScoreboardComponent,
  ],
  selector: 'mobile-scoreboard',
  styleUrls: ['mobile-scoreboard.component.scss'],
  templateUrl: 'mobile-scoreboard.component.html',
})
export class MobileScoreBoardComponent implements OnInit {
  @Input() hasDifferentContent: boolean = false;

  @Input() leagueInformationScoreboard: boolean = false;

  @Input() gameScoreboard: boolean = false;

  @Input() teamScoreboard: boolean = false;

  @Input() customHeight: string | undefined = undefined;

  @Input() league: LeagueScorboardModel = new LeagueScorboardModel();

  @Input() player: LeaguePlayerModel | undefined = new LeaguePlayerModel();

  @Input() LeagueWeek: LeagueWeekModel;

  @Output() newGameToViewEmitter = new EventEmitter<LeagueGameModel>();

  @Output() openMyTeamSettingsDialogEmitter = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  onNewGameToView(g: LeagueGameModel): void {
    this.newGameToViewEmitter.emit(g);
  }

  onOpenMyTeamSettingsDialog(): void {
    this.openMyTeamSettingsDialogEmitter.emit();
  }
}
