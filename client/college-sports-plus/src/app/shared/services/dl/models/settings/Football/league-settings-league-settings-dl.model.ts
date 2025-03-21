import { TransferPortalDeadlineTypeEnum } from '../../../../../enums/transfer-portal-deadline-type.enum';
import { LeagueConferenceDLModel } from '../league-conference-dl.model';

export class LeagueSettingsDLModel {
  C: Array<LeagueConferenceDLModel>;
  NOC: number;
  TPD: TransferPortalDeadlineTypeEnum;

  constructor() {
    this.C = [];
    this.NOC = 1;
    this.TPD = TransferPortalDeadlineTypeEnum.WednesdayNight;
  }
}
