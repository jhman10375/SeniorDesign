import { LeagueAthleteModel } from '../../../../../shared/models/league-athlete.model';
import { FootballPlayerStatsModel } from '../../../../../shared/models/stats/football-player-stats.model';

export class FootballDraftPlayerModel {
  Athlete: LeagueAthleteModel;
  Stats: FootballPlayerStatsModel;
}
