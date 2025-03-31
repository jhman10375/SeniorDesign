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
  player_year: number;
  player_team: string;
  team_color: string;
  team_alt_color: string;
  team_logos: string;
  goals: number;
  assists: number;
  shots_on_goal: number;
  shots_off_goal: number;
  fouls: number;
  yellow_cards: number;
  red_cards: number;
  clean_sheet: number;
  goals_allowed: number;
  saves: number;

  constructor() {
    this.goals = 0;
    this.assists = 0;
    this.shots_on_goal = 0;
    this.shots_off_goal = 0;
    this.fouls = 0;
    this.player_height = 0;
    this.player_id = 0;
    this.player_jersey = 0;
    this.player_name = '';
    this.player_position = FootballPositionEnum.None;
    this.player_team = '';
    this.player_year = 0;
    this.yellow_cards = 0;
    this.red_cards = 0;
    this.clean_sheet = 0;
    this.goals_allowed = 0;
    this.saves = 0;
    this.team_alt_color = '';
    this.team_color = '';
    this.team_logos = '';
    this.user_id = '';
  }
}
