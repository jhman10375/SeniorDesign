import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { LeagueAthleteModel } from '../../models/league-athlete.model';
import { LeaguePlayerModel } from '../../models/league-player.model';
import { AthleteDLService } from '../dl/athlete-dl.service';

@Injectable()
export class AthleteService {
  players: Observable<Array<LeagueAthleteModel>>;

  private _players = new BehaviorSubject<Array<LeagueAthleteModel>>([]);

  constructor(private athleteDLService: AthleteDLService) {
    this.players = this._players.asObservable();
    this._players.next(this.athleteDLService.getAllAthletes());

    // this.loadPlayers();
  }

  getTeam(leaguePlayer: LeaguePlayerModel): Array<LeagueAthleteModel> {
    const athletes: Array<LeagueAthleteModel> = [];
    leaguePlayer.TeamPlayerIDs.forEach((x) => {
      const player = this._players.value.find((p) => p.AthleteID === x);
      if (player) {
        athletes.push(player);
      }
    });
    return athletes;
  }

  getPlayer(id: string): LeagueAthleteModel {
    let leaguePlayerModel: LeagueAthleteModel = new LeagueAthleteModel();
    this._players.value.forEach((player) => {
      if (player.AthleteID === id) {
        leaguePlayerModel = player;
      }
    });
    return leaguePlayerModel;
  }

  getPlayers(ids: Array<string>): Array<LeagueAthleteModel> {
    const leaguePlayerModels: Array<LeagueAthleteModel> =
      new Array<LeagueAthleteModel>();
    ids.forEach((id) => {
      this._players.value.forEach((player) => {
        if (player.AthleteID === id) {
          leaguePlayerModels.push(player);
        }
      });
    });
    return leaguePlayerModels;
  }

  getUniversityTeam(schoolName: string): Array<LeagueAthleteModel> {
    const team: Array<LeagueAthleteModel> = new Array<LeagueAthleteModel>();
    this._players.value.forEach((player) => {
      if (player.School.Name === schoolName) {
        team.push(player);
      }
    });
    return team;
  }
}
