import { LeagueAthleteModel } from '../../../../../../shared/models/league-athlete.model';
import { SoccerPlayerStatsModel } from '../../../../../../shared/models/stats/soccer-player-stats.model';

export class SoccerDraftPlayerModel {
  Athlete: LeagueAthleteModel;
  Stats: SoccerPlayerStatsModel;
}
