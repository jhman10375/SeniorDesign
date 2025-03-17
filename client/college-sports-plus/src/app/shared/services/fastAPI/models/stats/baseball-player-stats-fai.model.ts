import { BaseballPositionEnum } from '../../../../enums/position/baseball-position.enum';

export class BaseballPlayerStatsFAPIModel {
  player_name: string;
  player_id: number;
  player_position: BaseballPositionEnum;
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
}
