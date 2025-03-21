import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { BehaviorSubject, Observable, take } from 'rxjs';

import { LeagueAthleteModel } from '../../shared/models/league-athlete.model';
import { AthleteService } from '../../shared/services/bl/athlete.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    InputTextModule,
    FormsModule,
  ],
  providers: [],
  selector: 'players',
  templateUrl: 'players.component.html',
})
export class PlayersComponent implements OnInit {
  players: Observable<Array<LeagueAthleteModel>>;

  playersReadOnly: Array<LeagueAthleteModel>;

  searchValue: string = '';

  private _players = new BehaviorSubject<Array<LeagueAthleteModel>>([]);

  constructor(
    private athleteService: AthleteService,
    private router: Router
  ) {
    this.players = this._players.asObservable();
    this.athleteService.players.pipe(take(1)).subscribe({
      next: (p) => (this.playersReadOnly = p),
    });
    this._players.next(this.playersReadOnly);
  }

  ngOnInit() {}

  filter(searchStr: string): void {
    const retVal: Array<LeagueAthleteModel> = this.playersReadOnly.filter(
      (x) => {
        if (
          x.Name.toLocaleLowerCase().includes(searchStr.toLocaleLowerCase()) ||
          x.Number.toString()
            .toLocaleLowerCase()
            .includes(searchStr.toLocaleLowerCase()) ||
          x.School.Name.toLocaleString()
            .toLocaleLowerCase()
            .includes(searchStr.toLocaleLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      }
    );
    this._players.next(retVal);
  }

  checkIfAtParentRoute(): boolean {
    const currentUrl = this.router.url;
    const parentRoute = `/players`; // Construct the parent route dynamically

    // Check if the current URL is the parent route (i.e., /app/:id and not any child route)
    return currentUrl.length == parentRoute.length;
  }
}
