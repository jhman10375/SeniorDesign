import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MobileScoreBoardComponent } from '../../../shared/components/mobile/mobile-scoreboard/mobile-scoreboard.component';
import { RosterComponent } from '../../../shared/components/shared/roster/roster.component';
import { SportEnum } from '../../../shared/enums/sport.enum';
import { WeekStatusEnum } from '../../../shared/enums/week-status.enum';
import { LeagueGameModel } from '../../../shared/models/league-game.model';
import { LeagueWeekModel } from '../../../shared/models/league-week.model';
import { LeagueModel } from '../../../shared/models/league.model';
import { FootballRosterModel } from '../../../shared/models/roster/football-roster.model';
import { GeneralService } from '../../../shared/services/bl/general-service.service';
import { LeagueService } from '../../../shared/services/bl/league.service';

@Component({
  standalone: true,
  imports: [RosterComponent, RouterOutlet, MobileScoreBoardComponent],
  providers: [],
  selector: 'game',
  styleUrls: ['game.component.scss'],
  templateUrl: 'game.component.html',
})
export class GameComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;

  readonly SportEnum = SportEnum;

  readonly FootballRosterModel = FootballRosterModel;

  leagueWeek: LeagueWeekModel;

  currentGame: LeagueGameModel;

  isAtParentRoute: boolean = false;

  teamID: string;

  LeagueID: string;

  weekID: string;

  leagueType: SportEnum;

  private unsubscribe = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private leagueService: LeagueService
  ) {
    this.isMobile = GeneralService.isMobile();

    this.weekID = this.activatedRoute.snapshot.params['weekID'];
    let teamID: string;
    let leagueID: string;
    if (this.weekID) {
      teamID = this.activatedRoute.parent?.snapshot.params['teamID'];
      leagueID =
        this.activatedRoute.parent?.parent?.snapshot.params['leagueID'];
    } else {
      teamID = this.activatedRoute.snapshot.params['teamID'];
      leagueID = this.activatedRoute.parent?.snapshot.params['leagueID'];
    }
    if (leagueID) {
      this.teamID = teamID;
      this.LeagueID = leagueID;
      this.leagueService.league.pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (leagues) => {
          this.leagueType =
            this.leagueService.getLeagueType(leagueID) ?? SportEnum.None;

          const currentLeague: LeagueModel =
            leagues.find((x) => x.ID === leagueID) ?? new LeagueModel();
          if (this.weekID) {
            this.leagueWeek =
              currentLeague?.Season.find(
                (y) => y.Week.toString() == this.weekID
              ) ?? new LeagueWeekModel();
          } else {
            this.leagueWeek =
              currentLeague?.Season.find(
                (y) => y.Status == WeekStatusEnum.Current
              ) ?? new LeagueWeekModel();
          }
          this.currentGame =
            this.leagueWeek.Games.find(
              (x) =>
                x.AwayTeamPlayerID === teamID || x.HomeTeamPlayerID === teamID
            ) ?? new LeagueGameModel();
        },
      });
    }
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  navigateTo(athleteID: string): void {
    this.router.navigate(['player', athleteID], {
      relativeTo: this.activatedRoute,
    });
  }

  checkIfAtParentRoute(): boolean {
    const currentUrl = this.router.url;
    let parentRoute: string = '';
    if (this.weekID) {
      parentRoute = `/league/${this.LeagueID}/history/${this.teamID}/past-game/${this.weekID}`; // Construct the parent route dynamically
    } else {
      parentRoute = `/league/${this.LeagueID}/current-games/${this.teamID}`; // Construct the parent route dynamically
    }

    // Check if the current URL is the parent route (i.e., /app/:id and not any child route)
    this.isAtParentRoute = currentUrl.length == parentRoute.length;

    return this.isAtParentRoute;
  }

  updateGameView(game: LeagueGameModel): void {
    this.currentGame = game;
  }
}
