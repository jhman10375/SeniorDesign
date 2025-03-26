import { SeedingTypeEnum } from '../../../../../enums/seeding-type.enum';
import { TieBreakerTypeEnum } from '../../../../../enums/tie-breaker-type.enum';

export class SeasonSettingsPlayoffSeasonDLModel {
  PT: number;
  WISG: number;
  WICG: number;
  ST: SeedingTypeEnum;
  TBT: TieBreakerTypeEnum;

  constructor() {
    this.PT = 0;
    this.WISG = 0;
    this.WICG = 0;
    this.ST = SeedingTypeEnum.Manual;
    this.TBT = TieBreakerTypeEnum.PointsFor;
  }
}
