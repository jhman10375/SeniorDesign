import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { MobileScoreBoardComponent } from '../../../shared/components/mobile/mobile-scoreboard/mobile-scoreboard.component';
import { LeagueAthleteModel } from '../../../shared/models/league-athlete.model';
import { LeaguePlayerModel } from '../../../shared/models/league-player.model';
import { AthleteService } from '../../../shared/services/bl/athlete.service';
import { GeneralService } from '../../../shared/services/bl/general-service.service';
import { LeagueService } from '../../../shared/services/bl/league.service';

@Component({
  standalone: true,
  imports: [RouterOutlet, MobileScoreBoardComponent],
  providers: [LeagueService, AthleteService],
  selector: 'team',
  templateUrl: 'team.component.html',
})
export class TeamComponent implements OnInit {
  isMobile: boolean = false;

  player:
    | {
        player: LeaguePlayerModel;
        athletes: LeagueAthleteModel[];
      }
    | undefined = undefined;

  isAtParentRoute: boolean = false;

  teamID: string;

  LeagueID: string;

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
      this.player = this.leagueService.getLeagueTeam(leagueID, teamID);
    }
  }

  ngOnInit() {}

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
