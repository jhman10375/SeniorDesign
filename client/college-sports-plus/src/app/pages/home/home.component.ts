import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Observable, Subject, takeUntil } from 'rxjs';

import { MobileScoreBoardComponent } from '../../shared/components/mobile/mobile-scoreboard/mobile-scoreboard.component';
import { SportEnum } from '../../shared/enums/sport.enum';
import { LeagueScorboardModel } from '../../shared/models/league-scoreboard.model';
import { AthleteService } from '../../shared/services/bl/athlete.service';
import { GeneralService } from '../../shared/services/bl/general-service.service';
import { LeagueService } from '../../shared/services/bl/league.service';
import { LoadingService } from '../../shared/services/bl/loading.service';
import { FastAPIService } from '../../shared/services/fastAPI/fast-api.service';
import { AuthService } from '../login/services/auth.service';

@Component({
  standalone: true,
  imports: [
    MobileScoreBoardComponent,
    RouterLink,
    CommonModule,
    HttpClientModule,
    AvatarModule,
    OverlayPanelModule,
  ],
  providers: [AthleteService, FastAPIService],
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly SportEnum = SportEnum;

  isMobile: boolean = false;

  userInitials: WritableSignal<string> = signal('');

  leagueList: Observable<Array<LeagueScorboardModel>>;

  private unsubscribe = new Subject<void>();

  constructor(
    private leagueService: LeagueService,
    private fastAPIService: FastAPIService,
    private authService: AuthService,
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.isMobile = GeneralService.isMobile();

    this.leagueList = this.leagueService.leagueScoreboard;

    // this.leagueService.leagueScoreboard.subscribe({
    //   next: (l) => console.log(l),
    // });

    ////////////// Dummy calls for testing purposes
    this.fastAPIService.getStatus();
    // this.fastAPIService.getTeams('ohio');

    this.loadingService.setIsLoading(true);
    // this.fastAPIService.getLogos();
    // this.fastAPIService.getPlayers();
  }
  ngOnInit() {}

  ngAfterViewInit(): void {
    this.angularFireAuth.authState.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (u) => {
        this.userInitials.set(u?.displayName ? u.displayName : 'U');
        this.userInitials.set(
          this.userInitials()
            .split(' ')
            .filter((word: string | any[]) => word.length > 0)
            .map((word) => word[0].toUpperCase())
            .join('')
        );
        this.loadingService.setIsLoading(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  logout(): void {
    this.authService.logout();
  }
}
