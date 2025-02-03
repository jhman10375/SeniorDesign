import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  skip,
  Subject,
  take,
  takeUntil,
} from 'rxjs';

import { SportEnum } from '../../enums/sport.enum';
import { LeagueAthleteModel } from '../../models/league-athlete.model';
import { LeagueWeekModel } from '../../models/league-week.model';
import { LeagueModel } from '../../models/league.model';
import { SchoolModel } from '../../models/school.model';
import { SchoolService } from '../bl/school.service';
import { AthleteDLService } from './athlete-dl.service';
import { LeagueSeasonDLService } from './league-season-dl.service';
import { LeagueSettingsDLService } from './league-settings-dl.service';
import { LeagueDLModel } from './models/league-dl.model';
import { PlayerDLService } from './player-dl.service';

@Injectable({ providedIn: 'root' })
export class LeagueDLService implements OnDestroy {
  league: Observable<Array<LeagueModel>>;

  leagueDL: Observable<Array<LeagueDLModel>>;

  _league = new BehaviorSubject<Array<LeagueModel>>([]);

  private _leagueDL = new BehaviorSubject<Array<LeagueDLModel>>([]);

  private unsubscribe = new Subject<void>();

  constructor(
    private playerDLService: PlayerDLService,
    private leagueSettingsDLService: LeagueSettingsDLService,
    private athleteDLService: AthleteDLService,
    private leagueSeasonDLService: LeagueSeasonDLService,
    private schoolsService: SchoolService
  ) {
    this.league = this._league.asObservable();
    this.leagueDL = this._leagueDL.asObservable();

    this.leagueSeasonDLService.seasonDL
      .pipe(skip(2), takeUntil(this.unsubscribe))
      .subscribe({
        next: (season) => {
          this.schoolsService.schools.pipe(take(1)).subscribe({
            next: (schools) => {
              this.athleteDLService.players.pipe(take(1)).subscribe({
                next: (a) => {
                  this.convertLeagues(a, schools);
                },
              });
            },
          });
        },
      });

    this.initializeLeagues();
    // this.convertLeagues();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  initializeLeagues(): void {
    //uncomment to setup pre draftdate
    const draftDate: Date = new Date(); //remove this later, it is used to set up dummy draft date/times
    draftDate.setHours(23, 59);

    //uncomment to setup post draftdate
    // const draftDate: Date = new Date(); //remove this later, it is used to set up dummy draft date/time
    // draftDate.setDate(draftDate.getDate() - 1);
    // draftDate.setHours(23, 59);

    const league: LeagueDLModel = new LeagueDLModel();
    league.ID = '0';
    league.Name = "smith's league";
    league.ManagerID = '0';
    league.PlayerIDs = ['0', '1', '2'];
    league.SettingsID = '0';
    league.DraftDate = draftDate;
    league.ManagerID = '0';
    league.LeagueType = SportEnum.Football;

    this._leagueDL.next([league]);
  }

  convertLeagues(
    athletes: Array<LeagueAthleteModel>,
    schools: Array<SchoolModel>
  ): void {
    const leagueDL: Array<LeagueDLModel> = this._leagueDL.value;
    const league: Array<LeagueModel> = [];
    leagueDL.forEach((lDL) => {
      const l: LeagueModel = new LeagueModel();
      l.ID = lDL.ID;
      l.DraftDate = lDL.DraftDate;
      l.Name = lDL.Name;
      l.LeagueType = lDL.LeagueType;
      l.Settings = this.leagueSettingsDLService.getSettingsModel(
        lDL.ID,
        lDL.LeagueType
      );
      l.Players = this.playerDLService.getLeague(lDL.PlayerIDs, schools);
      const manager = l.Players.find((x) => x.ID == lDL.ManagerID);
      if (manager) {
        l.Manager = manager;
      }
      l.Season = this.leagueSeasonDLService.getSeason(
        lDL.ID,
        lDL.LeagueType,
        athletes
      );
      console.log(l.Season);
      //Will probably have an error since l is not really defined here at all
      l.Athletes = athletes;

      league.push(l);
    });

    this._league.next(league);
  }

  updateSeason(leagueType: SportEnum, week: LeagueWeekModel): void {
    this.leagueSeasonDLService.updateSeason(leagueType, week);
  }
}
