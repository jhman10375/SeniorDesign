import { Injectable } from '@angular/core';

import { LeagueAthleteModel } from '../../../../../shared/models/league-athlete.model';
import { FootballPlayerStatsModel } from '../../../../../shared/models/stats/football-player-stats.model';
import { DraftPlayerStatsWSModel } from '../models/draft-player-stats-ws.model';
import { DraftPlayerWSModel } from '../models/draft-player-ws.model';
import { FootballDraftPlayerModel } from '../models/sport-player/football.model';

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
  ): FootballDraftPlayerModel {
    const footballDraftPlayerModel: FootballDraftPlayerModel =
      new FootballDraftPlayerModel();
    footballDraftPlayerModel.Athlete = new LeagueAthleteModel();
    footballDraftPlayerModel.Stats = new FootballPlayerStatsModel();
    footballDraftPlayerModel.Athlete.AltColor = athlete.team_alt_color;
    footballDraftPlayerModel.Athlete.AthleteID = athlete.player_id.toString();
    footballDraftPlayerModel.Athlete.Color = athlete.team_color;
    footballDraftPlayerModel.Athlete.Height = athlete.player_height;
    footballDraftPlayerModel.Athlete.Jersey =
      athlete.player_jersey > 0 ? athlete.player_jersey : 0;
    footballDraftPlayerModel.Athlete.Name = athlete.player_name;
    footballDraftPlayerModel.Athlete.PlayerID = athlete.user_id;
    footballDraftPlayerModel.Athlete.Position = athlete.player_position;
    footballDraftPlayerModel.Athlete.School = athlete.player_team;
    footballDraftPlayerModel.Athlete.Team = athlete.player_team;
    footballDraftPlayerModel.Athlete.Weight = athlete.player_weight;
    footballDraftPlayerModel.Athlete.Year = athlete.player_year;
    footballDraftPlayerModel.Stats.ExtraPoints = athlete.extra_points;
    footballDraftPlayerModel.Stats.ExtraPointsMissed =
      athlete.extra_points_missed;
    footballDraftPlayerModel.Stats.FieldGoals = athlete.field_goals;
    footballDraftPlayerModel.Stats.FieldGoalsMissed =
      athlete.field_goals_missed;
    footballDraftPlayerModel.Stats.FumblesLost = athlete.fumbles_lost;
    footballDraftPlayerModel.Stats.Interceptions = athlete.interceptions;
    footballDraftPlayerModel.Stats.PassTD = athlete.pass_TD;
    footballDraftPlayerModel.Stats.PassYds = athlete.pass_yds;
    footballDraftPlayerModel.Stats.ReceptionTD = athlete.reception_TD;
    footballDraftPlayerModel.Stats.ReceptionYds = athlete.reception_yds;
    footballDraftPlayerModel.Stats.Receptions = athlete.receptions;
    footballDraftPlayerModel.Stats.RushTD = athlete.rush_TD;
    footballDraftPlayerModel.Stats.RushYds = athlete.rush_yds;

    footballDraftPlayerModel.Athlete.PredictedScore =
      DraftGeneralService.calculateProjectedPointsPerGame(
        footballDraftPlayerModel
      );

    return footballDraftPlayerModel;
  }

  static calculateProjectedPointsPerGame(
    footballDraftPlayerModel: FootballDraftPlayerModel
  ): number {
    let score: number = 0;

    score = score + footballDraftPlayerModel.Stats.ExtraPoints * 1;
    score = score + footballDraftPlayerModel.Stats.ExtraPointsMissed * -1;
    score = score + footballDraftPlayerModel.Stats.FieldGoals * 3;
    score = score + footballDraftPlayerModel.Stats.FieldGoalsMissed * -1;
    score = score + footballDraftPlayerModel.Stats.FumblesLost * -2;
    score = score + footballDraftPlayerModel.Stats.Interceptions * -2;
    score = score + footballDraftPlayerModel.Stats.PassTD * 6;
    score = score + footballDraftPlayerModel.Stats.PassYds * 0.4;
    score = score + footballDraftPlayerModel.Stats.ReceptionTD * 6;
    score = score + footballDraftPlayerModel.Stats.ReceptionYds * 0.1;
    score = score + footballDraftPlayerModel.Stats.Receptions * 1;
    score = score + footballDraftPlayerModel.Stats.RushTD * 6;
    score = score + footballDraftPlayerModel.Stats.RushYds * 0.1;

    return score / 12;
  }
}
