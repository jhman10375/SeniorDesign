import { BaseballPositionEnum } from '../../../../../shared/enums/position/baseball-position.enum';
import { BasketballPositionEnum } from '../../../../../shared/enums/position/basketball-position.enum';
import { FootballPositionEnum } from '../../../../../shared/enums/position/football-position.enum';
import { SoccerPositionEnum } from '../../../../../shared/enums/position/soccer-position.enum';

export class DraftPlayerWSModel {
  id: string;
  alt_color: string;
  color: string;
  height: number;
  jersey: number;
  logos: string;
  name: string;
  position:
    | FootballPositionEnum
    | BaseballPositionEnum
    | BasketballPositionEnum
    | SoccerPositionEnum;
  school: string;
  team: string;
  user_id: string | null;
  weight: number;
  year: number;

  constructor() {
    this.id = '';
    this.alt_color = '';
    this.color = '';
    this.height = 0;
    this.jersey = 0;
    this.logos = '';
    this.name = '';
    this.position = 0;
    this.school = '';
    this.team = '';
    this.user_id = null;
    this.weight = 0;
    this.year = 0;
  }
}
