import { BasketballPositionEnum } from '../../../../enums/position/basketball-position.enum';

export class BasketballPlayerStatsFAPIModel {
  player_name: string;
  player_ID: number;
  player_position: BasketballPositionEnum;
  three_pointers: number;
  two_pointers: number;
  free_throws: number;
  rebounds: number;
  assists: number;
  blocked_shots: number;
  steals: number;
  turnovers: number;
}
