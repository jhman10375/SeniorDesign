import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';

import { SportEnum } from '../../enums/sport.enum';
import { LeagueAthleteModel } from '../../models/league-athlete.model';
import { LeaguePlayerModel } from '../../models/league-player.model';
import { LeagueModel } from '../../models/league.model';
import { BaseballPlayerStatsModel } from '../../models/stats/baseball-player-stats.model';
import { BasketballPlayerStatsModel } from '../../models/stats/basketball-player-stats.model';
import { FootballPlayerStatsModel } from '../../models/stats/football-player-stats.model';
import { SoccerPlayerStatsModel } from '../../models/stats/soccer-player-stats.model';
import { GeneralService } from '../bl/general-service.service';
import { FastAPIService } from '../fastAPI/fast-api.service';
import { PlayerFAPIModel } from '../fastAPI/models/player-fapi.model';

@Injectable({ providedIn: 'root' })
// @Injectable()
export class AthleteDLService implements OnDestroy {
  players: Observable<Array<LeagueAthleteModel>>;

  basketballPlayers: Observable<Array<LeagueAthleteModel>>;

  baseballPlayers: Observable<Array<LeagueAthleteModel>>;

  soccerPlayers: Observable<Array<LeagueAthleteModel>>;

  private _players = new BehaviorSubject<Array<LeagueAthleteModel>>([]);

  private _basketballPlayers = new BehaviorSubject<Array<LeagueAthleteModel>>(
    []
  );

  private _baseballPlayers = new BehaviorSubject<Array<LeagueAthleteModel>>([]);

  private _soccerPlayers = new BehaviorSubject<Array<LeagueAthleteModel>>([]);

  private unsubscribe = new Subject<void>();

  constructor(
    // private schoolService: SchoolService,
    private fastApiService: FastAPIService
  ) {
    this.players = this._players.asObservable();
    this.basketballPlayers = this._basketballPlayers.asObservable();
    this.baseballPlayers = this._baseballPlayers.asObservable();
    this.soccerPlayers = this._soccerPlayers.asObservable();
    // this.initializeAthletes();
    // this.loadAthletes();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  initializeAthletes(): void {}

  initializeLeagueAthletes(league: LeagueModel): Array<LeagueAthleteModel> {
    const leagueAthletes: Array<LeagueAthleteModel> = this.getAllAthletes(
      league.LeagueType
    );
    league.Players.forEach((x) => {
      x.DraftTeamPlayerIDs.forEach((y) => {
        const athlete = leagueAthletes.find((z) => z.AthleteID === y);
        if (athlete) {
          athlete.PlayerID = x.ID;
        }
      });
    });
    return leagueAthletes;
  }

  getAllAthletes(leagueType: SportEnum): Array<LeagueAthleteModel> {
    switch (leagueType) {
      case SportEnum.Baseball:
        return this._baseballPlayers.value;
      case SportEnum.Basketball:
        return this._basketballPlayers.value;
      case SportEnum.Football:
        return this._players.value;
      case SportEnum.Soccer:
        return this._soccerPlayers.value;
      case SportEnum.None:
      default:
        return [];
    }
  }

  getTeam(
    leaguePlayer: LeaguePlayerModel,
    leagueType: SportEnum
  ): Array<LeagueAthleteModel> {
    const athletes: Array<LeagueAthleteModel> = [];
    leaguePlayer.DraftTeamPlayerIDs.forEach((x) => {
      this.fastApiService
        .getFootballPlayerByID(x)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          next: (a) => {
            const p: LeagueAthleteModel =
              GeneralService.FastAPILeagueAthleteModelConverter(a);
            athletes.push(p);
            return athletes;
          },
          error: (e) => console.error(e),
        });
      // const player = leagueAthletes.find((p) => p.AthleteID === x);
      // if (player) {
      //   athletes.push(player);
      // }
    });
    return athletes;
  }

  getAthleteByID(
    playerID: string,
    leagueType: SportEnum
  ): Observable<PlayerFAPIModel | undefined> {
    return this.fastApiService.getPlayerByID(playerID, leagueType);
  }

  getAthletesByIDs(
    ids: Array<string>,
    athletesToSearch: Array<LeagueAthleteModel>
  ): Array<LeagueAthleteModel> {
    const athletes: Array<LeagueAthleteModel> = [];
    ids.forEach((id) => {
      const athlete = athletesToSearch.find((x) => x.AthleteID === id);
      if (athlete) {
        athletes.push(athlete);
      }
    });

    return athletes;
  }

  getFootballAthleteStatsByID(
    playerID: string,
    season: number = 2024
  ): Observable<FootballPlayerStatsModel> {
    return this.fastApiService.getFootballPlayerStatsByID(playerID, season);
  }

  getBaseballAthleteStatsByID(
    playerID: string,
    season: number = 2024
  ): Observable<BaseballPlayerStatsModel> {
    return this.fastApiService.getBaseballPlayerStatsByID(playerID, season);
  }

  getBasketballAthleteStatsByID(
    playerID: string,
    season: number = 2024
  ): Observable<BasketballPlayerStatsModel> {
    return this.fastApiService.getBasketballPlayerStatsByID(playerID, season);
  }

  getSoccerAthleteStatsByID(
    playerID: string,
    season: number = 2024
  ): Observable<SoccerPlayerStatsModel> {
    return this.fastApiService.getSoccerPlayerStatsByID(playerID, season);
  }

  loadAthletes(): void {
    this.fastApiService
      .getPlayers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (playersAPI) => {
          const players: Array<LeagueAthleteModel> = [];
          playersAPI?.forEach((a: PlayerFAPIModel) => {
            const p: LeagueAthleteModel =
              GeneralService.FastAPILeagueAthleteModelConverter(a);
            players.push(p);
          });
          this._players.next(players);
        },
        error: (e) => console.error(e),
      });
  }

  getAthletesAPI(): Observable<Array<LeagueAthleteModel>> {
    return this.fastApiService.getPlayers().pipe(
      map((playersAPI) => {
        const players: Array<LeagueAthleteModel> = [];
        playersAPI?.forEach((a: PlayerFAPIModel) => {
          const p: LeagueAthleteModel =
            GeneralService.FastAPILeagueAthleteModelConverter(a);
          players.push(p);
        });
        return players;
      }),
      takeUntil(this.unsubscribe)
    );
  }

  loadBasketballAthletes(): void {
    this.fastApiService
      .getBasketballPlayers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (playersAPI) => {
          const players: Array<LeagueAthleteModel> = [];
          playersAPI?.forEach((a: PlayerFAPIModel) => {
            const p: LeagueAthleteModel =
              GeneralService.FastAPILeagueAthleteModelConverter(a);
            players.push(p);
          });
          this._basketballPlayers.next(players);
        },
        error: (e) => console.error(e),
      });
  }

  loadBaseballAthletes(): void {
    this.fastApiService
      .getBaseballPlayers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (playersAPI) => {
          const players: Array<LeagueAthleteModel> = [];
          playersAPI?.forEach((a: PlayerFAPIModel) => {
            const p: LeagueAthleteModel =
              GeneralService.FastAPILeagueAthleteModelConverter(a);
            players.push(p);
          });
          this._baseballPlayers.next(players);
        },
        error: (e) => console.error(e),
      });
  }

  loadSoccerAthletes(): void {
    this.fastApiService
      .getSoccerPlayers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (playersAPI) => {
          const players: Array<LeagueAthleteModel> = [];
          playersAPI?.forEach((a: PlayerFAPIModel) => {
            const p: LeagueAthleteModel =
              GeneralService.FastAPILeagueAthleteModelConverter(a);
            players.push(p);
          });
          this._soccerPlayers.next(players);
        },
        error: (e) => console.error(e),
      });
  }

  getBaseballPlayers(): Array<LeagueAthleteModel> {
    return this._baseballPlayers.value;
  }

  getBasketballPlayers(): Array<LeagueAthleteModel> {
    return this._basketballPlayers.value;
  }

  getFootballPlayers(): Array<LeagueAthleteModel> {
    return this._players.value;
  }

  getSoccerPlayers(): Array<LeagueAthleteModel> {
    return this._soccerPlayers.value;
  }
}
