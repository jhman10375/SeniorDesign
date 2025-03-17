import { FootballPositionEnum } from '../../../../enums/position/football-position.enum';

export class FootballPlayerStatsFAPIModel {
  player_name: string;
  player_ID: number;
  player_position: FootballPositionEnum;
  pass_TD: number;
  pass_yds: number;
  interceptions: number;
  fumbles_lost: number;
  rush_yds: number;
  rush_TD: number;
  reception_yds: number;
  reception_TD: number;
  receptions: number;
  extra_points: number;
  extra_points_missed: number;
  field_goals: number;
  field_goals_missed: number;
}
