import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { RouterOutlet } from '@angular/router';
import { skip, Subject, take, takeUntil } from 'rxjs';

import { MobileNavBarComponent } from './shared/components/mobile/mobile-nav-bar/mobile-nav-bar.component';
import { LoadingComponent } from './shared/components/shared/loading/loading.component';
import { WebNavBarComponent } from './shared/components/web/web-nav-bar/web-nav-bar.component';
import { AthleteService } from './shared/services/bl/athlete.service';
import { GeneralService } from './shared/services/bl/general-service.service';
import { LeagueService } from './shared/services/bl/league.service';

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
    private angularFireAuth: AngularFireAuth
  ) {
    this.isMobile = GeneralService.isMobile();

    this.angularFireAuth.authState.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (u) => {
        if (u) {
          this.athleteService.loadAthletes();
          this.athleteService.players
            .pipe(
              skip(1), // Skip the first value
              take(1) // Take only the second value
            )
            .subscribe({
              next: (athletes) => {
                this.leagueService.convertLeagues(athletes);
              },
              error: (e) => console.error(e),
            });
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }
}
