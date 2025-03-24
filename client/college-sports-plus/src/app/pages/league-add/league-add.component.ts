import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { SportEnum } from '../../shared/enums/sport.enum';
import { NewBaseballLeagueComponent } from './new-league/baseball/new-baseball-league.component';
import { NewBasketballLeagueComponent } from './new-league/basketball/new-basketball-league.component';
import { NewFootballLeagueComponent } from './new-league/football/new-football-league.component';
import { NewSoccerLeagueComponent } from './new-league/soccer/new-soccer-league.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NewFootballLeagueComponent,
    NewBasketballLeagueComponent,
    RouterLink,
    NewBaseballLeagueComponent,
    NewSoccerLeagueComponent,
  ],
  selector: 'league-add',
  styleUrls: ['league-add.component.scss'],
  templateUrl: 'league-add.component.html',
})
export class LeagueAddComponent implements OnInit, OnDestroy {
  readonly SportEnum = SportEnum;

  leagueType: WritableSignal<SportEnum> = signal(SportEnum.None);

  private unsubscribe = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (query) => {
          this.leagueType.set(query['lt'] as SportEnum);
        },
      });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }
}
