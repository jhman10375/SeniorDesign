import {
  Component,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SportEnum } from '../../../../shared/enums/sport.enum';
import { LeagueAthleteModel } from '../../../../shared/models/league-athlete.model';

@Component({
  standalone: true,
  imports: [],
  selector: 'player-filter-base',
  template: ``,
})
export class PlayerFilterBase implements OnInit {
  @Input() set athletes(v: Array<LeagueAthleteModel>) {
    if (v) {
      if (!this.playersReadonly) {
        // Initialize playersReadonly on first set
        this.playersReadonly = [...v];
      }
      if (
        this.currentPositionFilter() != null ||
        this.currentSortFunction() != 'None'
      ) {
        this.updateAthletes(v);
      } else {
        this._athleteSelection.next(v);
      }
      this._athletes = v;
    }
  }

  get athletes(): Array<LeagueAthleteModel> {
    return this._athletes;
  }

  @Input() set leagueType(v: SportEnum) {
    if (v) {
      switch (v) {
        case SportEnum.Football:
          this.positionFilters = [
            'None',
            'QB',
            'RB',
            'WR',
            'TE',
            'OL',
            'C',
            'OT',
            'FB',
            'DL',
            'DT',
            'NT',
            'DE',
            'LB',
            'DB',
            'CB',
            'S',
            'P',
            'PK',
            'LS',
          ];
          break;
        case SportEnum.Baseball:
          this.positionFilters = [
            'None',
            'P',
            'C',
            'INF',
            'OF',
            '1B',
            '3B',
            'UT',
          ];
          break;
        case SportEnum.Basketball:
          this.positionFilters = ['None', 'C', 'F', 'G'];
          break;
        case SportEnum.Soccer:
          this.positionFilters = ['None'];
          break;
      }
    }
  }

  athleteSelection: Observable<Array<LeagueAthleteModel>>;

  currentPositionFilter: WritableSignal<string | null> = signal(null);

  currentSortType: WritableSignal<'Up' | 'Down' | 'None'> = signal('None');

  currentSortFunction: WritableSignal<
    'Name' | 'Number' | 'Proj PPG' | 'School' | 'None'
  > = signal('None');

  searchText: WritableSignal<string> = signal('');

  positionFilters: Array<string> = [];

  searchFilter: boolean = false;

  playersReadonly: Array<LeagueAthleteModel>;

  private _athletes: Array<LeagueAthleteModel> = [];

  private _athleteSelection = new BehaviorSubject<Array<LeagueAthleteModel>>(
    []
  );

  constructor() {
    this.athleteSelection = this._athleteSelection.asObservable();
  }

  ngOnInit() {}

  setFilter(position: string): void {
    if (position == 'None') {
      this.currentPositionFilter.set(null);
    } else {
      this.currentPositionFilter.set(position);
    }
    this.updateAthletes();
  }

  setFilterss(filterType: string, position: string): void {
    if (filterType === 'Position') {
      if (position === 'None') {
        this.currentPositionFilter.set(null);
      } else {
        this.currentPositionFilter.set(position);
      }
    }
    this.updateAthletes();
  }

  setSortFunction(
    sortFunction: 'Name' | 'Number' | 'Proj PPG' | 'School'
  ): void {
    if (
      this.currentSortFunction() == 'None' ||
      this.currentSortFunction() != sortFunction
    ) {
      this.currentSortFunction.set(sortFunction);
      this.currentSortType.set('None');
    }
    this.updateSortType();
  }

  searchPlayers(
    text: string,
    players: Array<LeagueAthleteModel> | undefined = undefined,
    draftMode: boolean = false
  ): void {
    if (players) {
      this.searchText.set(text);
      this.updateAthletes(players, draftMode);
    } else {
      this.searchText.set(text);
      this.updateAthletes([], draftMode);
    }
  }

  private updateAthletes(
    athletes: Array<LeagueAthleteModel> | undefined = undefined,
    draftMode: boolean = false
  ): void {
    let arr: Array<LeagueAthleteModel> = [];
    if (this.searchFilter) {
      const p = athletes ? [...this.playersReadonly] : [...this.athletes];
      if (
        ((this.searchText().length >= 3 || Number(this.searchText())) &&
          draftMode) ||
        ((this.searchText().length > 0 || Number(this.searchText())) &&
          !draftMode)
      ) {
        const f = p.filter(
          (x) =>
            x.Name.toLocaleLowerCase().includes(
              this.searchText().toLocaleLowerCase()
            ) ||
            x.School.toLocaleLowerCase().includes(
              this.searchText().toLocaleLowerCase()
            ) ||
            x.Jersey.toString().includes(this.searchText()) ||
            x.PredictedScore.toString().includes(this.searchText())
        );
        arr = f;
      } else {
        if (draftMode) {
          arr = [];
        } else {
          arr = p;
        }
      }
    } else {
      arr = athletes ? athletes : this.athletes;
    }

    if (this.currentPositionFilter() != null) {
      arr = arr.filter((x) => x.Position === this.currentPositionFilter());
    } else {
      if (!this.searchFilter) {
        arr = athletes ? athletes : [...this.athletes];
      }
    }

    if (this.currentSortFunction() != 'None') {
      switch (this.currentSortFunction()) {
        case 'Name':
          arr = arr.sort((a, b) => {
            if (this.currentSortType() == 'Up') {
              return a.Name.localeCompare(b.Name);
            } else {
              return b.Name.localeCompare(a.Name);
            }
          });
          break;
        case 'Number':
          arr = arr.sort((a, b) => {
            if (this.currentSortType() == 'Up') {
              return a.Jersey - b.Jersey;
            } else {
              return b.Jersey - a.Jersey;
            }
          });
          break;
        case 'School':
          arr = arr.sort((a, b) => {
            if (this.currentSortType() == 'Up') {
              return a.School.localeCompare(b.School);
            } else {
              return b.School.localeCompare(a.School);
            }
          });
          break;
        case 'Proj PPG':
          arr = arr.sort((a, b) => {
            if (this.currentSortType() == 'Up') {
              return a.PredictedScore - b.PredictedScore;
            } else {
              return b.PredictedScore - a.PredictedScore;
            }
          });
          break;
      }
    } else {
      // arr = athletes
      //   ? [...athletes]
      //   : this.playersReadonly
      //     ? [...this.playersReadonly]
      //     : [...this.athletes];
    }

    this._athleteSelection.next(arr);
  }

  private updateSortType(): void {
    switch (this.currentSortType()) {
      case 'Up':
        this.currentSortType.set('Down');
        this.updateAthletes();
        break;
      case 'Down':
        this.currentSortType.set('None');
        this.currentSortFunction.set('None');
        this.updateAthletes();
        break;
      case 'None':
        this.currentSortType.set('Up');
        this.updateAthletes();
        break;
    }
  }
}
