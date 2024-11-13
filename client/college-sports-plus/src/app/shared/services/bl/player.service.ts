import { Injectable } from '@angular/core';

import { LeaguePlayerModel } from '../../models/league-player.model';
import { AthleteService } from './athlete.service';
import { LeagueService } from './league.service';

@Injectable()
export class PlayerService {
  constructor(
    private athleteService: AthleteService,
    private leagueService: LeagueService
  ) {}

  getPlayer(id: string): LeaguePlayerModel {
    const leaguePlayerModel: LeaguePlayerModel = new LeaguePlayerModel();
    leaguePlayerModel.ID = id;
    return leaguePlayerModel;
  }
}
