import { TransferPortalDeadlineTypeEnum } from '../../enums/transfer-portal-deadline-type.enum';
import { LeagueConferenceModel } from '../league-conference.model';

export class LeagueSettingsModel {
  Conferences: Array<LeagueConferenceModel>;
  NumberOfConferences: number;
  TransferPortalDeadline: TransferPortalDeadlineTypeEnum;

  constructor() {
    this.Conferences = [];
    this.NumberOfConferences = 1;
    this.TransferPortalDeadline = TransferPortalDeadlineTypeEnum.WednesdayNight;
  }
}
