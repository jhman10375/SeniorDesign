import { Injectable } from '@angular/core';

import { LeagueAthleteModel } from '../../../../../shared/models/league-athlete.model';
import { BasketballPlayerStatsModel } from '../../../../../shared/models/stats/basketball-player-stats.model';
import { DraftPlayerStatsWSModel } from '../models/draft-player-stats-ws.model';
import { DraftPlayerWSModel } from '../models/draft-player-ws.model';
import { BasketballDraftPlayerModel } from '../models/sport-player/basketball.model';

@Injectable({ providedIn: 'root' })
export class DraftGeneralService {
  constructor() {}

  static DraftPlayerWSConverter(
    athlete: DraftPlayerWSModel
  ): LeagueAthleteModel {
    const leagueAthlete: LeagueAthleteModel = new LeagueAthleteModel();
    leagueAthlete.AltColor = athlete.alt_color;
    leagueAthlete.AthleteID = athlete.id.toString();
    leagueAthlete.Color = athlete.color;
    leagueAthlete.Height = athlete.height;
    leagueAthlete.Jersey = athlete.jersey > 0 ? athlete.jersey : 0;
    leagueAthlete.Name = athlete.name;
    leagueAthlete.Position = athlete.position;
    leagueAthlete.School = athlete.school;
    leagueAthlete.Team = athlete.team;
    leagueAthlete.PlayerID = athlete.user_id;
    leagueAthlete.Weight = athlete.weight;
    leagueAthlete.Year = athlete.year;
    // console.log(athlete);
    return leagueAthlete;
  }

  static DraftPlayerStatsWSConverter(
    athlete: DraftPlayerStatsWSModel
  ): BasketballDraftPlayerModel {
    const basketballDraftPlayerModel: BasketballDraftPlayerModel =
      new BasketballDraftPlayerModel();
    basketballDraftPlayerModel.Athlete = new LeagueAthleteModel();
    basketballDraftPlayerModel.Stats = new BasketballPlayerStatsModel();
    basketballDraftPlayerModel.Athlete.AltColor = athlete.team_alt_color;
    basketballDraftPlayerModel.Athlete.AthleteID = athlete.player_id.toString();
    basketballDraftPlayerModel.Athlete.Color = athlete.team_color;
    basketballDraftPlayerModel.Athlete.Height = athlete.player_height;
    basketballDraftPlayerModel.Athlete.Jersey =
      athlete.player_jersey > 0 ? athlete.player_jersey : 0;
    basketballDraftPlayerModel.Athlete.Name = athlete.player_name;
    basketballDraftPlayerModel.Athlete.PlayerID = athlete.user_id;
    basketballDraftPlayerModel.Athlete.Position = athlete.player_position;
    basketballDraftPlayerModel.Athlete.School = athlete.player_team;
    basketballDraftPlayerModel.Athlete.Team = athlete.player_team;
    basketballDraftPlayerModel.Athlete.Weight = athlete.player_weight;
    basketballDraftPlayerModel.Athlete.Year = athlete.player_year;
    basketballDraftPlayerModel.Stats.Assists = athlete.assists;
    basketballDraftPlayerModel.Stats.BlockedShots = athlete.blocked_shots;
    basketballDraftPlayerModel.Stats.FreeThrows = athlete.free_throws;
    basketballDraftPlayerModel.Stats.Rebounds = athlete.rebounds;
    basketballDraftPlayerModel.Stats.Steals = athlete.steals;
    basketballDraftPlayerModel.Stats.ThreePointers = athlete.three_pointers;
    basketballDraftPlayerModel.Stats.Turnovers = athlete.turnovers;
    basketballDraftPlayerModel.Stats.TwoPointers = athlete.two_pointers;

    basketballDraftPlayerModel.Athlete.PredictedScore =
      DraftGeneralService.calculateProjectedPointsPerGame(
        basketballDraftPlayerModel
      );

    return basketballDraftPlayerModel;
  }

  static calculateProjectedPointsPerGame(
    basketballDraftPlayerModel: BasketballDraftPlayerModel
  ): number {
    let score: number = 0;

    score = score + basketballDraftPlayerModel.Stats.Assists * 1.5;
    score = score + basketballDraftPlayerModel.Stats.BlockedShots * 2;
    score = score + basketballDraftPlayerModel.Stats.FreeThrows * 1;
    score = score + basketballDraftPlayerModel.Stats.Rebounds * 1.2;
    score = score + basketballDraftPlayerModel.Stats.Steals * 2;
    score = score + basketballDraftPlayerModel.Stats.ThreePointers * 3;
    score = score + basketballDraftPlayerModel.Stats.Turnovers * -1;
    score = score + basketballDraftPlayerModel.Stats.TwoPointers * 2;

    return score / 12;
  }
}
