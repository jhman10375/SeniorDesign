import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { MobileScoreBoardComponent } from '../../../shared/components/mobile/mobile-scoreboard/mobile-scoreboard.component';
import { RosterComponent } from '../../../shared/components/shared/roster/roster.component';
import { SportEnum } from '../../../shared/enums/sport.enum';
import { LeaguePlayerModel } from '../../../shared/models/league-player.model';
import { LeagueRosterAthleteModel } from '../../../shared/models/league-roster-athlete.model';
import { FootballRosterModel } from '../../../shared/models/roster/football-roster.model';
import { GeneralService } from '../../../shared/services/bl/general-service.service';
import { LeagueService } from '../../../shared/services/bl/league.service';
import { PlayerService } from '../../../shared/services/bl/player.service';
import { TeamSettingsComponent } from './team-settings/team-settings.component';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    MobileScoreBoardComponent,
    DividerModule,
    RosterComponent,
    DynamicDialogModule,
  ],
  providers: [DialogService],
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
    private leagueService: LeagueService,
    private dialogService: DialogService,
    private playerService: PlayerService
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

  onOpenMyTeamSettingsDialog(): void {
    const leagueJoinComponent = this.dialogService.open(TeamSettingsComponent, {
      header: 'Edit Team',
      width: this.isMobile ? '100vw' : '33vw',
      data: {
        team: this.currentPlayer,
      },
    });

    leagueJoinComponent.onClose.subscribe({
      next: (data) => {
        if (data) {
          this.currentPlayer.School = data.School;
          this.currentPlayer.Logos = data.Logo;
          this.currentPlayer.TeamName = data.TeamName;
          this.playerService.updatePlayer(this.currentPlayer);
          const league = this.leagueService.getLeague(this.LeagueID);
          const leaguePlayers: Array<LeaguePlayerModel> =
            league?.Players.filter(
              (x) => x.PlayerID != this.currentPlayer.PlayerID
            ) ?? [];
          if (league && leaguePlayers) {
            league.Players = [...leaguePlayers, this.currentPlayer];
            this.leagueService.updateLeague(league);
          }
        }
      },
    });
  }
}
