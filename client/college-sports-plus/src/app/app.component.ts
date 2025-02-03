import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { skip, take } from 'rxjs';

import { MobileNavBarComponent } from './shared/components/mobile/mobile-nav-bar/mobile-nav-bar.component';
import { LoadingComponent } from './shared/components/shared/loading/loading.component';
import { WebNavBarComponent } from './shared/components/web/web-nav-bar/web-nav-bar.component';
import { AthleteService } from './shared/services/bl/athlete.service';
import { GeneralService } from './shared/services/bl/general-service.service';
import { LeagueService } from './shared/services/bl/league.service';
import { SchoolService } from './shared/services/bl/school.service';

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
export class AppComponent {
  isMobile: boolean = false;

  constructor(
    private athleteService: AthleteService,
    private leagueService: LeagueService,
    private schoolService: SchoolService
  ) {
    this.isMobile = GeneralService.isMobile();
    this.schoolService.loadSchools();
    this.athleteService.loadAthletes();
    this.schoolService.schools.pipe(skip(1), take(1)).subscribe({
      next: (schools) => {
        this.athleteService.players
          .pipe(
            // skip(1), // Skip the first value
            take(1) // Take only the second value
          )
          .subscribe({
            next: (athletes) =>
              this.leagueService.convertLeagues(athletes, schools),
          });
      },
    });
  }
}
