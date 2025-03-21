import { Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';

import { LeaguePlayerModel } from '../../models/league-player.model';
import { PlayerDLService } from '../dl/player-dl.service';
import { FastAPIService } from '../fastAPI/fast-api.service';
import { GeneralService } from './general-service.service';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(
    private playerDLService: PlayerDLService,
    private fastAPIService: FastAPIService
  ) {
    ////////// REMOVE AFTER FIREBASE UPDATES ARE DONE
    let player: LeaguePlayerModel = new LeaguePlayerModel();
    this.playerDLService
      .getPlayer('0')
      .pipe(
        tap((x) => (player = x)),
        switchMap((x) => {
          const obs = this.fastAPIService.getPlayersByIDs(
            x.DraftRoster.map((y) => y.Athlete.AthleteID)
          );
          return obs;
        })
      )
      .subscribe({
        next: (x) => {
          player.DraftRoster.forEach((y) => {
            const p = x.find(
              (z) => z.player_id.toString() === y.Athlete.AthleteID
            );
            if (p) {
              y.Athlete = GeneralService.FastAPILeagueAthleteModelConverter(p);
            }
          });
        },
      });

    let players = [];
    this.playerDLService
      .getPlayers(['0', '0'])
      .pipe(
        tap((x) => (players = x))
        // switchMap((x) => {
        //   x.forEach(y => {

        //   })
        //   const obs = this.fastAPIService.getPlayersByIDs(
        //     x.DraftRoster.map((y) => y.Athlete.AthleteID)
        //   );
        //   return obs;
        // })
      )
      .subscribe({
        next: (x) => {
          console.log(x);
          // player.DraftRoster.forEach((y) => {
          //   const p = x.find(
          //     (z) => z.player_id.toString() === y.Athlete.AthleteID
          //   );
          //   if (p) {
          //     y.Athlete = GeneralService.FastAPILeagueAthleteModelConverter(p);
          //   }
          // });
        },
      });
    //////////// REMOVE THE ABOVE
  }

  getPlayer(id: string): Observable<LeaguePlayerModel> {
    return this.playerDLService.getPlayer(id);
    // return this.playerDLService.getPlayer(id) ?? new LeaguePlayerModel();
  }

  addPlayer(player: LeaguePlayerModel): void {
    this.playerDLService.addPlayer(player);
  }

  updatePlayer(player: LeaguePlayerModel): void {
    this.playerDLService.updatePlayer(player);
  }
}
