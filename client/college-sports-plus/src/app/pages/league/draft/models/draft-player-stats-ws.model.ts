import { BaseballPositionEnum } from '../../../../shared/enums/position/baseball-position.enum';
import { BasketballPositionEnum } from '../../../../shared/enums/position/basketball-position.enum';
import { FootballPositionEnum } from '../../../../shared/enums/position/football-position.enum';
import { SoccerRosterModel } from '../../../../shared/models/roster/soccer-roster.model';

export class DraftPlayerStatsWSModel {
  extra_points: number;
  extra_points_missed: number;
  field_goals: number;
  field_goals_missed: number;
  fumbles_lost: number;
  interceptions: number;
  pass_TD: number;
  pass_yds: number;
  player_height: number;
  player_id: number;
  player_jersey: number;
  player_name: string;
  player_position:
    | FootballPositionEnum
    | BaseballPositionEnum
    | BasketballPositionEnum
    | SoccerRosterModel;
  player_team: string;
  player_weight: number;
  player_year: number;
  reception_TD: number;
  reception_yds: number;
  receptions: number;
  rush_TD: number;
  rush_yds: number;
  team_alt_color: string;
  team_color: string;
  team_logos: string;
  user_id: string;

  constructor() {
    this.extra_points = 0;
    this.extra_points_missed = 0;
    this.field_goals = 0;
    this.field_goals_missed = 0;
    this.fumbles_lost = 0;
    this.interceptions = 0;
    this.pass_TD = 0;
    this.pass_yds = 0;
    this.player_height = 0;
    this.player_id = 0;
    this.player_jersey = 0;
    this.player_name = '';
    this.player_position = FootballPositionEnum.None;
    this.player_team = '';
    this.player_weight = 0;
    this.player_year = 0;
    this.reception_TD = 0;
    this.reception_yds = 0;
    this.receptions = 0;
    this.rush_TD = 0;
    this.rush_yds = 0;
    this.team_alt_color = '';
    this.team_color = '';
    this.team_logos = '';
    this.user_id = '';
  }
}
