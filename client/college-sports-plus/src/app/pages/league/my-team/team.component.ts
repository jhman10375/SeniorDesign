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
import { RosterPlayerPipe } from '../../../shared/pipes/roster-pipes/roster-player.pipe';
import { GeneralService } from '../../../shared/services/bl/general-service.service';
import { LeagueService } from '../../../shared/services/bl/league.service';
import { PlayerService } from '../../../shared/services/bl/player.service';
import { SchoolService } from '../../../shared/services/bl/school.service';
import { TransferDialogCloseTypeEnum } from './enums/transfer-dialog-close-type.enum';
import { MyTeamHelperService } from './services/my-team-helper.service';
import { TeamSettingsComponent } from './team-settings/team-settings.component';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    MobileScoreBoardComponent,
    DividerModule,
    RosterComponent,
    DynamicDialogModule,
  ],
  providers: [MyTeamHelperService, DialogService],
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
    private playerService: PlayerService,
    private myTeamHelperService: MyTeamHelperService,
    private schoolService: SchoolService
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
              ?.Players?.find((y) => y.ID === teamID) ??
            new LeaguePlayerModel();
          this.schoolService
            .getSchoolByName(this.currentPlayer.School.School)
            .subscribe({
              next: (school) => {
                this.currentPlayer.School = school ?? this.currentPlayer.School;
                this.currentPlayer.Logos = this.currentPlayer.School.Logos;
              },
            });
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

  onTeamEdit(pos: string): void {
    console.log(this.getPlayer(pos));
    let positions: Array<string> = [];

    if (
      pos == 'B1' ||
      pos == 'B2' ||
      pos == 'B3' ||
      pos == 'B4' ||
      pos == 'B5' ||
      pos == 'B6'
    ) {
      pos = this.getPlayer(pos).Athlete.Position.toString();
    }

    switch (this.leagueType) {
      case SportEnum.Football:
        positions = positions.concat(
          this.myTeamHelperService.getFootballPositions(pos)
        );
        break;
      case SportEnum.Basketball:
        positions = positions.concat(
          this.myTeamHelperService.getBasketballPositions(pos)
        );
        break;
      case SportEnum.Baseball:
        positions = positions.concat(
          this.myTeamHelperService.getBaseballPositions(pos)
        );
        break;
      case SportEnum.Soccer:
        positions = positions.concat(
          this.myTeamHelperService.getSoccerPositions(pos)
        );
        break;
    }
    const b1Player = this.getPlayer('B1');
    if (
      pos.includes(b1Player.Athlete.Position.toString()) ||
      pos.includes('FLEX')
    ) {
      positions.push('B1');
    }

    const b2Player = this.getPlayer('B2');
    if (
      pos.includes(b2Player.Athlete.Position.toString()) ||
      pos.includes('FLEX')
    ) {
      positions.push('B2');
    }

    const b3Player = this.getPlayer('B3');
    if (
      pos.includes(b3Player.Athlete.Position.toString()) ||
      pos.includes('FLEX')
    ) {
      positions.push('B3');
    }

    const b4Player = this.getPlayer('B4');
    if (
      pos.includes(b4Player.Athlete.Position.toString()) ||
      pos.includes('FLEX')
    ) {
      positions.push('B4');
    }

    const b5Player = this.getPlayer('B5');
    if (
      pos.includes(b5Player.Athlete.Position.toString()) ||
      pos.includes('FLEX')
    ) {
      positions.push('B5');
    }

    const b6Player = this.getPlayer('B6');
    if (
      pos.includes(b6Player.Athlete.Position.toString()) ||
      pos.includes('FLEX')
    ) {
      positions.push('B6');
    }

    const positionPlayers: Array<LeagueRosterAthleteModel> = [];
    positions.forEach((p) => {
      positionPlayers.push(this.getPlayer(p));
    });
    const transferDialogComponent = this.dialogService.open(
      TransferDialogComponent,
      {
        header: `Edit ${positionPlayers[0]?.Athlete.Position} Lineup`,
        width: this.isMobile ? '100vw' : '33vw',
        data: {
          team: positionPlayers,
          originalTeam: positionPlayers,
        },
      }
    );

    transferDialogComponent.onClose.subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          switch (data.CloseType) {
            case TransferDialogCloseTypeEnum.NoChange:
              console.log('NoChange');
              break;
            case TransferDialogCloseTypeEnum.Reorder:
              console.log('Reorder');
              const updatedTeam = this.myTeamHelperService.updateTeam(
                this.leagueType,
                positions,
                data.Athletes,
                this.team ?? []
              );
              console.log('UpdatedTeam', updatedTeam);
              this.leagueService.updateTeam(
                this.LeagueID,
                this.teamID,
                updatedTeam
              );
              this.team = updatedTeam;
              break;
            case TransferDialogCloseTypeEnum.Transfer:
              console.log('Transfer');
              const newTeam = this.myTeamHelperService.transferPlayer(
                data.Athlete,
                this.team ?? []
              );
              console.log('UpdatedTeam', newTeam);
              this.leagueService.updateTeam(
                this.LeagueID,
                this.teamID,
                newTeam
              );
              this.team = newTeam;
              break;
          }
        }
      },
    });
  }

  private getPlayer(pos: string): LeagueRosterAthleteModel {
    const rosterPositionPipe = new RosterPlayerPipe();
    return rosterPositionPipe.transform(pos, this.leagueType, this.team ?? []);
  }
}
