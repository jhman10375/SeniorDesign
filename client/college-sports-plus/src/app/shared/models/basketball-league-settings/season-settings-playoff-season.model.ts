import { SeedingTypeEnum } from '../../enums/seeding-type.enum';
import { TieBreakerTypeEnum } from '../../enums/tie-breaker-type.enum';

export class SeasonSettingsPlayoffSeasonModel {
  PlayoffTeams: number;
  WeeksInSemifinalGame: number;
  WeeksInChampionshipGame: number;
  SeedingType: SeedingTypeEnum;
  TieBreakerType: TieBreakerTypeEnum;

  constructor() {
    this.PlayoffTeams = 0;
    this.WeeksInSemifinalGame = 0;
    this.WeeksInChampionshipGame = 0;
    this.SeedingType = SeedingTypeEnum.Manual;
    this.TieBreakerType = TieBreakerTypeEnum.PointsFor;
  }
}
