import { Injectable } from '@angular/core';

import { LeagueAthleteModel } from '../../../../../shared/models/league-athlete.model';
import { SoccerPlayerStatsModel } from '../../../../../shared/models/stats/soccer-player-stats.model';
import { DraftPlayerStatsWSModel } from '../models/draft-player-stats-ws.model';
import { DraftPlayerWSModel } from '../models/draft-player-ws.model';
import { SoccerDraftPlayerModel } from '../models/sport-player/soccer.model';

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
  ): SoccerDraftPlayerModel {
    const soccerDraftPlayerModel: SoccerDraftPlayerModel =
      new SoccerDraftPlayerModel();
    soccerDraftPlayerModel.Athlete = new LeagueAthleteModel();
    soccerDraftPlayerModel.Stats = new SoccerPlayerStatsModel();
    soccerDraftPlayerModel.Athlete.AltColor = athlete.team_alt_color;
    soccerDraftPlayerModel.Athlete.AthleteID = athlete.player_id.toString();
    soccerDraftPlayerModel.Athlete.Color = athlete.team_color;
    soccerDraftPlayerModel.Athlete.Height = athlete.player_height;
    soccerDraftPlayerModel.Athlete.Jersey =
      athlete.player_jersey > 0 ? athlete.player_jersey : 0;
    soccerDraftPlayerModel.Athlete.Name = athlete.player_name;
    soccerDraftPlayerModel.Athlete.PlayerID = athlete.user_id;
    soccerDraftPlayerModel.Athlete.Position = athlete.player_position;
    soccerDraftPlayerModel.Athlete.School = athlete.player_team;
    soccerDraftPlayerModel.Athlete.Team = athlete.player_team;
    soccerDraftPlayerModel.Athlete.Year = athlete.player_year;
    soccerDraftPlayerModel.Stats.Assists = athlete.assists;
    soccerDraftPlayerModel.Stats.CleanSheet = athlete.clean_sheet;
    soccerDraftPlayerModel.Stats.Fouls = athlete.fouls;
    soccerDraftPlayerModel.Stats.Goals = athlete.goals;
    soccerDraftPlayerModel.Stats.GoalsAllowed = athlete.goals_allowed;
    soccerDraftPlayerModel.Stats.RedCards = athlete.red_cards;
    soccerDraftPlayerModel.Stats.Saves = athlete.saves;
    soccerDraftPlayerModel.Stats.ShotsOffGoal = athlete.shots_off_goal;
    soccerDraftPlayerModel.Stats.ShotsOnGoal = athlete.shots_on_goal;
    soccerDraftPlayerModel.Stats.YellowCards = athlete.yellow_cards;

    soccerDraftPlayerModel.Athlete.PredictedScore =
      DraftGeneralService.calculateProjectedPointsPerGame(
        soccerDraftPlayerModel
      );

    return soccerDraftPlayerModel;
  }

  static calculateProjectedPointsPerGame(
    soccerDraftPlayerModel: SoccerDraftPlayerModel
  ): number {
    let score: number = 0;

    score = score + soccerDraftPlayerModel.Stats.Assists * 5;
    score = score + soccerDraftPlayerModel.Stats.CleanSheet * 10;
    score = score + soccerDraftPlayerModel.Stats.Fouls * -1;
    score = score + soccerDraftPlayerModel.Stats.Goals * 10;
    score = score + soccerDraftPlayerModel.Stats.GoalsAllowed * -1;
    score = score + soccerDraftPlayerModel.Stats.RedCards * -5;
    score = score + soccerDraftPlayerModel.Stats.Saves * 3;
    score = score + soccerDraftPlayerModel.Stats.ShotsOffGoal * 1;
    score = score + soccerDraftPlayerModel.Stats.ShotsOnGoal * 2;
    score = score + soccerDraftPlayerModel.Stats.YellowCards * -1;

    return score / 12;
  }
}
