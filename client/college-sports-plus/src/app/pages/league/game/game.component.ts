import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { RosterComponent } from '../../../shared/components/shared/roster/roster.component';
import { SportEnum } from '../../../shared/enums/sport.enum';
import { LeaguePlayerModel } from '../../../shared/models/league-player.model';
import { BaseballRosterModel } from '../../../shared/models/roster/baseball-roster.model';
import { BasketballRosterModel } from '../../../shared/models/roster/basketball-roster.model';
import { FootballRosterModel } from '../../../shared/models/roster/football-roster.model';
import { SoccerRosterModel } from '../../../shared/models/roster/soccer-roster.model';
import { GeneralService } from '../../../shared/services/bl/general-service.service';
import { LeagueService } from '../../../shared/services/bl/league.service';

@Component({
  standalone: true,
  imports: [RosterComponent, RouterOutlet],
  providers: [LeagueService],
  selector: 'game',
  styleUrls: ['game.component.scss'],
  templateUrl: 'game.component.html',
})
export class GameComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;

  readonly SportEnum = SportEnum;

  readonly FootballRosterModel = FootballRosterModel;

  team:
    | {
        player: LeaguePlayerModel | undefined;
        roster:
          | BaseballRosterModel
          | BasketballRosterModel
          | FootballRosterModel
          | SoccerRosterModel;
      }
    | undefined = undefined;

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
    if (leagueID) {
      this.teamID = teamID;
      this.LeagueID = leagueID;
      this.leagueService.league.pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (leagues) => {
          this.team = this.leagueService.getLeagueTeam(leagueID, teamID);
          this.leagueType =
            this.leagueService.getLeagueType(leagueID) ?? SportEnum.None;
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
    const parentRoute = `/league/${this.LeagueID}/current-games/${this.teamID}`; // Construct the parent route dynamically

    // Check if the current URL is the parent route (i.e., /app/:id and not any child route)
    this.isAtParentRoute = currentUrl.length == parentRoute.length;

    return this.isAtParentRoute;
  }
}
