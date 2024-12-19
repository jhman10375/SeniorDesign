import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

import { LeagueSearchModel } from '../../shared/models/league-search.model';
import { AthleteService } from '../../shared/services/bl/athlete.service';
import { LeagueService } from '../../shared/services/bl/league.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    ButtonModule,
  ],
  providers: [LeagueService, AthleteService],
  selector: 'league-search',
  styleUrls: ['league-search.component.scss'],
  templateUrl: 'league-search.component.html',
})
export class LeagueSearchComponent implements OnInit, OnDestroy {
  @ViewChild('mySearchBox') mySearchBox: ElementRef;

  leagues: Observable<Array<LeagueSearchModel>>;

  searchText: string;

  leaguesReadonly: Array<LeagueSearchModel>;

  private _leagues = new BehaviorSubject<Array<LeagueSearchModel>>([]);

  private unsubscribe = new Subject<void>();

  constructor(
    private leagueService: LeagueService,
    private activatedRoute: ActivatedRoute
  ) {
    this.leagues = this._leagues.asObservable();
    let lt: number = -1;
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (query) => {
          lt = query['lt'] as number;
        },
      });

    this.leagueService
      .getLeaguesForSearch(Number(lt))
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
}
