import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SportEnum } from '../../enums/sport.enum';
import { LeagueAthleteModel } from '../../models/league-athlete.model';
import { LeaguePlayerModel } from '../../models/league-player.model';
import { BaseballPlayerStatsModel } from '../../models/stats/baseball-player-stats.model';
import { BasketballPlayerStatsModel } from '../../models/stats/basketball-player-stats.model';
import { FootballPlayerStatsModel } from '../../models/stats/football-player-stats.model';
import { SoccerPlayerStatsModel } from '../../models/stats/soccer-player-stats.model';
import { AthleteDLService } from '../dl/athlete-dl.service';
import { FastAPIService } from '../fastAPI/fast-api.service';
import { PlayerFAPIModel } from '../fastAPI/models/player-fapi.model';

@Injectable({ providedIn: 'root' })
export class AthleteService extends AthleteDLService {
  // players: Observable<Array<LeagueAthleteModel>>;

  // private _players = new BehaviorSubject<Array<LeagueAthleteModel>>([]);

  constructor(protected fastAPIService: FastAPIService) {
    super(fastAPIService);
    // this.players = this._players.asObservable();
    // this._players.next(this.getAllAthletes());

    // this.loadPlayers();
  }

  override getTeam(
    leaguePlayer: LeaguePlayerModel,
    leagueType: SportEnum
  ): Array<LeagueAthleteModel> {
    // const athletes: Array<LeagueAthleteModel> = [];
    // leaguePlayer.TeamPlayerIDs.forEach((x) => {
    //   const player = this._players.value.find((p) => p.AthleteID === x);
    //   if (player) {
    //     athletes.push(player);
    //   }
    // });
    // return athletes;

    return super.getTeam(leaguePlayer, leagueType);
  }

  override getAthleteByID(
    id: string,
    leagueType: SportEnum
  ): Observable<PlayerFAPIModel | undefined> {
    return super.getAthleteByID(id, leagueType);
  }

  override getBaseballAthleteStatsByID(
    playerID: string,
    season?: number
  ): Observable<BaseballPlayerStatsModel> {
    return super.getBaseballAthleteStatsByID(playerID);
  }

  override getBasketballAthleteStatsByID(
    playerID: string,
    season?: number
  ): Observable<BasketballPlayerStatsModel> {
    return super.getBasketballAthleteStatsByID(playerID);
  }

  override getFootballAthleteStatsByID(
    playerID: string,
    season?: number
  ): Observable<FootballPlayerStatsModel> {
    return super.getFootballAthleteStatsByID(playerID);
  }

  override getSoccerAthleteStatsByID(
    playerID: string,
    season?: number
  ): Observable<SoccerPlayerStatsModel> {
    return super.getSoccerAthleteStatsByID(playerID);
  }

  // getPlayer(id: string): LeagueAthleteModel {
  //   let leaguePlayerModel: LeagueAthleteModel = new LeagueAthleteModel();
  //   this._players.value.forEach((player) => {
  //     if (player.AthleteID === id) {
  //       leaguePlayerModel = player;
  //     }
  //   });
  //   return leaguePlayerModel;
  // }

  // getPlayers(ids: Array<string>): Array<LeagueAthleteModel> {
  // const leaguePlayerModels: Array<LeagueAthleteModel> =
  //   new Array<LeagueAthleteModel>();
  // ids.forEach((id) => {
  //   this._players.value.forEach((player) => {
  //     if (player.AthleteID === id) {
  //       leaguePlayerModels.push(player);
  //     }
  //   });
  // });
  // return leaguePlayerModels;
  // }

  // getUniversityTeam(schoolName: string): Array<LeagueAthleteModel> {
  //   const team: Array<LeagueAthleteModel> = new Array<LeagueAthleteModel>();
  //   this._players.value.forEach((player) => {
  //     if (player.School === schoolName) {
  //       team.push(player);
  //     }
  //   });
  //   return team;
  // }
}
