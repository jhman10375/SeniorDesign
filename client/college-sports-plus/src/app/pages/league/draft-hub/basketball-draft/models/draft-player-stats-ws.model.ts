import { BaseballPositionEnum } from '../../../../../shared/enums/position/baseball-position.enum';
import { BasketballPositionEnum } from '../../../../../shared/enums/position/basketball-position.enum';
import { FootballPositionEnum } from '../../../../../shared/enums/position/football-position.enum';
import { SoccerPositionEnum } from '../../../../../shared/enums/position/soccer-position.enum';

export class DraftPlayerStatsWSModel {
  user_id: string;
  player_id: number;
  player_name: string;
  player_position:
    | FootballPositionEnum
    | BaseballPositionEnum
    | BasketballPositionEnum
    | SoccerPositionEnum;
  player_jersey: number;
  player_height: number;
  player_weight: number;
  player_team: string;
  player_year: number;
  team_color: string;
  team_alt_color: string;
  team_logos: string;
  three_pointers: number;
  two_pointers: number;
  free_throws: number;
  rebounds: number;
  assists: number;
  blocked_shots: number;
  steals: number;
  turnovers: number;

  constructor() {
    this.three_pointers = 0;
    this.two_pointers = 0;
    this.free_throws = 0;
    this.player_height = 0;
    this.player_id = 0;
    this.player_jersey = 0;
    this.player_name = '';
    this.player_position = FootballPositionEnum.None;
    this.player_team = '';
    this.player_weight = 0;
    this.player_year = 0;
    this.rebounds = 0;
    this.assists = 0;
    this.blocked_shots = 0;
    this.steals = 0;
    this.turnovers = 0;
    this.team_alt_color = '';
    this.team_color = '';
    this.team_logos = '';
    this.user_id = '';
  }
}
