import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LeaguePlayerModel } from '../../models/league-player.model';
import { PlayerDLService } from '../dl/player-dl.service';
import { FastAPIService } from '../fastAPI/fast-api.service';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(
    private playerDLService: PlayerDLService,
    private fastAPIService: FastAPIService
  ) {}

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
