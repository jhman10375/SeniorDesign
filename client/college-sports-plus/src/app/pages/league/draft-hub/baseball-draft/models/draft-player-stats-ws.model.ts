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
  player_team: string;
  player_year: number;
  team_color: string;
  team_alt_color: string;
  team_logos: string;
  win: boolean;
  saves: number;
  innings: number;
  earned_runs_allowed: number;
  singles: number;
  doubles: number;
  triples: number;
  homers: number;
  runs: number;
  runs_batted_in: number;
  walks: number;
  hits_by_pitch: number;
  stolen_bases: number;
  caught_stealing: number;

  constructor() {
    this.win = false;
    this.saves = 0;
    this.innings = 0;
    this.earned_runs_allowed = 0;
    this.singles = 0;
    this.doubles = 0;
    this.triples = 0;
    this.player_height = 0;
    this.player_id = 0;
    this.player_jersey = 0;
    this.player_name = '';
    this.player_position = FootballPositionEnum.None;
    this.player_team = '';
    this.homers = 0;
    this.player_year = 0;
    this.runs_batted_in = 0;
    this.walks = 0;
    this.runs = 0;
    this.hits_by_pitch = 0;
    this.stolen_bases = 0;
    this.caught_stealing = 0;
    this.team_alt_color = '';
    this.team_color = '';
    this.team_logos = '';
    this.user_id = '';
  }
}
