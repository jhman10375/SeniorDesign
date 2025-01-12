import { Injectable } from '@angular/core';

import { LeaguePlayerModel } from '../../models/league-player.model';
import { PlayerDLService } from '../dl/player-dl.service';
import { SchoolService } from './school.service';

@Injectable()
export class PlayerService extends PlayerDLService {
  constructor(schoolService: SchoolService) {
    super(schoolService);
  }

  override getPlayer(id: string): LeaguePlayerModel {
    return super.getPlayer(id) ?? new LeaguePlayerModel();
  }
}
