import { LeagueAthleteModel } from '../../../../../../shared/models/league-athlete.model';
import { BaseballPlayerStatsModel } from '../../../../../../shared/models/stats/baseball-player-stats.model';

export class BaseballDraftPlayerModel {
  Athlete: LeagueAthleteModel;
  Stats: BaseballPlayerStatsModel;
}
