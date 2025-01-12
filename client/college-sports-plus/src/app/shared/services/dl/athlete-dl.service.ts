import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

import { LeagueAthleteModel } from '../../models/league-athlete.model';
import { LeaguePlayerModel } from '../../models/league-player.model';
import { LeagueModel } from '../../models/league.model';
import { GeneralService } from '../bl/general-service.service';
import { FastAPIService } from '../fastAPI/fast-api.service';
import { PlayerFAPIModel } from '../fastAPI/models/player-fapi.model';

@Injectable({ providedIn: 'root' })
export class AthleteDLService implements OnDestroy {
  players: Observable<Array<LeagueAthleteModel>>;

  private _players = new BehaviorSubject<Array<LeagueAthleteModel>>([]);

  private unsubscribe = new Subject<void>();

  constructor(
    // private schoolService: SchoolService,
    private fastApiService: FastAPIService
  ) {
    this.players = this._players.asObservable();
    // this.initializeAthletes();
    // this.loadAthletes();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  initializeAthletes(): void {
    ///////////////////////////////////////////////////////////////////// potentially able to remove this entirely!!!
    // // const players: Array<LeagueAthleteModel> = [];
    // // const johnSmith: LeagueAthleteModel = new LeagueAthleteModel();
    // // johnSmith.AthleteID = '0';
    // // johnSmith.Name = 'John Smith';
    // // johnSmith.Number = '55';
    // // johnSmith.School = this.schoolService.getSchool(
    // //   SchoolNameEnum.OhioStateUniversity
    // // );
    // // players.push(johnSmith);
    // // const geneSmith: LeagueAthleteModel = new LeagueAthleteModel();
    // // geneSmith.AthleteID = '1';
    // // geneSmith.Name = 'Gene Smith';
    // // geneSmith.Number = '1';
    // // geneSmith.School = this.schoolService.getSchool(
    // //   SchoolNameEnum.UniversityOfCincinnati
    // // );
    // // players.push(geneSmith);
    // this.fastApiService
    //   .getPlayers()
    //   .pipe(takeUntil(this.unsubscribe))
    //   .subscribe({
    //     next: (playersAPI) => {
    //       const players: Array<LeagueAthleteModel> = [];
    //       playersAPI?.forEach((a: PlayerFAPIModel) => {
    //         const p: LeagueAthleteModel = new LeagueAthleteModel();
    //         p.AltColor = a.team_alt_color;
    //         p.AthleteID = a.player_id.toString();
    //         p.Color = a.team_color;
    //         p.Height = a.player_height;
    //         p.Jersey = a.player_jersey;
    //         p.Logos = a.team_logos;
    //         p.Name = a.player_name;
    //         p.Position = a.player_position;
    //         p.School = a.player_team;
    //         p.Team = a.player_team;
    //         p.Weight = a.player_weight;
    //         p.Year = a.player_year;
    //         players.push(p);
    //       });
    //       this._players.next(players);
    //     },
    //     error: (e) => console.log(e),
    //   });
    // // this._players.next(players);
  }

  initializeLeagueAthletes(league: LeagueModel): Array<LeagueAthleteModel> {
    const leagueAthletes: Array<LeagueAthleteModel> = this.getAllAthletes();
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

  getAllAthletes(): Array<LeagueAthleteModel> {
    return this._players.value;
  }

  getTeam(leaguePlayer: LeaguePlayerModel): Array<LeagueAthleteModel> {
    const athletes: Array<LeagueAthleteModel> = [];
    leaguePlayer.DraftTeamPlayerIDs.forEach((x) => {
      this.fastApiService
        .getPlayerByID(x)
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

  getAthleteByID(id: string): Observable<PlayerFAPIModel> {
    return this.fastApiService.getPlayerByID(id);
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
}
