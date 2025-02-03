import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { take } from 'rxjs';

import { CurrentUserModel } from '../../../../models/current-user.model';
import { LeagueGameModel } from '../../../../models/league-game.model';
import { LeaguePlayerModel } from '../../../../models/league-player.model';
import { LeagueWeekModel } from '../../../../models/league-week.model';
import { LeagueModel } from '../../../../models/league.model';
import { LeagueService } from '../../../../services/bl/league.service';
import { UserService } from '../../../../services/bl/user.service';

@Component({
  standalone: true,
  imports: [AvatarModule],
  selector: 'mobile-game-information-scoreboard',
  styleUrls: ['mobile-game-information-scoreboard.component.scss'],
  templateUrl: 'mobile-game-information-scoreboard.component.html',
})
export class MobileGameInformationScoreboardComponent implements OnInit {
  @Input() set LeagueWeek(v: LeagueWeekModel) {
    if (v) {
      this.currentGame =
        v.Games.find(
          (x) =>
            x.HomeTeamPlayerID === this.currentUser.ID ||
            x.AwayTeamPlayerID === this.currentUser.ID
        ) ?? new LeagueGameModel();
      this.setTeams();
      this._LeagueWeek = v;
    }
  }

  get LeagueWeek(): LeagueWeekModel {
    return this._LeagueWeek;
  }

  @Output() newGameToViewEmitter = new EventEmitter<LeagueGameModel>();

  currentGame: LeagueGameModel = new LeagueGameModel();

  awayTeam: LeaguePlayerModel | undefined;

  homeTeam: LeaguePlayerModel | undefined;

  private currentUser: CurrentUserModel;

  private leagueID: string;

  private _LeagueWeek: LeagueWeekModel;

  constructor(
    private userService: UserService,
    private leagueService: LeagueService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.userService.CurrentUser.pipe(take(1)).subscribe({
      next: (user) => (this.currentUser = user),
    });

    const urlTree = this.router.parseUrl(this.router.url);
    const segments = urlTree.root.children['primary']?.segments;
    if (segments.length > 5) {
      this.leagueID =
        this.activatedRoute.parent?.parent?.snapshot.params['leagueID'];
    } else {
      this.leagueID = this.activatedRoute.parent?.snapshot.params['leagueID'];
    }
  }

  ngOnInit() {}

  setTeams(): void {
    const currentLeague: LeagueModel =
      this.leagueService.getLeague(this.leagueID) ?? new LeagueModel();
    this.homeTeam = currentLeague.Players.find(
      (x) => x.ID === this.currentGame.HomeTeamPlayerID
    );
    this.awayTeam = currentLeague.Players.find(
      (x) => x.ID === this.currentGame.AwayTeamPlayerID
    );
  }

  switchGame(direction: 'Left' | 'Right', currentGame: LeagueGameModel) {
    const nextGameIndex = this.LeagueWeek.Games.indexOf(currentGame);
    const nextGameIndexOutOfBounds: boolean =
      (nextGameIndex == 0 && direction == 'Left') ||
      (nextGameIndex >= this.LeagueWeek.Games.length - 1 &&
        direction == 'Right');
    if (direction === 'Left') {
      if (nextGameIndex >= 0) {
        let nextGame: LeagueGameModel = new LeagueGameModel();
        if (nextGameIndexOutOfBounds) {
          nextGame = this.LeagueWeek.Games[this.LeagueWeek.Games.length - 1];
        } else {
          nextGame = this.LeagueWeek.Games[nextGameIndex - 1];
        }
        this.currentGame = nextGame;
        this.setTeams();
        this.newGameToViewEmitter.emit(nextGame);
      }
    } else {
      if (nextGameIndex >= 0) {
        let nextGame: LeagueGameModel = new LeagueGameModel();
        if (nextGameIndexOutOfBounds) {
          nextGame = this.LeagueWeek.Games[0];
        } else {
          nextGame = this.LeagueWeek.Games[nextGameIndex + 1];
        }
        this.currentGame = nextGame;
        this.setTeams();
        this.newGameToViewEmitter.emit(nextGame);
      }
    }
  }
}
