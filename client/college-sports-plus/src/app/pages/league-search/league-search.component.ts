import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

import { LeagueSearchModel } from '../../shared/models/league-search.model';
import { AthleteService } from '../../shared/services/bl/athlete.service';
import { LeagueService } from '../../shared/services/bl/league.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  providers: [LeagueService, AthleteService],
  selector: 'league-search',
  templateUrl: 'league-search.component.html',
})
export class LeagueSearchComponent implements OnInit, OnDestroy {
  leagues: Observable<Array<LeagueSearchModel>>;

  private unsubscribe = new Subject<void>();

  constructor(
    private leagueService: LeagueService,
    private activatedRoute: ActivatedRoute
  ) {
    let lt: number = -1;
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (query) => {
          lt = query['lt'] as number;
        },
      });
    this.leagues = this.leagueService.getLeaguesForSearch(Number(lt));
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }
}
