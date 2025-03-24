import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { RouterOutlet } from '@angular/router';
import { combineLatest, interval, skip, Subject, take, takeUntil } from 'rxjs';

import { SessionCheckStatusService } from './pages/login/services/session-check-status.service';
import { MobileNavBarComponent } from './shared/components/mobile/mobile-nav-bar/mobile-nav-bar.component';
import { LoadingComponent } from './shared/components/shared/loading/loading.component';
import { WebNavBarComponent } from './shared/components/web/web-nav-bar/web-nav-bar.component';
import { AthleteService } from './shared/services/bl/athlete.service';
import { GeneralService } from './shared/services/bl/general-service.service';
import { LeagueService } from './shared/services/bl/league.service';
import { LoadingService } from './shared/services/bl/loading.service';
import { logoService } from './shared/services/bl/logo.service';
import { SchoolService } from './shared/services/bl/school.service';
import { UserService } from './shared/services/bl/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    WebNavBarComponent,
    MobileNavBarComponent,
    CommonModule,
    LoadingComponent,
  ],
  providers: [GeneralService, LeagueService, AthleteService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  isMobile: boolean = false;

  private unsubscribe = new Subject<void>();

  constructor(
    private athleteService: AthleteService,
    private leagueService: LeagueService,
    private logoService: logoService,
    private schoolsService: SchoolService,
    private angularFireAuth: AngularFireAuth,
    private sessionCheckService: SessionCheckStatusService,
    private loadingService: LoadingService,
    private currentUserService: UserService
  ) {
    this.isMobile = GeneralService.isMobile();

    interval(10000)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (v) => this.sessionCheckService.checkSessionStatus(),
      });

    this.angularFireAuth.authState.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (u) => {
        if (u) {
          this.loadingService.setIsLoading(true);
          this.athleteService.loadAthletes();
          this.athleteService.loadBasketballAthletes();
          this.athleteService.loadBaseballAthletes();
          this.schoolsService.loadSchools();
          this.logoService.loadLogos();
          this.schoolsService.schools.pipe(skip(1), take(1)).subscribe({
            next: (schools) => {
              combineLatest([
                this.currentUserService.CurrentUser,
                this.athleteService.players,
                this.athleteService.basketballPlayers,
                this.athleteService.baseballPlayers,
              ])
                .pipe(take(1))
                .subscribe({
                  next: ([user, fbPlayers, bkballPlayers, bsballPlayers]) => {
                    console.log([
                      user,
                      fbPlayers,
                      bkballPlayers,
                      bsballPlayers,
                    ]);
                    this.leagueService.convertLeagues(
                      [...user.LeagueIDs],
                      fbPlayers,
                      bkballPlayers,
                      bsballPlayers,
                      schools
                    );
                  },
                });
            },
          });
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }
}
