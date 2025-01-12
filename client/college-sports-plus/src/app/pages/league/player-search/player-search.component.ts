import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
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

import { LeagueAthleteModel } from '../../../shared/models/league-athlete.model';
import { LeagueService } from '../../../shared/services/bl/league.service';
import { PlayerFilterBase } from './player-filter/player-filter.base.component';
import { PlayerFilterComponent } from './player-filter/player-filter/player-filter.component';
import { PlayerSortComponent } from './player-filter/player-sort/player-sort.component';

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
  ],
  providers: [LeagueService],
  selector: 'player-search',
  styleUrls: ['player-search.component.scss'],
  templateUrl: 'player-search.component.html',
})
export class PlayerSearchComponent extends PlayerFilterBase implements OnInit {
  @ViewChild('mySearchBox') mySearchBox: ElementRef;

  @Input() override set athletes(v: Array<LeagueAthleteModel>) {
    if (v) {
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

  private _athleteList: Array<LeagueAthleteModel> = [];

  constructor(
    private leagueService: LeagueService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  override ngOnInit() {
    this.searchFilter = true;
    const leagueID: string =
      this.activatedRoute.parent?.snapshot.params['leagueID'];
    this.leagueID = leagueID;
    if (!this.draftMode && leagueID) {
      const activeLeague = this.leagueService.getLeague(leagueID);
      if (activeLeague) {
        this.athletes = activeLeague.Athletes;
      }
    }
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
    this.router.navigate(['player', athleteID], {
      relativeTo: this.activatedRoute,
    });
  }

  inQueue(athlete: LeagueAthleteModel): boolean {
    if (this.queue.find((x) => x.AthleteID === athlete.AthleteID)) {
      return true;
    } else {
      return false;
    }
  }

  checkIfAtParentRoute(): boolean {
    const currentUrl = this.router.url;
    const parentRoute = `/league/${this.leagueID}/player-search`; // Construct the parent route dynamically

    // Check if the current URL is the parent route (i.e., /app/:id and not any child route)
    this.isAtParentRoute = currentUrl.length == parentRoute.length;

    return this.isAtParentRoute;
  }
}
