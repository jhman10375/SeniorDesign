import { CommonModule } from '@angular/common';
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
import { SchoolService } from '../../../../services/bl/school.service';
import { UserService } from '../../../../services/bl/user.service';

@Component({
  standalone: true,
  imports: [CommonModule, AvatarModule],
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
            x.HomeTeamPlayerID === this.myTeam.ID ||
            x.AwayTeamPlayerID === this.myTeam.ID
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

  awayTeamScore: number = 0;

  homeTeam: LeaguePlayerModel | undefined;

  homeTeamScore: number = 0;

  private myTeam: LeaguePlayerModel;

  private currentUser: CurrentUserModel;

  private leagueID: string;

  private _LeagueWeek: LeagueWeekModel;

  constructor(
    private userService: UserService,
    private leagueService: LeagueService,
    private activatedRoute: ActivatedRoute,
    private schoolService: SchoolService,
    private router: Router
  ) {
    const urlTree = this.router.parseUrl(this.router.url);
    const segments = urlTree.root.children['primary']?.segments;
    if (segments.length > 5) {
      this.leagueID =
        this.activatedRoute.parent?.parent?.snapshot.params['leagueID'];
    } else {
      this.leagueID = this.activatedRoute.parent?.snapshot.params['leagueID'];
    }

    this.userService.CurrentUser.pipe(take(1)).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.myTeam =
          this.leagueService
            .getLeague(this.leagueID)
            ?.Players.find((x) => x.PlayerID == this.currentUser.ID) ??
          new LeaguePlayerModel();
      },
    });
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
    this.schoolService
      .getSchoolByName(this.homeTeam?.School?.School ?? '')
      .subscribe({
        next: (school) => {
          if (this.homeTeam) {
            this.homeTeam.School = school ?? this.homeTeam?.School;
            this.homeTeam.Logos = this.homeTeam?.School.Logos;
          }
        },
      });
    this.schoolService
      .getSchoolByName(this.awayTeam?.School?.School ?? '')
      .subscribe({
        next: (school) => {
          if (this.awayTeam) {
            this.awayTeam.School = school ?? this.awayTeam?.School;
            this.awayTeam.Logos = this.awayTeam?.School.Logos;
          }
        },
      });

    this.currentGame.AwayTeam?.forEach((player) => {
      this.awayTeamScore += player.Athlete.PredictedScore;
    });

    this.currentGame.HomeTeam?.forEach((player) => {
      this.homeTeamScore += player.Athlete.PredictedScore;
    });
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
