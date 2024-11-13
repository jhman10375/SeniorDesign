import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { DraftOrderModel } from '../../../shared/models/draft-order.model';
import { LeagueAthleteModel } from '../../../shared/models/league-athlete.model';
import { LeagueModel } from '../../../shared/models/league.model';
import { AthleteService } from '../../../shared/services/bl/athlete.service';
import { GeneralService } from '../../../shared/services/bl/general-service.service';
import { LeagueService } from '../../../shared/services/bl/league.service';
import { UserModel } from '../../../shared/services/dl/models/user.model';
import { UserService } from '../../../shared/services/dl/user.service';
import { DraftMainComponent } from './draft-main/draft-main.component';
import { DraftMySelectionsComponent } from './draft-my-selections/draft-my-selections.component';
import { DraftNavComponent } from './draft-nav/draft-nav.component';
import { DraftPickOrderComponent } from './draft-pick-order/draft-pick-order.component';
import { DraftPlayerComponent } from './draft-player/draft-player.component';
import { DraftQueueComponent } from './draft-queue/draft-queue.component';
import { DraftSelectionsComponent } from './draft-selections/draft-selections.component';
import { DraftNavEnum } from './enums/draft-nav.enum';
import { DraftPickOrderService } from './services/draft-pick-order.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DraftNavComponent,
    DraftMainComponent,
    DraftPickOrderComponent,
    DraftPlayerComponent,
    DraftQueueComponent,
    DraftSelectionsComponent,
    DraftMySelectionsComponent,
  ],
  providers: [LeagueService, AthleteService, DraftPickOrderService],
  styleUrls: ['draft.component.scss'],
  selector: 'draft',
  templateUrl: 'draft.component.html',
})
export class DraftComponent implements OnInit {
  readonly DraftNavEnum = DraftNavEnum;

  isMobile: boolean = false;

  draftOrder: Observable<Array<DraftOrderModel>>;

  pickOrder: Observable<Array<DraftOrderModel>>;

  viewablePage: Observable<DraftNavEnum>;

  currentPick: Observable<DraftOrderModel>;

  endDraft: Observable<boolean>;

  pickUpdated: Observable<boolean>;

  athletes: Observable<Array<LeagueAthleteModel>>;

  queue: Observable<Array<LeagueAthleteModel>>;

  pickMade: Observable<LeagueAthleteModel>;

  activeLeague: LeagueModel | undefined;

  activeUser: UserModel | undefined;

  selectionTime: number;

  numberOfRounds: number = 10; // TODO: Update this to calculate by league settings based on number of players per team

  private _viewablePage = new BehaviorSubject<DraftNavEnum>(DraftNavEnum.Main);

  private _pickMade = new BehaviorSubject<LeagueAthleteModel>(
    new LeagueAthleteModel()
  );

  private _queue = new BehaviorSubject<Array<LeagueAthleteModel>>([]);

  constructor(
    private activatedRoute: ActivatedRoute,
    private leagueService: LeagueService,
    private draftPickOrderService: DraftPickOrderService,
    private athleteService: AthleteService,
    private userService: UserService
  ) {
    this.isMobile = GeneralService.isMobile();

    this.viewablePage = this._viewablePage.asObservable();
    this.pickMade = this._pickMade.asObservable();
    this.queue = this._queue.asObservable();
    this.currentPick = this.draftPickOrderService.currentPick;
    this.draftOrder = this.draftPickOrderService.draftOrder;
    this.endDraft = this.draftPickOrderService.endDraft;
    this.pickUpdated = this.draftPickOrderService.pickUpdated;
    this.pickOrder = this.draftPickOrderService.pickOrder;
    this.athletes = this.athleteService.players;
    this.activeUser = this.userService.currentUser;
  }

  ngOnInit() {
    const leagueID: string =
      this.activatedRoute.parent?.snapshot.params['leagueID'];

    this.activeLeague = this.leagueService.getLeague(leagueID ?? '-1');

    if (this.activeLeague) {
      this.draftPickOrderService.setPickOrder(this.activeLeague);
    }
  }

  updateCurrentPick(): void {
    this.draftPickOrderService.updateCurrentPick();
  }

  addToRoster(athlete: LeagueAthleteModel): void {
    console.log(athlete);
    this._pickMade.next(athlete);
    this.updateCurrentPick();
  }

  addToQueue(athlete: LeagueAthleteModel): void {
    console.log(athlete);
    const q = this._queue.value;
    if (q.length > 0) {
      if (!q.find((a) => a.AthleteID === athlete.AthleteID)) {
        q.push(athlete);
      }
    } else {
      q.push(athlete);
    }

    this._queue.next(q);
  }

  removeFromQueue(athlete: LeagueAthleteModel): void {
    const q = this._queue.value.filter((x) => x.AthleteID != athlete.AthleteID);
    this._queue.next(q);
  }

  navigateToRoute(route: DraftNavEnum): void {
    this._viewablePage.next(route);
  }
}
