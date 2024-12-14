import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, takeUntil } from 'rxjs';

import { SchoolNameEnum } from '../../enums/school-name.enum';
import { SportEnum } from '../../enums/sport.enum';
import { LeagueAthleteModel } from '../../models/league-athlete.model';
import { LeaguePlayerModel } from '../../models/league-player.model';
import { LeagueScorboardModel } from '../../models/league-scoreboard.model';
import { LeagueSearchModel } from '../../models/league-search.model';
import { LeagueModel } from '../../models/league.model';
import { SchoolModel } from '../../models/school.model';
import { LeagueDLService } from '../dl/league-dl.service';
import { AthleteService } from './athlete.service';
import { SchoolService } from './school.service';

@Injectable()
export class LeagueService implements OnDestroy {
  league: Observable<Array<LeagueModel>>;

  leagueScoreboard: Observable<Array<LeagueScorboardModel>>;

  private _league = new BehaviorSubject<Array<LeagueModel>>([]);

  private _leagueScoreboard = new BehaviorSubject<Array<LeagueScorboardModel>>(
    []
  );

  private unsubscribe = new Subject<void>();

  constructor(
    private schoolService: SchoolService,
    private leagueDLService: LeagueDLService,
    private athleteService: AthleteService
  ) {
    this.league = this.leagueDLService.league; // need to figure out if this is needed
    this.league.pipe(takeUntil(this.unsubscribe)).subscribe({
      // need to figure out if this is needed
      next: (l) => this._league.next(l),
    });
    // this.league = this._league.asObservable(); // need to figure out if this is needed
    this.leagueScoreboard = this._leagueScoreboard.asObservable();
    this.initializeLeagueScoreBoards();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  initializeLeagueScoreBoards(): void {
    const ucSchoolColors: SchoolModel = this.schoolService.getSchool(
      SchoolNameEnum.UniversityOfCincinnati
    );
    const osuSchoolColors: SchoolModel = this.schoolService.getSchool(
      SchoolNameEnum.OhioStateUniversity
    );
    const oregonSchoolColors: SchoolModel = this.schoolService.getSchool(
      SchoolNameEnum.UniversityOfOregon
    );
    this._leagueScoreboard.next([
      {
        CurrentRanking: 2,
        ID: '0',
        Leader: 'John Smith',
        Manager: 'John Smith',
        Name: "Smith's League",
        SchoolColors: ucSchoolColors,
        Sport: SportEnum.Football,
        Team: "Jordan's Allstars",
      },
      {
        CurrentRanking: 2,
        ID: '12',
        Leader: 'John Smith',
        Manager: 'John Smith',
        Name: "Smith's League 2024",
        SchoolColors: ucSchoolColors,
        Sport: SportEnum.Football,
        Team: "Jane Smith's 9ers",
      },
      {
        CurrentRanking: 1,
        ID: '1',
        Leader: 'Jeff Smith',
        Manager: 'Jessica Smith',
        Name: "Jess's League 2024",
        SchoolColors: osuSchoolColors,
        Sport: SportEnum.Football,
        Team: "Jane Smith's DreamTeam",
      },
      {
        CurrentRanking: 5,
        ID: '2',
        Leader: 'Jack Smith',
        Manager: 'Joe Smith',
        Name: "Cincy's League 2024",
        SchoolColors: oregonSchoolColors,
        Sport: SportEnum.Football,
        Team: "Jane's Boys",
      },
      {
        CurrentRanking: 2,
        ID: '3',
        Leader: 'John Smith',
        Manager: 'John Smith',
        Name: "Smith's League 2024",
        SchoolColors: oregonSchoolColors,
        Sport: SportEnum.Baseball,
        Team: "Jane Smith's 9ers",
      },
      {
        CurrentRanking: 1,
        ID: '4',
        Leader: 'Jeff Smith',
        Manager: 'Jessica Smith',
        Name: "Jess's League 2024",
        SchoolColors: osuSchoolColors,
        Sport: SportEnum.Baseball,
        Team: "Jane Smith's DreamTeam",
      },
      {
        CurrentRanking: 5,
        ID: '5',
        Leader: 'Jack Smith',
        Manager: 'Joe Smith',
        Name: "Cincy's League 2024",
        SchoolColors: ucSchoolColors,
        Sport: SportEnum.Baseball,
        Team: "Jane's Boys",
      },
      {
        CurrentRanking: 2,
        ID: '6',
        Leader: 'John Smith',
        Manager: 'John Smith',
        Name: "Smith's League 2024",
        SchoolColors: oregonSchoolColors,
        Sport: SportEnum.Basketball,
        Team: "Jane Smith's 9ers",
      },
      {
        CurrentRanking: 1,
        ID: '7',
        Leader: 'Jeff Smith',
        Manager: 'Jessica Smith',
        Name: "Jess's League 2024",
        SchoolColors: osuSchoolColors,
        Sport: SportEnum.Basketball,
        Team: "Jane Smith's DreamTeam",
      },
      {
        CurrentRanking: 5,
        ID: '8',
        Leader: 'Jack Smith',
        Manager: 'Joe Smith',
        Name: "Cincy's League 2024",
        SchoolColors: ucSchoolColors,
        Sport: SportEnum.Basketball,
        Team: "Jane's Boys",
      },
      {
        CurrentRanking: 2,
        ID: '9',
        Leader: 'John Smith',
        Manager: 'John Smith',
        Name: "Smith's League 2024",
        SchoolColors: oregonSchoolColors,
        Sport: SportEnum.Soccer,
        Team: "Jane Smith's 9ers",
      },
      {
        CurrentRanking: 1,
        ID: '10',
        Leader: 'Jeff Smith',
        Manager: 'Jessica Smith',
        Name: "Jess's League 2024",
        SchoolColors: osuSchoolColors,
        Sport: SportEnum.Soccer,
        Team: "Jane Smith's DreamTeam",
      },
      {
        CurrentRanking: 5,
        ID: '11',
        Leader: 'Jack Smith',
        Manager: 'Joe Smith',
        Name: "Cincy's League 2024",
        SchoolColors: ucSchoolColors,
        Sport: SportEnum.Soccer,
        Team: "Jane's Boys",
      },
    ]);
  }

  getLeagueTeam(
    leagueID: string,
    teamID: string
  ):
    | { player: LeaguePlayerModel; athletes: Array<LeagueAthleteModel> }
    | undefined {
    const league = this._league.value.find((x) => x.ID === leagueID);
    if (league) {
      const player = league.Players.find((x) => x.ID === teamID);
      if (player) {
        const athletes: Array<LeagueAthleteModel> =
          this.athleteService.getTeam(player);
        return { player, athletes };
      }
    }
    return undefined;
  }

  getLeague(leagueID: string): LeagueModel | undefined {
    const league = this._league.value.find((x) => x.ID === leagueID);
    return league;
  }

  getLeaguesForSearch(lt: Number): Observable<Array<LeagueSearchModel>> {
    let l: Array<LeagueModel> = [];
    this.leagueDLService.league.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (league) => (l = league),
    });

    const leagueUnfiltered = l.map((obj): LeagueSearchModel => {
      return {
        ID: obj.ID,
        Manager: obj.Manager,
        Name: obj.Name,
        DraftDate: obj.DraftDate,
        LeagueType: obj.LeagueType,
      };
    });
    const leagues = leagueUnfiltered.filter((x) => x.LeagueType === lt);
    return of(leagues);
  }
}
