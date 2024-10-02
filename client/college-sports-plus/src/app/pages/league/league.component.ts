import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { LeagueScorboardModel } from '../../shared/models/league-scoreboard.model';
import { GeneralService } from '../../shared/services/general-service.service';
import { LeagueService } from '../../shared/services/league.service';

@Component({
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  providers: [LeagueService],
  styleUrls: ['league.component.scss'],
  selector: 'league',
  templateUrl: 'league.component.html',
})
export class LeagueComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;

  activeLeague: LeagueScorboardModel;

  private unsubscribe = new Subject<void>();

  constructor(
    private activatedRouteSnapshot: ActivatedRoute,
    private leagueService: LeagueService,
    private router: Router
  ) {
    this.isMobile = GeneralService.isMobile();

    this.leagueService.leagueScoreboard
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (leagueScoreboard) => {
          const currentID = this.activatedRouteSnapshot.snapshot.params['id'];
          this.activeLeague =
            leagueScoreboard.find((ls) => ls.ID === currentID) ??
            new LeagueScorboardModel();
        },
      });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  navigateTo(url: string): void {
    this.router.navigate([url], { relativeTo: this.activatedRouteSnapshot });
  }
}
