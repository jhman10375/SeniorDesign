import { Injectable } from '@angular/core';

import { LeagueAthleteModel } from '../../../../shared/models/league-athlete.model';
import { DraftPlayerWSModel } from '../models/draft-player-ws.model';

@Injectable({ providedIn: 'root' })
export class DraftGeneralService {
  constructor() {}

  static DraftPlayerWSConverter(
    athlete: DraftPlayerWSModel
  ): LeagueAthleteModel {
    const leagueAthlete: LeagueAthleteModel = new LeagueAthleteModel();
    leagueAthlete.AltColor = athlete.alt_color;
    leagueAthlete.AthleteID = athlete.id;
    leagueAthlete.Color = athlete.color;
    leagueAthlete.Height = athlete.height;
    leagueAthlete.Jersey = athlete.jersey;
    leagueAthlete.Logos = athlete.logos;
    leagueAthlete.Name = athlete.name;
    leagueAthlete.Position = athlete.position;
    leagueAthlete.School = athlete.school;
    leagueAthlete.Team = athlete.team;
    leagueAthlete.PlayerID = athlete.user_id;
    leagueAthlete.Weight = athlete.weight;
    leagueAthlete.Year = athlete.year;
    return leagueAthlete;
  }
}
