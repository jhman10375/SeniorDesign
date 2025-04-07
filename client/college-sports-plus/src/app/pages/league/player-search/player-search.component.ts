import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';

import { LeagueAthleteModel } from '../../../shared/models/league-athlete.model';
import { LeagueModel } from '../../../shared/models/league.model';
import { AthleteService } from '../../../shared/services/bl/athlete.service';
import { LeagueService } from '../../../shared/services/bl/league.service';
import { PlayerFilterBase } from './player-filter/player-filter.base.component';
import { PlayerFilterComponent } from './player-filter/player-filter/player-filter.component';
import { PlayerSortComponent } from './player-filter/player-sort/player-sort.component';
import { PlayerSearchViewComponent } from './player-search-view/player-search-view.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    ButtonModule,
    PlayerFilterComponent,
    PlayerSortComponent,
    PlayerSearchViewComponent,
  ],
  providers: [],
  selector: 'player-search',
  styleUrls: ['player-search.component.scss'],
  templateUrl: 'player-search.component.html',
})
export class PlayerSearchComponent
  extends PlayerFilterBase
  implements OnInit, OnDestroy
{
  @ViewChild('mySearchBox') mySearchBox: ElementRef;

  @Input() override set athletes(v: Array<LeagueAthleteModel>) {
    if (v) {
      v = this.updatePlayerIDs(
        v,
        this.leagueService.getLeague(this.leagueID) ?? new LeagueModel()
      );
      this.playersReadonly = v;
      this.searchPlayers(this.searchText(), v, this.draftMode);
      this._athleteList = v;
    }
  }

  override get athletes(): Array<LeagueAthleteModel> {
    return this._athleteList;
  }

  @Input() draftMode: boolean = false;

  @Input() endDraft: boolean = false;

  @Input() myPick: boolean = false;

  @Input() queue: Array<LeagueAthleteModel> = [];

  @Output() addToQueueFromSearchEmitter =
    new EventEmitter<LeagueAthleteModel>();

  @Output() addToRosterFromSearchEmitter =
    new EventEmitter<LeagueAthleteModel>();

  @Output() dialogPlayerEmitter = new EventEmitter<LeagueAthleteModel>();

  isAtParentRoute: boolean = false;

  leagueID: string;

  athleteSelectionDisplay: Array<LeagueAthleteModel> = [];

  private _athleteList: Array<LeagueAthleteModel> = [];

  private unsubscribe = new Subject<void>();

  constructor(
    private leagueService: LeagueService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private athleteService: AthleteService
  ) {
    super();
    this.athleteSelection.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (l) => {
        this.athleteSelectionDisplay = l;
      },
    });
  }

  override ngOnInit() {
    this.searchFilter = true;
    const leagueID: string =
      this.activatedRoute.parent?.snapshot.params['leagueID'];
    this.leagueID = leagueID;
    if (!this.draftMode && leagueID) {
      const activeLeague = this.leagueService.getLeague(leagueID);
      if (activeLeague) {
        this.leagueType = activeLeague.LeagueType;
        if (activeLeague.Athletes && activeLeague.Athletes.length > 0) {
          let a = this.updatePlayerIDs(
            activeLeague.Athletes,
            this.leagueService.getLeague(this.leagueID) ?? new LeagueModel()
          );
          this.athletes = a;
        } else {
          let a = this.athleteService.getAllAthletes(activeLeague.LeagueType);
          a = this.updatePlayerIDs(
            activeLeague.Athletes,
            this.leagueService.getLeague(this.leagueID) ?? new LeagueModel()
          );
          this.athletes = a;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  onClearFilter() {
    this.mySearchBox.nativeElement.focus();
    this.searchPlayers('', undefined, this.draftMode);
  }

  addToQueue(athlete: LeagueAthleteModel): void {
    this.addToQueueFromSearchEmitter.emit(athlete);
  }

  addToRoster(athlete: LeagueAthleteModel): void {
    this.addToRosterFromSearchEmitter.emit(athlete);
  }

  onPlayerSelected(player: LeagueAthleteModel): void {
    if (this.draftMode) {
      this.dialogPlayerEmitter.emit(player);
    } else {
      this.navigateTo(player.AthleteID);
    }
  }

  navigateTo(athleteID: string): void {
    const athlete: LeagueAthleteModel =
      this.athletes.find((x) => x.AthleteID == athleteID) ??
      new LeagueAthleteModel();
    this.router.navigate(['player', athleteID], {
      relativeTo: this.activatedRoute,
    });
  }

  updatePlayerIDs(
    athletes: Array<LeagueAthleteModel>,
    league: LeagueModel
  ): Array<LeagueAthleteModel> {
    const retVal: Array<LeagueAthleteModel> = [];
    const leagueAthletes: Array<LeagueAthleteModel> = [];
    if (league.Season && league.Season.length > 0) {
      league.Season.forEach((week) => {
        week.Games.forEach((game) => {
          game?.AwayTeam.forEach((player) => {
            player.Athlete.PlayerID = game.AwayTeamPlayerID;
            player.Athlete.PlayerID = game.AwayTeamPlayerID;
            leagueAthletes.push(player.Athlete);
          });
          game?.HomeTeam.forEach((player) => {
            player.Athlete.PlayerID = game.HomeTeamPlayerID;
            leagueAthletes.push(player.Athlete);
          });
        });
      });
    }
    leagueAthletes.forEach((athlete) => {
      athletes = athletes.filter((x) => x.AthleteID != athlete.AthleteID);
      retVal.push(athlete);
    });
    return retVal.concat(athletes);
  }

  checkIfAtParentRoute(): boolean {
    const currentUrl = this.router.url;
    const parentRouteParentSearch = `/league/${this.leagueID}/player-search`; // Construct the parent route dynamically
    const parentRouteDraftSearch = `/league/${this.leagueID}/draft`; // Construct the parent route dynamically

    // Check if the current URL is the parent route (i.e., /app/:id and not any child route)
    this.isAtParentRoute =
      currentUrl.length == parentRouteParentSearch.length ||
      currentUrl.length == parentRouteDraftSearch.length;

    return this.isAtParentRoute;
  }
}
