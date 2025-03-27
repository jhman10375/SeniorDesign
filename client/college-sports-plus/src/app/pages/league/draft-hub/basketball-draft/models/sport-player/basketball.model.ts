import { LeagueAthleteModel } from '../../../../../../shared/models/league-athlete.model';
import { BasketballPlayerStatsModel } from '../../../../../../shared/models/stats/basketball-player-stats.model';

export class BasketballDraftPlayerModel {
  Athlete: LeagueAthleteModel;
  Stats: BasketballPlayerStatsModel;
}
