import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { BehaviorSubject, Observable, take } from 'rxjs';

import { PlayerHeaderComponent } from '../../../shared/components/shared/player-header/player-header.component';
import { DraftPickOrderTypeEnum } from '../../../shared/enums/draft-pick-order-type.enum';
import { SportEnum } from '../../../shared/enums/sport.enum';
import { DraftOrderModel } from '../../../shared/models/draft-order.model';
import { DraftSortOrderModel } from '../../../shared/models/draft-sort-order.model';
import { LeagueAthleteModel } from '../../../shared/models/league-athlete.model';
import { LeagueModel } from '../../../shared/models/league.model';
import { AthleteService } from '../../../shared/services/bl/athlete.service';
import { GeneralService } from '../../../shared/services/bl/general-service.service';
import { LeagueService } from '../../../shared/services/bl/league.service';
import { LoadingService } from '../../../shared/services/bl/loading.service';
import { UserModel } from '../../../shared/services/dl/models/user.model';
import { UserService } from '../../../shared/services/dl/user.service';
import { FastAPIService } from '../../../shared/services/fastAPI/fast-api.service';
import { PlayerSearchComponent } from '../player-search/player-search.component';
import { DraftMainComponent } from './draft-main/draft-main.component';
import { DraftMySelectionsComponent } from './draft-my-selections/draft-my-selections.component';
import { DraftNavComponent } from './draft-nav/draft-nav.component';
import { DraftOTPComponent } from './draft-otp/draft-otp.component';
import { DraftPickOrderComponent } from './draft-pick-order/draft-pick-order.component';
import { DraftPlayerComponent } from './draft-player/draft-player.component';
import { DraftQueueComponent } from './draft-queue/draft-queue.component';
import { DraftSelectionsComponent } from './draft-selections/draft-selections.component';
import { DraftNavEnum } from './enums/draft-nav.enum';
import { DraftCreatePickOrderDataWSModel } from './models/draft-create-pick-order-data.model';
import { DraftOrderPlayerWSModel } from './models/draft-order-player-ws.model';
import { DraftPlayerWSModel } from './models/draft-player-ws.model';
import { DraftResultPlayerWSModel } from './models/draft-results-player-ws.model';
import { DraftSelectionModel } from './models/draft-selection.model';
import { DraftGeneralService } from './services/draft-general.service';
import { DraftPickOrderService } from './services/draft-pick-order.service';
import { DraftWebSocketService } from './services/draft-web-socket.service';

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
    DraftOTPComponent,
    HttpClientModule,
    DialogModule,
    ButtonModule,
    AvatarModule,
    PlayerHeaderComponent,
    ToastModule,
    PlayerSearchComponent,
  ],
  providers: [
    LeagueService,
    AthleteService,
    DraftPickOrderService,
    DraftWebSocketService,
    FastAPIService,
    MessageService,
  ],
  styleUrls: ['draft.component.scss'],
  selector: 'draft',
  templateUrl: 'draft.component.html',
})
export class DraftComponent implements OnInit {
  readonly DraftNavEnum = DraftNavEnum;

  readonly SportEnum = SportEnum;

  isMobile: boolean = false;

  draftOrder: Observable<Array<DraftOrderModel>>;

  pickOrder: Observable<Array<DraftOrderModel>>;

  viewablePage: Observable<DraftNavEnum>;

  currentPick: Observable<DraftOrderModel>;

  endDraft: Observable<boolean>;

  pickUpdated: Observable<boolean>;

  athletes$: Observable<Array<LeagueAthleteModel>>;

  queue$: Observable<Array<LeagueAthleteModel>>;

  pickMade: Observable<LeagueAthleteModel>;

  myTeam: Observable<Array<LeagueAthleteModel>>;

  leagueAthlete$: Observable<Array<DraftSelectionModel>>; // May be able to remove

  draftSelections: Observable<Array<DraftSelectionModel>>;

  webSocketError: WritableSignal<string | null> = signal(null);

  inWaitingRoom: WritableSignal<boolean> = signal(false);

  playerDialogPlayer: WritableSignal<LeagueAthleteModel> = signal(
    new LeagueAthleteModel()
  );

  searchAthletes: WritableSignal<Array<LeagueAthleteModel>> = signal([]);

  activeLeague: LeagueModel | undefined;

  activeUser: UserModel | undefined;

  numberOfRounds: number = 0; // TODO: Update this to calculate by league settings based on number of players per team

  numberOfRoundsMap: Map<SportEnum, number> = new Map<SportEnum, number>([
    [SportEnum.Baseball, 0],
    [SportEnum.Basketball, 0],
    [SportEnum.Football, 24],
    [SportEnum.Soccer, 0],
    [SportEnum.None, 0],
  ]);

  draftStarted: boolean = false;

  draftKey: string = '';

  playerDialogVisible: boolean = false;

  searchDialogVisible: boolean = false;

  connectedUsers: string[] = []; // TODO: used to see who all is connected, need to integrate this with an auto pick solution

  private _viewablePage = new BehaviorSubject<DraftNavEnum>(DraftNavEnum.Main);

  private _pickMade = new BehaviorSubject<LeagueAthleteModel>(
    new LeagueAthleteModel()
  );

  private _athletes$ = new BehaviorSubject<Array<LeagueAthleteModel>>([]);

  private _leagueAthlete$ = new BehaviorSubject<Array<DraftSelectionModel>>([]);

  private _queue$ = new BehaviorSubject<Array<LeagueAthleteModel>>([]);

  private _myTeam = new BehaviorSubject<Array<LeagueAthleteModel>>([]);

  private _draftSelections = new BehaviorSubject<Array<DraftSelectionModel>>(
    []
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private leagueService: LeagueService,
    private draftPickOrderService: DraftPickOrderService,
    private userService: UserService,
    private draftWebSocketService: DraftWebSocketService,
    private fastApiService: FastAPIService,
    private loadingService: LoadingService,
    private messageService: MessageService
  ) {
    this.isMobile = GeneralService.isMobile();
    this.viewablePage = this._viewablePage.asObservable();
    this.pickMade = this._pickMade.asObservable();
    this.myTeam = this._myTeam.asObservable();
    this.athletes$ = this._athletes$.asObservable();
    this.queue$ = this._queue$.asObservable();
    this.leagueAthlete$ = this._leagueAthlete$.asObservable();
    this.draftSelections = this._draftSelections.asObservable();
    this.currentPick = this.draftPickOrderService.currentPick;
    this.draftOrder = this.draftPickOrderService.draftOrder;
    this.endDraft = this.draftPickOrderService.endDraft;
    this.pickUpdated = this.draftPickOrderService.pickUpdated;
    this.pickOrder = this.draftPickOrderService.pickOrder;
    this.activeUser = this.userService.currentUser;
  }

  ngOnInit() {
    const leagueID: string =
      this.activatedRoute.parent?.snapshot.params['leagueID'];

    this.activeLeague = this.leagueService.getLeague(leagueID ?? '-1');
    this.numberOfRounds =
      this.numberOfRoundsMap.get(
        this.activeLeague?.LeagueType ?? SportEnum.None
      ) ?? 0;
  }

  navigateToRoute(route: DraftNavEnum): void {
    this._viewablePage.next(route);
  }

  showDialog(player: LeagueAthleteModel): void {
    this.playerDialogVisible = true;
    this.playerDialogPlayer.set(player);
  }

  onSearch(): void {
    const a: Array<LeagueAthleteModel> = this._athletes$.value;
    this.searchAthletes.set(a);
    this.searchDialogVisible = true;
  }

  onAddToFromSearch(queue: boolean, player: LeagueAthleteModel): void {
    const p: LeagueAthleteModel | undefined = this._athletes$.value.find(
      (x) => x.AthleteID === player.AthleteID
    );
    if (p) {
      if (queue) {
        this.onAddToQueue(p);
      } else {
        this.onAddToRoster(p);
      }
    }
  }

  onAddToRoster(athlete: LeagueAthleteModel): void {
    const mt = this._myTeam.value;
    if (mt.length > 0) {
      mt.push(athlete);
    } else {
      mt[0] = athlete;
    }
    this._myTeam.next(mt);
    this._pickMade.next(athlete);
    this.onUpdateCurrentPick();
    this.updateAthletes(athlete);
    this.leagueService.addAthleteToTeam(
      this.activeLeague?.ID ?? '-1',
      this.activeUser?.ID ?? '-1',
      athlete
    );

    this.draftWebSocketService.sendMessage('select_player', {
      athlete_id: athlete.AthleteID,
      player_id: this.activeUser?.ID ?? -1,
    });
  }

  onAddToQueue(athlete: LeagueAthleteModel): void {
    const q = this._queue$.value;
    if (q.length > 0) {
      if (!q.find((a) => a.AthleteID === athlete.AthleteID)) {
        q.push(athlete);
      }
    } else {
      q.push(athlete);
    }

    this._queue$.next(q);
  }

  onRemoveFromQueue(athlete: LeagueAthleteModel): void {
    const q = this._queue$.value.filter(
      (x) => x.AthleteID != athlete.AthleteID
    );
    this._queue$.next(q);
  }

  onUpdateCurrentPick(): void {
    const dop: DraftOrderPlayerWSModel = new DraftOrderPlayerWSModel();
    this.draftPickOrderService.currentPick.pipe(take(1)).subscribe({
      next: (p) => {
        dop.user_id = p.Player.ID.toString();
        dop.index = p.SortOrder.SortOrder;
        dop.round = p.SortOrder.Round;
        dop.player_id = this._pickMade.value.AthleteID ?? null;
      },
    });
    this.draftWebSocketService.sendMessage('update_draft_order', dop);
    this.draftOrder.pipe(take(1)).subscribe({
      next: (p) => {
        if (p.length == 1) {
          this.stopDraft();
        }
      },
    });
  }

  onCreateDraft(): void {
    this.loadingService.setIsLoading(true);
    const pickOrder: Array<string> = [];

    this.activeLeague?.Players.forEach((player) => {
      pickOrder.push(player.ID);
    });

    const createPickOrderData: DraftCreatePickOrderDataWSModel =
      new DraftCreatePickOrderDataWSModel();
    createPickOrderData.draft_type =
      this.activeLeague?.Settings.DraftSettingsModel.DraftPickOrderType ??
      DraftPickOrderTypeEnum.RandomSnake;
    createPickOrderData.number_of_rounds = this.numberOfRounds;
    createPickOrderData.user_ids = pickOrder;

    this.fastApiService
      .createDraft(createPickOrderData)
      .subscribe((response: { draft_key: string }) => {
        this.draftKey = response.draft_key;
        this.loadingService.setIsLoading(false);
      });
  }

  onJoinDraft(joinKey: string) {
    this.draftWebSocketService
      .connect(
        joinKey,
        `${this.activeUser?.FirstName ?? ''} ${this.activeUser?.LastName ?? ''}`
      )
      .subscribe({
        next: (message) => this.handleMessage(message),
        error: (err) => console.error(err),
      });
  }

  onEnterDraft(): void {
    this.draftWebSocketService.sendMessage('start_draft', {});
  }

  private updateAthletes(athlete: LeagueAthleteModel): void {
    let r: Array<LeagueAthleteModel> = [];
    this.athletes$.pipe(take(1)).subscribe({ next: (a) => (r = a) });
    r = r.filter((x) => x.AthleteID != athlete.AthleteID);
    this.onRemoveFromQueue(athlete);
  }

  private setPickOrder(draftOrder: Array<DraftOrderPlayerWSModel>) {
    let pickOrder: Array<DraftOrderModel> = [];
    draftOrder.forEach((dop) => {
      const player = this.activeLeague?.Players.find(
        (x) => x.ID === dop.user_id.toString()
      );
      if (player) {
        const pickOrderModel: DraftOrderModel = new DraftOrderModel();
        pickOrderModel.Player = player;
        pickOrderModel.CurrentlyPicking = false;
        pickOrderModel.SortOrder = new DraftSortOrderModel();
        pickOrderModel.SortOrder.SortOrder = dop.index;
        pickOrderModel.SortOrder.Round = dop.round;

        if (dop.round == 0) {
          pickOrderModel.Player.DraftPickSortOrder = dop.index;
          player.DraftPickSortOrder = dop.index;
        }
        pickOrder.push(pickOrderModel);
      }
    });

    this.draftPickOrderService.createDraftOrder(pickOrder);
    this.draftPickOrderService.setPickOrder(pickOrder);
  }

  private handleMessage(message: any) {
    this.connectedUsers = message.connected_users;
    switch (message.type) {
      case 'error':
        this.webSocketError.set(null);
        this.webSocketError.set(message.message);
        this.inWaitingRoom.set(false);
        break;
      case 'client_connected':
        this.clientConnected(message);
        break;
      case 'draft_order_updated':
        this.draftOrderUpdate(message);
        break;
      case 'players_list':
        this.playersList(message);
        break;
      case 'player_selected':
        this.playerSelected(message);
        break;
      case 'start_draft':
        this.startDraft(message);
        break;
      case 'update':
        console.log(message);
        break;
      case 'client_disconnected':
        this.clientDisconnected(message);
        break;
    }
  }

  private clientConnected(message: any): void {
    this.inWaitingRoom.set(true);
    let draftOrder: Array<DraftOrderPlayerWSModel> = [];
    message.draft_order.forEach((d: DraftOrderPlayerWSModel) => {
      const dop: DraftOrderPlayerWSModel = new DraftOrderPlayerWSModel();
      dop.user_id = d.user_id.toString();
      dop.index = d.index;
      dop.round = d.round;
      draftOrder.push(dop);
    });
    this.setPickOrder(draftOrder);
  }

  private draftOrderUpdate(message: any): void {
    let draftOrderUpdated: Array<DraftOrderPlayerWSModel> = [];
    message.draft_order.forEach((d: DraftOrderPlayerWSModel) => {
      const dop: DraftOrderPlayerWSModel = new DraftOrderPlayerWSModel();
      dop.user_id = d.user_id;
      dop.index = d.index;
      dop.round = d.round;
      draftOrderUpdated.push(dop);
    });
    this.setPickOrder(draftOrderUpdated);

    let athletes: Array<LeagueAthleteModel> = [];
    athletes = message.draft_athletes.map((a: DraftPlayerWSModel) => {
      const p: LeagueAthleteModel =
        DraftGeneralService.DraftPlayerWSConverter(a);
      return p;
    });

    const draftResponseUpdated: Array<DraftSelectionModel> = [];
    this.activeLeague?.Players.forEach((player) => {
      const d: DraftSelectionModel = new DraftSelectionModel();
      d.ID = player.ID;
      d.Name = player.Name;
      message.draft_results.forEach((result: DraftResultPlayerWSModel) => {
        if (result.user_id === d.ID) {
          if (result.player_id.length >= 0) {
            const p = athletes.find((x) => x.AthleteID === result.player_id);
            if (p) {
              const messagePlayer: DraftResultPlayerWSModel =
                message.draft_results[
                  message.draft_results.length > 0
                    ? message.draft_results.length - 1
                    : 0
                ];
              if (
                messagePlayer &&
                messagePlayer.index == result.index &&
                messagePlayer.round == result.round
              ) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Player Selected',
                  detail: p.Name,
                });
              }

              d.Players.push(p);
              athletes = athletes.filter((x) => x.AthleteID != p.AthleteID);
            } else {
              const a: LeagueAthleteModel = new LeagueAthleteModel();
              d.Players.push(a);
            }
          } else {
            const a: LeagueAthleteModel = new LeagueAthleteModel();
            d.Players.push(a);
          }
        }
      });

      draftResponseUpdated.push(d);
    });

    this._draftSelections.next(draftResponseUpdated);

    if (message.allow_draft_entry) {
      this.draftStarted = true;
    }
  }

  private playersList(message: any): void {
    let players: Array<LeagueAthleteModel> = [];
    players = message.players.map((a: DraftPlayerWSModel) => {
      const p: LeagueAthleteModel =
        DraftGeneralService.DraftPlayerWSConverter(a);
      return p;
    });
    players = players.filter((x) => x.PlayerID == null);
    this._athletes$.next(players);
    if (this.searchDialogVisible) {
      this.onSearch();
    }
  }

  private startDraft(message: any): void {
    if (message.allow_draft_entry) {
      this.draftStarted = true;
    }

    const draftResponseUpdated: Array<DraftSelectionModel> = [];
    this.activeLeague?.Players.forEach((player) => {
      const d: DraftSelectionModel = new DraftSelectionModel();
      d.ID = player.ID;
      d.Name = player.Name;
      draftResponseUpdated.push(d);
    });

    this._draftSelections.next(draftResponseUpdated);
  }

  private playerSelected(message: any): void {
    let players: Array<LeagueAthleteModel> = [];
    players = message.players.map((a: DraftPlayerWSModel) => {
      const p: LeagueAthleteModel =
        DraftGeneralService.DraftPlayerWSConverter(a);
      return p;
    });

    players = players.filter((x) => x.PlayerID == null);
    this._athletes$.next(players);

    if (this.searchDialogVisible) {
      this.onSearch();
    }
  }

  private clientDisconnected(message: any): void {
    this.connectedUsers = this.connectedUsers.filter(
      (u) => u !== message.username
    );
  }

  private stopDraft(): void {
    this.draftPickOrderService.stopDraft();
  }
}
