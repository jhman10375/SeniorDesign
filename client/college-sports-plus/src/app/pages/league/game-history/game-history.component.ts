import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { SportEnum } from '../../../shared/enums/sport.enum';
import { LeagueWeekModel } from '../../../shared/models/league-week.model';
import { LeagueModel } from '../../../shared/models/league.model';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { GeneralService } from '../../../shared/services/bl/general-service.service';
import { LeagueService } from '../../../shared/services/bl/league.service';

@Component({
  standalone: true,
  imports: [RouterLink, RouterOutlet, PipesModule],
  selector: 'game-history',
  templateUrl: 'game-history.component.html',
})
export class GameHistoryComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;

  teamID: string;

  LeagueID: string;

  leagueType: SportEnum;

  season: Array<LeagueWeekModel>;

  isAtParentRoute: boolean = false;

  league: LeagueModel;

  private unsubscribe = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private leagueService: LeagueService
  ) {
    this.isMobile = GeneralService.isMobile();

    const teamID: string = this.activatedRoute.snapshot.params['teamID'];
    const leagueID: string =
      this.activatedRoute.parent?.snapshot.params['leagueID'];
    if (leagueID) {
      this.teamID = teamID;
      this.LeagueID = leagueID;
      this.leagueService.league.pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (leagues) => {
          this.leagueType =
            this.leagueService.getLeagueType(leagueID) ?? SportEnum.None;

          const currentLeague: LeagueModel =
            leagues.find((x) => x.ID === leagueID) ?? new LeagueModel();
          this.league = currentLeague;
          if (currentLeague) {
            this.season = currentLeague.Season;
            this.season = this.season.sort((a, b) => a.Week - b.Week);
          }
          //   this.leagueWeek =
          //     currentLeague?.Season.find(
          //       (y) => y.Status == WeekStatusEnum.Current
          //     ) ?? new LeagueWeekModel();
          //   this.currentGame =
          //     this.leagueWeek.Games.find(
          //       (x) =>
          //         x.AwayTeamPlayerID === teamID || x.HomeTeamPlayerID === teamID
          //     ) ?? new LeagueGameModel();
        },
      });
    }
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  getTeamName(teamID: string): string {
    return this.league.Players.find((x) => x.ID === teamID)?.TeamName ?? '';
  }

  checkIfAtParentRoute(): boolean {
    const currentUrl = this.router.url;
    const parentRoute = `/league/${this.LeagueID}/history/${this.teamID}`; // Construct the parent route dynamically

    // Check if the current URL is the parent route (i.e., /app/:id and not any child route)
    this.isAtParentRoute = currentUrl.length == parentRoute.length;

    return this.isAtParentRoute;
  }
}
