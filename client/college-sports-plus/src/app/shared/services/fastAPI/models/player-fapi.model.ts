import { BaseballPositionEnum } from '../../../enums/position/baseball-position.enum';
import { BasketballPositionEnum } from '../../../enums/position/basketball-position.enum';
import { FootballPositionEnum } from '../../../enums/position/football-position.enum';
import { SoccerPositionEnum } from '../../../enums/position/soccer-position.enum';

export class PlayerFAPIModel {
  player_id: string;
  team_alt_color: string;
  team_color: string;
  player_height: number;
  player_jersey: number;
  team_logos: Array<string> | string;
  player_name: string;
  player_position:
    | FootballPositionEnum
    | BaseballPositionEnum
    | BasketballPositionEnum
    | SoccerPositionEnum;
  player_team: string;
  player_weight: number;
  player_year: number;

  constructor() {
    this.player_id = '';
    this.team_alt_color = '';
    this.team_color = '';
    this.player_height = 0;
    this.player_jersey = 0;
    this.team_logos = [];
    this.player_name = '';
    this.player_position = 0;
    this.player_team = '';
    this.player_weight = 0;
    this.player_year = 0;
  }
}
