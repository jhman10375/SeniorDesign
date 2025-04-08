import { Injectable } from '@angular/core';

import { LeagueAthleteModel } from '../../../../../shared/models/league-athlete.model';
import { BaseballPlayerStatsModel } from '../../../../../shared/models/stats/baseball-player-stats.model';
import { DraftPlayerStatsWSModel } from '../models/draft-player-stats-ws.model';
import { DraftPlayerWSModel } from '../models/draft-player-ws.model';
import { BaseballDraftPlayerModel } from '../models/sport-player/baseball.model';

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
  ): BaseballDraftPlayerModel {
    const baseballDraftPlayerModel: BaseballDraftPlayerModel =
      new BaseballDraftPlayerModel();
    baseballDraftPlayerModel.Athlete = new LeagueAthleteModel();
    baseballDraftPlayerModel.Stats = new BaseballPlayerStatsModel();
    baseballDraftPlayerModel.Athlete.AltColor = athlete.team_alt_color;
    baseballDraftPlayerModel.Athlete.AthleteID = athlete.player_id.toString();
    baseballDraftPlayerModel.Athlete.Color = athlete.team_color;
    baseballDraftPlayerModel.Athlete.Height = athlete.player_height;
    baseballDraftPlayerModel.Athlete.Jersey =
      athlete.player_jersey > 0 ? athlete.player_jersey : 0;
    baseballDraftPlayerModel.Athlete.Name = athlete.player_name;
    baseballDraftPlayerModel.Athlete.PlayerID = athlete.user_id;
    baseballDraftPlayerModel.Athlete.Position = athlete.player_position;
    baseballDraftPlayerModel.Athlete.School = athlete.player_team;
    baseballDraftPlayerModel.Athlete.Team = athlete.player_team;
    baseballDraftPlayerModel.Athlete.Year = athlete.player_year;
    baseballDraftPlayerModel.Stats.CaughtStealing = athlete.caught_stealing;
    baseballDraftPlayerModel.Stats.Doubles = athlete.doubles;
    baseballDraftPlayerModel.Stats.EarnedRunsAllowed =
      athlete.earned_runs_allowed;
    baseballDraftPlayerModel.Stats.HitsByPitch = athlete.hits_by_pitch;
    baseballDraftPlayerModel.Stats.Homers = athlete.homers;
    baseballDraftPlayerModel.Stats.Innings = athlete.innings;
    baseballDraftPlayerModel.Stats.Runs = athlete.runs;
    baseballDraftPlayerModel.Stats.RunsBattedIn = athlete.runs_batted_in;
    baseballDraftPlayerModel.Stats.Saves = athlete.saves;
    baseballDraftPlayerModel.Stats.Singles = athlete.singles;
    baseballDraftPlayerModel.Stats.StolenBases = athlete.stolen_bases;
    baseballDraftPlayerModel.Stats.Triples = athlete.triples;
    baseballDraftPlayerModel.Stats.Walks = athlete.walks;
    baseballDraftPlayerModel.Stats.Win = athlete.win;

    baseballDraftPlayerModel.Athlete.PredictedScore =
      DraftGeneralService.calculateProjectedPointsPerGame(
        baseballDraftPlayerModel
      );

    return baseballDraftPlayerModel;
  }

  static calculateProjectedPointsPerGame(
    baseballDraftPlayerModel: BaseballDraftPlayerModel
  ): number {
    let score: number = 0;

    score = score + baseballDraftPlayerModel.Stats.CaughtStealing * -1;
    score = score + baseballDraftPlayerModel.Stats.Doubles * 2;
    score = score + baseballDraftPlayerModel.Stats.EarnedRunsAllowed * -1;
    score = score + baseballDraftPlayerModel.Stats.HitsByPitch * 1;
    score = score + baseballDraftPlayerModel.Stats.Homers * 4;
    score = score + baseballDraftPlayerModel.Stats.Innings * 1;
    score = score + baseballDraftPlayerModel.Stats.Runs * 1;
    score = score + baseballDraftPlayerModel.Stats.RunsBattedIn * 1;
    score = score + baseballDraftPlayerModel.Stats.Saves * 2;
    score = score + baseballDraftPlayerModel.Stats.Singles * 1;
    score = score + baseballDraftPlayerModel.Stats.StolenBases * 2;
    score = score + baseballDraftPlayerModel.Stats.Triples * 3;
    score = score + baseballDraftPlayerModel.Stats.Walks * 1;
    return score / 12;
  }
}
