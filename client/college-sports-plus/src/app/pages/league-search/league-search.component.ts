import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

import { SportEnum } from '../../shared/enums/sport.enum';
import { CurrentUserModel } from '../../shared/models/current-user.model';
import { LeagueSearchModel } from '../../shared/models/league-search.model';
import { GeneralService } from '../../shared/services/bl/general-service.service';
import { LeagueService } from '../../shared/services/bl/league.service';
import { UserService } from '../../shared/services/bl/user.service';
import { LeagueJoinComponent } from './league-join/league-join.component';
import { CanJoinLeaguePipe } from './pipes/can-join-league.pipe';
import { CurrentLeaguePlayersPipe } from './pipes/current-league-players.pipe';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    ButtonModule,
    RouterLink,
    DynamicDialogModule,
    ToastModule,
    CanJoinLeaguePipe,
    CurrentLeaguePlayersPipe,
  ],
  providers: [DialogService, MessageService],
  selector: 'league-search',
  styleUrls: ['league-search.component.scss'],
  templateUrl: 'league-search.component.html',
})
export class LeagueSearchComponent implements OnInit, OnDestroy {
  @ViewChild('mySearchBox') mySearchBox: ElementRef;

  isMobile: boolean = false;

  myLeagues: Array<string> = [];

  leagues: Observable<Array<LeagueSearchModel>>;

  searchText: string;

  leaguesReadonly: Array<LeagueSearchModel>;

  private _leagues = new BehaviorSubject<Array<LeagueSearchModel>>([]);

  private currentUser: CurrentUserModel;

  private unsubscribe = new Subject<void>();

  constructor(
    private leagueService: LeagueService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private messageService: MessageService,
    private userService: UserService
  ) {
    this.isMobile = GeneralService.isMobile();

    this.leagues = this._leagues.asObservable();
    let lt: SportEnum = SportEnum.None;
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (query) => {
          lt = query['lt'] as SportEnum;
          this.leagueService.getLeaguesForSearch(lt);
        },
      });

    this.userService.CurrentUser.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (user) => {
        this.myLeagues = user.LeagueIDs;
        this.currentUser = user;
      },
    });

    this.leagueService.leaguesForSearch
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (x) => {
          this._leagues.next(x);
          this.leaguesReadonly = x;
        },
      });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  filterLeagues(text: string): void {
    if (text.length >= 3) {
      const f = this.leaguesReadonly.filter((x) => x.Name.includes(text));
      this._leagues.next(f);
    } else {
      this._leagues.next(this.leaguesReadonly);
    }
    this.searchText = text;
  }

  onClearFilter() {
    this.mySearchBox.nativeElement.focus();
    this.filterLeagues('');
  }

  joinLeague(leagueSearch: LeagueSearchModel): void {
    // const league: LeagueModel | undefined = this.leagueService.getLeague(
    //   leagueSearch.ID
    // );
    if (leagueSearch) {
      const leagueJoinComponent = this.dialogService.open(LeagueJoinComponent, {
        header: 'Join League',
        width: this.isMobile ? '100vw' : '33vw',
        data: {
          passcodeRequired: !leagueSearch.Settings.GSM.PL,
        },
      });

      leagueJoinComponent.onClose.subscribe({
        next: (data) => {
          if (data?.player) {
            let canJoinLeague: boolean = false;
            if (leagueSearch.Settings.GSM.PL) {
              canJoinLeague = true;
            } else if (
              !leagueSearch.Settings.GSM.PL &&
              data.passcode &&
              data.passcode == leagueSearch.Settings.GSM.P
            ) {
              canJoinLeague = true;
            } else {
              canJoinLeague = false;
              this.messageService.add({
                severity: 'error',
                detail: 'Error: Invalid Passcode',
              });
            }
            if (canJoinLeague) {
              data.player.LeagueID = leagueSearch.ID;
              data.player.ID = this.leagueService.generateID();
              this.leagueService.addPlayerToLeague(
                leagueSearch.ID,
                data.player
              );
              this.currentUser.LeagueIDs.push(leagueSearch.ID);
              this.userService.updateCurrentUser(this.currentUser);
              this.messageService.add({
                severity: 'success',
                detail: 'You Have Joined The League',
              });
            }
          } else {
            this.messageService.add({
              severity: 'error',
              detail: 'Error: Could Not Join League, Try Again Later',
            });
          }
        },
      });
    }
  }
}
