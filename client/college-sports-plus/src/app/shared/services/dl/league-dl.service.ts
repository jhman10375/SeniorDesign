import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SportEnum } from '../../enums/sport.enum';
import { LeagueModel } from '../../models/league.model';
import { AthleteDLService } from './athlete-dl.service';
import { LeagueSettingsDLService } from './league-settings-dl.service';
import { LeagueDLModel } from './models/league-dl.model';
import { PlayerDLService } from './player-dl.service';

@Injectable({ providedIn: 'root' })
export class LeagueDLService {
  league: Observable<Array<LeagueModel>>;

  leagueDL: Observable<Array<LeagueDLModel>>;

  private _leagueDL = new BehaviorSubject<Array<LeagueDLModel>>([]);

  _league = new BehaviorSubject<Array<LeagueModel>>([]);

  constructor(
    private playerDLService: PlayerDLService,
    private leagueSettingsDLService: LeagueSettingsDLService,
    private athleteDLService: AthleteDLService
  ) {
    this.league = this._league.asObservable();
    this.leagueDL = this._leagueDL.asObservable();

    this.initializeLeagues();
    this.convertLeagues();
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

  convertLeagues(): void {
    const leagueDL: Array<LeagueDLModel> = this._leagueDL.value;
    const league: Array<LeagueModel> = [];
    leagueDL.forEach((lDL) => {
      const l: LeagueModel = new LeagueModel();
      l.ID = lDL.ID;
      l.DraftDate = lDL.DraftDate;
      l.Name = lDL.Name;
      l.LeagueType = lDL.LeagueType;
      const manager = this.playerDLService.getPlayer(lDL.ManagerID);
      if (manager) {
        l.Manager = manager;
      }
      l.Settings = this.leagueSettingsDLService.getSettingsModel(lDL.ID);
      l.Players = this.playerDLService.getLeague(lDL.PlayerIDs);
      //Will probably have an error since l is not really defined here at all
      l.Athletes = this.athleteDLService.initializeLeagueAthletes(l);

      league.push(l);
    });

    this._league.next(league);
  }
}
