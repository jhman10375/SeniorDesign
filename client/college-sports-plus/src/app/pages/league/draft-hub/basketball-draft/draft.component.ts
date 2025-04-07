import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { BehaviorSubject, Observable, take } from 'rxjs';

import { PlayerHeaderComponent } from '../../../../shared/components/shared/player-header/player-header.component';
import { DraftPickOrderTypeEnum } from '../../../../shared/enums/draft-pick-order-type.enum';
import { BasketballPositionEnum } from '../../../../shared/enums/position/basketball-position.enum';
import { SportEnum } from '../../../../shared/enums/sport.enum';
import { CurrentUserModel } from '../../../../shared/models/current-user.model';
import { DraftOrderModel } from '../../../../shared/models/draft-order.model';
import { DraftSortOrderModel } from '../../../../shared/models/draft-sort-order.model';
import { LeagueAthleteModel } from '../../../../shared/models/league-athlete.model';
import { LeaguePlayerModel } from '../../../../shared/models/league-player.model';
import { LeagueModel } from '../../../../shared/models/league.model';
import { PipesModule } from '../../../../shared/pipes/pipes.module';
import { GeneralService } from '../../../../shared/services/bl/general-service.service';
import { LeagueService } from '../../../../shared/services/bl/league.service';
import { LoadingService } from '../../../../shared/services/bl/loading.service';
import { SchoolService } from '../../../../shared/services/bl/school.service';
import { UserService } from '../../../../shared/services/bl/user.service';
import { FastAPIService } from '../../../../shared/services/fastAPI/fast-api.service';
import { PlayerSearchComponent } from '../../player-search/player-search.component';
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
import { DraftPlayerStatsWSModel } from './models/draft-player-stats-ws.model';
import { DraftResultPlayerWSModel } from './models/draft-results-player-ws.model';
import { DraftSelectionModel } from './models/draft-selection.model';
import { BasketballDraftPlayerModel } from './models/sport-player/basketball.model';
import { DraftGeneralService } from './services/draft-general.service';
import { DraftPickOrderService } from './services/draft-pick-order.service';
import { DraftWebSocketService } from './services/draft-web-socket.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PipesModule,
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
    DraftPickOrderService,
    DraftWebSocketService,
    FastAPIService,
    MessageService,
  ],
  styleUrls: ['draft.component.scss'],
  selector: 'basketball-draft',
  templateUrl: 'draft.component.html',
})
export class BasketballDraftComponent implements OnInit {
  readonly DraftNavEnum = DraftNavEnum;

  readonly SportEnum = SportEnum;

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

  myTeam: Observable<Array<LeagueAthleteModel>>;

  leagueAthlete: Observable<Array<DraftSelectionModel>>; // May be able to remove

  draftSelections: Observable<Array<DraftSelectionModel>>;

  webSocketError: WritableSignal<string | null> = signal(null);

  inWaitingRoom: WritableSignal<boolean> = signal(false);

  playerDialogPlayer: WritableSignal<BasketballDraftPlayerModel> = signal(
    new BasketballDraftPlayerModel()
  );

  searchAthletes: WritableSignal<Array<LeagueAthleteModel>> = signal([]);

  activeLeague: LeagueModel | undefined;

  activeUser: CurrentUserModel | undefined;

  numberOfRounds: number = 0; // TODO: Update this to calculate by league settings based on number of players per team

  numberOfRoundsMap: Map<SportEnum, number> = new Map<SportEnum, number>([
    [SportEnum.Baseball, 10],
    [SportEnum.Basketball, 5],
    [SportEnum.Football, 7],
    [SportEnum.Soccer, 11],
    [SportEnum.None, 0],
  ]);

  // numberOfRoundsMap: Map<SportEnum, number> = new Map<SportEnum, number>([
  //   [SportEnum.Baseball, 26],
  //   [SportEnum.Basketball, 16],
  //   [SportEnum.Football, 24],
  //   [SportEnum.Soccer, 28],
  //   [SportEnum.None, 0],
  // ]);

  draftStarted: boolean = false;

  beforeDraftDate: boolean = true;

  joinedThroughRefresh: boolean = false;

  draftKey: string = '';

  playerDialogVisible: boolean = false;

  searchDialogVisible: boolean = false;

  draftPlayers: Array<BasketballDraftPlayerModel> = [];

  connectedUsers: string[] = []; // TODO: used to see who all is connected, need to integrate this with an auto pick solution

  private _viewablePage = new BehaviorSubject<DraftNavEnum>(DraftNavEnum.Main);

  private _pickMade = new BehaviorSubject<LeagueAthleteModel>(
    new LeagueAthleteModel()
  );

  private _athletes = new BehaviorSubject<Array<LeagueAthleteModel>>([]);

  private _leagueAthlete = new BehaviorSubject<Array<DraftSelectionModel>>([]);

  private _queue = new BehaviorSubject<Array<LeagueAthleteModel>>([]);

  private _myTeam = new BehaviorSubject<Array<LeagueAthleteModel>>([]);

  private _draftSelections = new BehaviorSubject<Array<DraftSelectionModel>>(
    []
  );

  private activeTeam: LeaguePlayerModel;

  constructor(
    private activatedRoute: ActivatedRoute,
    private leagueService: LeagueService,
    private draftPickOrderService: DraftPickOrderService,
    private userService: UserService,
    private draftWebSocketService: DraftWebSocketService,
    private fastApiService: FastAPIService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private schoolService: SchoolService,
    private router: Router
  ) {
    this.isMobile = GeneralService.isMobile();
    this.viewablePage = this._viewablePage.asObservable();
    this.pickMade = this._pickMade.asObservable();
    this.myTeam = this._myTeam.asObservable();
    this.athletes = this._athletes.asObservable();
    this.queue = this._queue.asObservable();
    this.leagueAthlete = this._leagueAthlete.asObservable();
    this.draftSelections = this._draftSelections.asObservable();
    this.currentPick = this.draftPickOrderService.currentPick;
    this.draftOrder = this.draftPickOrderService.draftOrder;
    this.endDraft = this.draftPickOrderService.endDraft;
    this.pickUpdated = this.draftPickOrderService.pickUpdated;
    this.pickOrder = this.draftPickOrderService.pickOrder;

    this.userService.CurrentUser.pipe(take(1)).subscribe({
      next: (c) => (this.activeUser = c),
    });
  }

  ngOnInit() {
    const leagueID: string =
      this.activatedRoute.parent?.snapshot.params['leagueID'];

    this.activeLeague = this.leagueService.getLeague(leagueID ?? '-1');
    this.activeTeam =
      this.activeLeague?.Players.find(
        (x) => x.PlayerID == this.activeUser?.ID
      ) ?? new LeaguePlayerModel();
    const draftKey = localStorage.getItem('bkbdk');
    const dk = draftKey?.substring(7);
    if (draftKey && dk && dk == this.activeLeague?.ID) {
      this.joinedThroughRefresh = true;
      this.onJoinDraft(draftKey.substring(0, 6));
      this.draftKey = draftKey.substring(0, 6);
    }
    this.numberOfRounds =
      this.numberOfRoundsMap.get(
        this.activeLeague?.LeagueType ?? SportEnum.None
      ) ?? 0;

    if ((this.activeLeague?.DraftDate.getTime() ?? 0) >= new Date().getTime()) {
      this.beforeDraftDate = true;
    } else {
      this.beforeDraftDate = false;
    }
  }

  navigateToRoute(route: DraftNavEnum): void {
    this._viewablePage.next(route);
  }

  showDialog(player: LeagueAthleteModel): void {
    const p: BasketballDraftPlayerModel =
      this.draftPlayers.find((x) => x.Athlete.AthleteID === player.AthleteID) ??
      new BasketballDraftPlayerModel();
    if (p.Athlete && p.Athlete.AthleteID && p.Athlete.AthleteID.length > 0) {
      this.schoolService
        .getSchoolByName(p.Athlete.Team)
        .pipe(take(1))
        .subscribe({
          next: (s) => {
            p.Athlete.Logos = s?.Logos ?? [];
            this.playerDialogPlayer.set(p);
            this.playerDialogVisible = true;
          },
        });
    }
  }

  onSearch(): void {
    const a: Array<LeagueAthleteModel> = this._athletes.value;
    this.searchAthletes.set(a);
    this.searchDialogVisible = true;
  }

  onAddToFromSearch(queue: boolean, player: LeagueAthleteModel): void {
    const p: LeagueAthleteModel | undefined = this._athletes.value.find(
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
    if (this.draftPickOrderService.isFinalPick()) {
      this.leagueService.setDraftComplete(this.activeLeague?.ID ?? '-1', true);
    }
    this.onUpdateCurrentPick();
    this.updateAthletes(athlete);
    this.leagueService.addAthleteToTeamFromDraft(
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

  onRemoveFromQueue(athlete: LeagueAthleteModel): void {
    const q = this._queue.value.filter((x) => x.AthleteID != athlete.AthleteID);
    this._queue.next(q);
  }

  onUpdateCurrentPick(): void {
    const dop: DraftOrderPlayerWSModel = new DraftOrderPlayerWSModel();
    this.draftPickOrderService.currentPick.pipe(take(1)).subscribe({
      next: (p) => {
        dop.user_id = p.Player.PlayerID.toString();
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
      pickOrder.push(player.PlayerID);
    });

    const createPickOrderData: DraftCreatePickOrderDataWSModel =
      new DraftCreatePickOrderDataWSModel();
    createPickOrderData.draft_type =
      this.activeLeague?.Settings.DraftSettingsModel?.PickOrderType ??
      DraftPickOrderTypeEnum.RandomSnake;
    createPickOrderData.number_of_rounds = this.numberOfRounds;
    createPickOrderData.user_ids = pickOrder;

    this.fastApiService
      .createBasketballDraft(createPickOrderData)
      .subscribe((response: { draft_key: string }) => {
        this.draftKey = response.draft_key;
        this.loadingService.setIsLoading(false);
      });
  }

  onJoinDraft(joinKey: string) {
    this.draftWebSocketService
      .connect(joinKey, `${this.activeTeam?.Name ?? 'apple'}`)
      .subscribe({
        next: (message) => {
          this.handleMessage(message);
          localStorage.setItem('bkbdk', `${joinKey}-${this.activeLeague?.ID}`);
        },
        error: (err) => {
          console.error(err);
          this.webSocketError.set(
            'Error Entering Waiting room. Are you sure your code is correct?' // used to give ios Error for OTP
          );
          localStorage.removeItem('bkbdk');
        },
      });
  }

  onEnterDraft(): void {
    this.draftWebSocketService.sendMessage('start_draft', {});
  }

  private updateAthletes(athlete: LeagueAthleteModel): void {
    let r: Array<LeagueAthleteModel> = [];
    this.athletes.pipe(take(1)).subscribe({ next: (a) => (r = a) });
    r = r.filter((x) => x.AthleteID != athlete.AthleteID);
    this.onRemoveFromQueue(athlete);
  }

  private setPickOrder(draftOrder: Array<DraftOrderPlayerWSModel>) {
    let pickOrder: Array<DraftOrderModel> = [];
    draftOrder.forEach((dop) => {
      const player = this.activeLeague?.Players.find(
        (x) => x.PlayerID === dop.user_id.toString()
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
          this.leagueService.updateLeague(
            this.activeLeague ?? new LeagueModel()
          );
        }
        pickOrder.push(pickOrderModel);
      }
    });

    this.draftPickOrderService.setPickOrder(pickOrder);
  }

  private setDraftOrder(draftOrder: Array<DraftOrderPlayerWSModel>) {
    let pickOrder: Array<DraftOrderModel> = [];
    draftOrder.forEach((dop) => {
      const player = this.activeLeague?.Players.find(
        (x) => x.PlayerID === dop.user_id.toString()
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
          this.leagueService.updateLeague(
            this.activeLeague ?? new LeagueModel()
          );
        }
        pickOrder.push(pickOrderModel);
      }
    });

    if (pickOrder.length > 0) {
      this.draftPickOrderService.createDraftOrder(pickOrder);
    } else {
      this.draftPickOrderService.stopDraft();
      this.draftStarted = false;
      this.router.navigate([`league/${this.activeLeague?.ID}/draft-results`]);
    }
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
    // let draftOrder: Array<DraftOrderPlayerWSModel> = [];
    // message.draft_order.forEach((d: DraftOrderPlayerWSModel) => {
    //   const dop: DraftOrderPlayerWSModel = new DraftOrderPlayerWSModel();
    //   dop.user_id = d.user_id.toString();
    //   dop.index = d.index;
    //   dop.round = d.round;
    //   draftOrder.push(dop);
    // });
    // this.setDraftOrder(draftOrder);

    // let pickOrder: Array<DraftOrderPlayerWSModel> = [];
    // message.pick_order.forEach((d: DraftOrderPlayerWSModel) => {
    //   const dop: DraftOrderPlayerWSModel = new DraftOrderPlayerWSModel();
    //   dop.user_id = d.user_id;
    //   dop.index = d.index;
    //   dop.round = d.round;
    //   pickOrder.push(dop);
    // });
    // this.setPickOrder(pickOrder);

    if (!this.joinedThroughRefresh) {
      this.draftStarted = message.allow_draft_entry;
    }
  }

  private draftOrderUpdate(message: any): void {
    let pickOrder: Array<DraftOrderPlayerWSModel> = [];
    message.pick_order.forEach((d: DraftOrderPlayerWSModel) => {
      const dop: DraftOrderPlayerWSModel = new DraftOrderPlayerWSModel();
      dop.user_id = d.user_id;
      dop.index = d.index;
      dop.round = d.round;
      pickOrder.push(dop);
    });
    this.setPickOrder(pickOrder);

    let draftOrderUpdated: Array<DraftOrderPlayerWSModel> = [];
    message.draft_order.forEach((d: DraftOrderPlayerWSModel) => {
      const dop: DraftOrderPlayerWSModel = new DraftOrderPlayerWSModel();
      dop.user_id = d.user_id;
      dop.index = d.index;
      dop.round = d.round;
      draftOrderUpdated.push(dop);
    });
    this.setDraftOrder(draftOrderUpdated);
    // athletes = message.draft_athletes.map((a: DraftPlayerWSModel) => {
    //   const p: LeagueAthleteModel =
    //     DraftGeneralService.DraftPlayerWSConverter(a);
    //   return p;
    // });
    let draftPlayers: Array<BasketballDraftPlayerModel> = [];
    draftPlayers = message.draft_athletes.map((a: DraftPlayerStatsWSModel) => {
      const p: BasketballDraftPlayerModel =
        DraftGeneralService.DraftPlayerStatsWSConverter(a);
      return p;
    });
    this.draftPlayers = draftPlayers;

    let athletes: Array<LeagueAthleteModel> = [];
    athletes = draftPlayers.map((x) => x.Athlete);

    const draftResponseUpdated: Array<DraftSelectionModel> = [];
    this.activeLeague?.Players.forEach((player) => {
      const d: DraftSelectionModel = new DraftSelectionModel();
      d.ID = player.PlayerID;
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

      if (this._myTeam.value.length == 0) {
        if (d.ID == this.activeUser?.ID) {
          this._myTeam.next(
            d.Players.map((x) => {
              if (x == null) {
                return new LeagueAthleteModel();
              } else {
                return x;
              }
            })
          );
        }
      }

      draftResponseUpdated.push(d);
    });

    const myTeam: Array<LeagueAthleteModel | null> | undefined =
      draftResponseUpdated.find((x) => x.ID == this.activeUser?.ID)?.Players;
    if (myTeam) {
      const filteredAthletes: Array<LeagueAthleteModel> = myTeam.filter(
        (athlete): athlete is LeagueAthleteModel =>
          athlete !== null && parseInt(athlete.AthleteID) > 0
      );
      this._myTeam.next(filteredAthletes);
    }
    let q: Array<LeagueAthleteModel> = [];
    this._myTeam.value.forEach((myPlayer) => {
      athletes = athletes?.filter((athlete) => {
        if (
          athlete.Position == BasketballPositionEnum.Forward ||
          athlete.Position == BasketballPositionEnum.Guard
        ) {
          return true;
        } else {
          if (athlete.Position !== myPlayer.Position) {
            return true;
          } else {
            return false;
          }
        }
      });
      q = this._queue.value?.filter((athlete) => {
        if (
          athlete.Position == BasketballPositionEnum.Forward ||
          athlete.Position == BasketballPositionEnum.Guard
        ) {
          return true;
        } else {
          if (athlete.Position !== myPlayer.Position) {
            return true;
          } else {
            return false;
          }
        }
      });
    });

    let Gcount = 2;
    let Fcount = 2;
    this._myTeam.value.forEach((athlete) => {
      if (athlete.Position == BasketballPositionEnum.Forward) {
        Gcount--;
      }
      if (athlete.Position == BasketballPositionEnum.Guard) {
        Fcount--;
      }
    });
    if (Fcount <= 0) {
      athletes = athletes?.filter(
        (athlete) => athlete.Position !== BasketballPositionEnum.Guard
      );
      q = this._queue.value?.filter(
        (athlete) => athlete.Position !== BasketballPositionEnum.Guard
      );
    }
    if (Gcount <= 0) {
      athletes = athletes?.filter(
        (athlete) => athlete.Position !== BasketballPositionEnum.Forward
      );
      q = this._queue.value?.filter(
        (athlete) => athlete.Position !== BasketballPositionEnum.Forward
      );
    }

    this._queue.next(q);
    this._athletes.next(athletes);
    this._athletes.next(athletes);

    this._draftSelections.next(draftResponseUpdated);

    this.draftStarted = message.allow_draft_entry;
  }

  private playersList(message: any): void {
    // players = message.players.map((a: DraftPlayerWSModel) => {
    //   const p: LeagueAthleteModel =
    //     DraftGeneralService.DraftPlayerWSConverter(a);
    //   return p;
    // });

    let draftPlayers: Array<BasketballDraftPlayerModel> = [];
    draftPlayers = message.players.map((a: DraftPlayerStatsWSModel) => {
      const p: BasketballDraftPlayerModel =
        DraftGeneralService.DraftPlayerStatsWSConverter(a);
      return p;
    });
    this.draftPlayers = draftPlayers;

    let q: Array<LeagueAthleteModel> = [];
    let players: Array<LeagueAthleteModel> = [];
    players = draftPlayers.map((x) => x.Athlete);

    players = players.filter((x) => x.PlayerID == null || x.PlayerID == '');
    this._myTeam.value.forEach((myPlayer) => {
      players = players?.filter((athlete) => {
        if (
          athlete.Position == BasketballPositionEnum.Forward ||
          athlete.Position == BasketballPositionEnum.Guard
        ) {
          return true;
        } else {
          if (athlete.Position !== myPlayer.Position) {
            return true;
          } else {
            return false;
          }
        }
      });
      q = this._queue.value?.filter((athlete) => {
        if (
          athlete.Position == BasketballPositionEnum.Forward ||
          athlete.Position == BasketballPositionEnum.Guard
        ) {
          return true;
        } else {
          if (athlete.Position !== myPlayer.Position) {
            return true;
          } else {
            return false;
          }
        }
      });
    });

    let Gcount = 2;
    let Fcount = 2;
    this._myTeam.value.forEach((athlete) => {
      if (athlete.Position == BasketballPositionEnum.Forward) {
        Fcount--;
      }
      if (athlete.Position == BasketballPositionEnum.Guard) {
        Gcount--;
      }
    });
    if (Gcount <= 0) {
      players = players?.filter(
        (athlete) => athlete.Position !== BasketballPositionEnum.Guard
      );
      q = this._queue.value?.filter(
        (athlete) => athlete.Position !== BasketballPositionEnum.Guard
      );
    }
    if (Fcount <= 0) {
      players = players?.filter(
        (athlete) => athlete.Position !== BasketballPositionEnum.Forward
      );
      q = this._queue.value?.filter(
        (athlete) => athlete.Position !== BasketballPositionEnum.Forward
      );
    }

    this._queue.next(q);
    this._athletes.next(players);
    if (this.searchDialogVisible) {
      this.onSearch();
    }

    this.draftStarted = message.allow_draft_entry;
  }

  private startDraft(message: any): void {
    let pickOrder: Array<DraftOrderPlayerWSModel> = [];
    message.pick_order.forEach((d: DraftOrderPlayerWSModel) => {
      const dop: DraftOrderPlayerWSModel = new DraftOrderPlayerWSModel();
      dop.user_id = d.user_id;
      dop.index = d.index;
      dop.round = d.round;
      pickOrder.push(dop);
    });
    this.setPickOrder(pickOrder);

    let draftOrder: Array<DraftOrderPlayerWSModel> = [];
    message.draft_order.forEach((d: DraftOrderPlayerWSModel) => {
      const dop: DraftOrderPlayerWSModel = new DraftOrderPlayerWSModel();
      dop.user_id = d.user_id.toString();
      dop.index = d.index;
      dop.round = d.round;
      draftOrder.push(dop);
    });
    this.setDraftOrder(draftOrder);

    const draftResponseUpdated: Array<DraftSelectionModel> = [];
    this.activeLeague?.Players.forEach((player) => {
      const d: DraftSelectionModel = new DraftSelectionModel();
      d.ID = player.PlayerID;
      d.Name = player.Name;
      draftResponseUpdated.push(d);
    });

    this._draftSelections.next(draftResponseUpdated);
    this.draftStarted = message.allow_draft_entry;
  }

  private playerSelected(message: any): void {
    // players = message.players.map((a: DraftPlayerWSModel) => {
    //   const p: LeagueAthleteModel =
    //     DraftGeneralService.DraftPlayerWSConverter(a);
    //   return p;
    // });

    let draftPlayers: Array<BasketballDraftPlayerModel> = [];
    draftPlayers = message.players.map((a: DraftPlayerStatsWSModel) => {
      const p: BasketballDraftPlayerModel =
        DraftGeneralService.DraftPlayerStatsWSConverter(a);
      return p;
    });
    this.draftPlayers = draftPlayers;

    let q: Array<LeagueAthleteModel> = [];
    let players: Array<LeagueAthleteModel> = [];
    players = draftPlayers.map((x) => x.Athlete);

    players = players.filter((x) => x.PlayerID == null || x.PlayerID == '');
    this._myTeam.value.forEach((myPlayer) => {
      players = players?.filter((athlete) => {
        if (
          athlete.Position == BasketballPositionEnum.Forward ||
          athlete.Position == BasketballPositionEnum.Guard
        ) {
          return true;
        } else {
          if (athlete.Position !== myPlayer.Position) {
            return true;
          } else {
            return false;
          }
        }
      });
      q = this._queue.value?.filter((athlete) => {
        if (
          athlete.Position == BasketballPositionEnum.Guard ||
          athlete.Position == BasketballPositionEnum.Forward
        ) {
          return true;
        } else {
          if (athlete.Position !== myPlayer.Position) {
            return true;
          } else {
            return false;
          }
        }
      });
    });

    let Gcount = 2;
    let Fcount = 2;
    this._myTeam.value.forEach((athlete) => {
      if (athlete.Position == BasketballPositionEnum.Forward) {
        Fcount--;
      }
      if (athlete.Position == BasketballPositionEnum.Guard) {
        Gcount--;
      }
    });
    if (Gcount <= 0) {
      players = players?.filter(
        (athlete) => athlete.Position !== BasketballPositionEnum.Guard
      );
      q = this._queue.value?.filter(
        (athlete) => athlete.Position !== BasketballPositionEnum.Guard
      );
    }
    if (Fcount <= 0) {
      players = players?.filter(
        (athlete) => athlete.Position !== BasketballPositionEnum.Forward
      );
      q = this._queue.value?.filter(
        (athlete) => athlete.Position !== BasketballPositionEnum.Forward
      );
    }

    this._queue.next(q);
    this._athletes.next(players);

    if (this.searchDialogVisible) {
      this.onSearch();
    }

    this.draftStarted = message.allow_draft_entry;
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
