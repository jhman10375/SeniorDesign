export class SeasonSettingsRegularSeasonModel {
  RegularSeasonStart: number;
  WeeksPerGame: number;
  RegularSeasonGames: number;
  HomeFieldAdvantage: boolean;
  PointBenefit: number;

  constructor() {
    this.RegularSeasonStart = 0;
    this.WeeksPerGame = 0;
    this.RegularSeasonGames = 0;
    this.HomeFieldAdvantage = false;
    this.PointBenefit = 0;
  }
}
