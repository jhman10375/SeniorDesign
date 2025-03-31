export class DraftResultPlayerWSModel {
  user_id: string;
  round: number;
  index: number;
  player_id: string;

  constructor() {
    this.user_id = '';
    this.round = 0;
    this.index = 0;
    this.player_id = '';
  }
}
