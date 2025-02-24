import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { Subject, takeUntil } from 'rxjs';

import { MobileScoreBoardComponent } from '../../../shared/components/mobile/mobile-scoreboard/mobile-scoreboard.component';
import { RosterComponent } from '../../../shared/components/shared/roster/roster.component';
import { SportEnum } from '../../../shared/enums/sport.enum';
import { LeaguePlayerModel } from '../../../shared/models/league-player.model';
import { LeagueRosterAthleteModel } from '../../../shared/models/league-roster-athlete.model';
import { FootballRosterModel } from '../../../shared/models/roster/football-roster.model';
import { GeneralService } from '../../../shared/services/bl/general-service.service';
import { LeagueService } from '../../../shared/services/bl/league.service';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    MobileScoreBoardComponent,
    DividerModule,
    RosterComponent,
  ],
  providers: [],
  selector: 'team',
  styleUrls: ['team.component.scss'],
  templateUrl: 'team.component.html',
})
export class TeamComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;

  readonly SportEnum = SportEnum;

  readonly FootballRosterModel = FootballRosterModel;

  team: Array<LeagueRosterAthleteModel> | undefined = undefined;

  currentPlayer: LeaguePlayerModel;

  isAtParentRoute: boolean = false;

  teamID: string;

  LeagueID: string;

  leagueType: SportEnum;

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
    if (teamID && leagueID) {
      this.teamID = teamID;
      this.LeagueID = leagueID;
      this.leagueService.league.pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (leagues) => {
          this.team = this.leagueService.getLeagueTeam(leagueID, teamID);
          this.leagueType =
            this.leagueService.getLeagueType(leagueID) ?? SportEnum.None;

          this.currentPlayer =
            leagues
              .find((x) => x.ID === leagueID)
              ?.Players?.find((y) => y.PlayerID === teamID) ??
            new LeaguePlayerModel();
          console.log(this.team);
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
    const parentRoute = `/league/${this.LeagueID}/team/${this.teamID}`; // Construct the parent route dynamically

    // Check if the current URL is the parent route (i.e., /app/:id and not any child route)
    this.isAtParentRoute = currentUrl.length == parentRoute.length;

    return this.isAtParentRoute;
  }
}
