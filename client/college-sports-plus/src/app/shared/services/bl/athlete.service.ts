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
  constructor(protected fastAPIService: FastAPIService) {
    super(fastAPIService);
  }

  override getTeam(
    leaguePlayer: LeaguePlayerModel,
    leagueType: SportEnum
  ): Array<LeagueAthleteModel> {
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
}
