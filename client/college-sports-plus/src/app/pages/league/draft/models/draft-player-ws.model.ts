import { DraftSchoolWSModel } from './draft-school-ws.model';

export class DraftPlayerWSModel {
  id: string;
  name: string;
  number: string;
  player_id: string;
  school: DraftSchoolWSModel;

  constructor() {
    this.id = '';
    this.name = '';
    this.number = '';
    this.player_id = '';
    this.school = new DraftSchoolWSModel();
  }
}
