import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SportEnum } from '../enums/sport.enum';
import { LeagueScorboardModel } from '../models/league-scoreboard.model';
import { LeagueModel } from '../models/league.model';

@Injectable()
export class LeagueService {
  league: Observable<Array<LeagueModel>>;

  leagueScoreboard: Observable<Array<LeagueScorboardModel>>;

  private _league = new BehaviorSubject<Array<LeagueModel>>([]);

  private _leagueScoreboard = new BehaviorSubject<Array<LeagueScorboardModel>>(
    []
  );

  constructor() {
    this.league = this._league.asObservable();
    this.leagueScoreboard = this._leagueScoreboard.asObservable();
    this.initialize();
  }

  initialize(): void {
    this._leagueScoreboard.next([
      {
        CurrentRanking: 2,
        ID: '0',
        Leader: 'John Smith',
        Manager: 'John Smith',
        Name: "Smith's League 2024",
        Sport: SportEnum.Football,
        Team: "Jane Smith's 9ers",
      },
      {
        CurrentRanking: 1,
        ID: '1',
        Leader: 'Jeff Smith',
        Manager: 'Jessica Smith',
        Name: "Jess's League 2024",
        Sport: SportEnum.Football,
        Team: "Jane Smith's DreamTeam",
      },
      {
        CurrentRanking: 5,
        ID: '2',
        Leader: 'Jack Smith',
        Manager: 'Joe Smith',
        Name: "Cincy's League 2024",
        Sport: SportEnum.Football,
        Team: "Jane's Boys",
      },
      {
        CurrentRanking: 2,
        ID: '3',
        Leader: 'John Smith',
        Manager: 'John Smith',
        Name: "Smith's League 2024",
        Sport: SportEnum.Baseball,
        Team: "Jane Smith's 9ers",
      },
      {
        CurrentRanking: 1,
        ID: '4',
        Leader: 'Jeff Smith',
        Manager: 'Jessica Smith',
        Name: "Jess's League 2024",
        Sport: SportEnum.Baseball,
        Team: "Jane Smith's DreamTeam",
      },
      {
        CurrentRanking: 5,
        ID: '5',
        Leader: 'Jack Smith',
        Manager: 'Joe Smith',
        Name: "Cincy's League 2024",
        Sport: SportEnum.Baseball,
        Team: "Jane's Boys",
      },
      {
        CurrentRanking: 2,
        ID: '6',
        Leader: 'John Smith',
        Manager: 'John Smith',
        Name: "Smith's League 2024",
        Sport: SportEnum.Basketball,
        Team: "Jane Smith's 9ers",
      },
      {
        CurrentRanking: 1,
        ID: '7',
        Leader: 'Jeff Smith',
        Manager: 'Jessica Smith',
        Name: "Jess's League 2024",
        Sport: SportEnum.Basketball,
        Team: "Jane Smith's DreamTeam",
      },
      {
        CurrentRanking: 5,
        ID: '8',
        Leader: 'Jack Smith',
        Manager: 'Joe Smith',
        Name: "Cincy's League 2024",
        Sport: SportEnum.Basketball,
        Team: "Jane's Boys",
      },
      {
        CurrentRanking: 2,
        ID: '9',
        Leader: 'John Smith',
        Manager: 'John Smith',
        Name: "Smith's League 2024",
        Sport: SportEnum.Soccer,
        Team: "Jane Smith's 9ers",
      },
      {
        CurrentRanking: 1,
        ID: '10',
        Leader: 'Jeff Smith',
        Manager: 'Jessica Smith',
        Name: "Jess's League 2024",
        Sport: SportEnum.Soccer,
        Team: "Jane Smith's DreamTeam",
      },
      {
        CurrentRanking: 5,
        ID: '11',
        Leader: 'Jack Smith',
        Manager: 'Joe Smith',
        Name: "Cincy's League 2024",
        Sport: SportEnum.Soccer,
        Team: "Jane's Boys",
      },
    ]);
  }
}
