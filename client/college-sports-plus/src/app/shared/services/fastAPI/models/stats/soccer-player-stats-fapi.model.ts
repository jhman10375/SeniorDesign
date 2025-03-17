import { SoccerPositionEnum } from '../../../../enums/position/soccer-position.enum';

export class SoccerPlayerStatsFAPIModel {
  player_name: string;
  player_id: number;
  player_position: SoccerPositionEnum;
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
}
