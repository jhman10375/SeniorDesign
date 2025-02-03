import { Injectable } from '@angular/core';

import { LeaguePlayerModel } from '../../models/league-player.model';
import { PlayerDLService } from '../dl/player-dl.service';
import { FastAPIService } from '../fastAPI/fast-api.service';
import { SchoolService } from './school.service';

@Injectable({ providedIn: 'root' })
export class PlayerService extends PlayerDLService {
  constructor(schoolService: SchoolService, fastAPIService: FastAPIService) {
    super(schoolService, fastAPIService);
  }

  override getPlayer(id: string): LeaguePlayerModel {
    return super.getPlayer(id) ?? new LeaguePlayerModel();
  }
}
