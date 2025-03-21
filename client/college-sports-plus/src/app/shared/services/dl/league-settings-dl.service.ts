import { Injectable } from '@angular/core';

import { BaseballLeagueSettingsModel } from '../../models/baseball-league-settings/baseball-league-settings.model';
import { BasketballLeagueSettingsModel } from '../../models/basketball-league-settings/basketball-league-settings.model';
import { FootballLeagueSettingsModel } from '../../models/football-league-settings/football-league-settings.model';
import { DraftSettingsModel } from '../../models/football-league-settings/league-settings-draft-settings.model';
import { GeneralSettingsModel } from '../../models/football-league-settings/league-settings-general-settings.model';
import { LeagueSettingsModel } from '../../models/football-league-settings/league-settings-league-settings.model';
import { PositionModel } from '../../models/football-league-settings/league-settings-position.model';
import { SeasonModel } from '../../models/football-league-settings/league-settings-season.model';
import { SeasonSettingsPlayoffSeasonModel } from '../../models/football-league-settings/season-settings-playoff-season.model';
import { SeasonSettingsRegularSeasonModel } from '../../models/football-league-settings/season-settings-regular-season.model';
import { LeagueConferenceModel } from '../../models/league-conference.model';
import { SoccerLeagueSettingsModel } from '../../models/soccer-league-settings/soccer-league-settings.model';
import { BaseballLeagueSettingsDLModel } from './models/settings/Baseball/baseball-league-settings-dl.model';
import { BasketballLeagueSettingsDLModel } from './models/settings/Basketball/basketball-league-settings-dl.model';
import { FootballLeagueSettingsDLModel } from './models/settings/Football/football-league-settings-dl.model';
import { DraftSettingsDLModel } from './models/settings/Football/league-settings-draft-settings-dl.model';
import { GeneralSettingsDLModel } from './models/settings/Football/league-settings-general-settings-dl.model';
import { LeagueSettingsDLModel } from './models/settings/Football/league-settings-league-settings-dl.model';
import { PositionDLModel } from './models/settings/Football/league-settings-position-dl.model';
import { SeasonDLModel } from './models/settings/Football/league-settings-season-dl.model';
import { SeasonSettingsPlayoffSeasonDLModel } from './models/settings/Football/season-settings-playoff-season-dl.model';
import { SeasonSettingsRegularSeasonDLModel } from './models/settings/Football/season-settings-regular-season-dl.model';
import { LeagueConferenceDLModel } from './models/settings/league-conference-dl.model';
import { SoccerLeagueSettingsDLModel } from './models/settings/Soccer/soccer-league-settings-dl.model';

@Injectable({ providedIn: 'root' })
export class LeagueSettingsDLService {
  constructor() {}

  FootballSettingsDLtoBL(
    leagueSettings: FootballLeagueSettingsDLModel
  ): FootballLeagueSettingsModel {
    const footballLeagueSettingsModel: FootballLeagueSettingsModel =
      new FootballLeagueSettingsModel();
    footballLeagueSettingsModel.ID = leagueSettings.ID;
    footballLeagueSettingsModel.LeagueID = leagueSettings.LID;
    footballLeagueSettingsModel.DraftSettingsModel = new DraftSettingsModel();
    footballLeagueSettingsModel.DraftSettingsModel.Date = new Date(
      leagueSettings.DSM.D
    );
    footballLeagueSettingsModel.DraftSettingsModel.IncludeBenchInDraft =
      leagueSettings.DSM.IBID;
    footballLeagueSettingsModel.DraftSettingsModel.PickOrderType =
      leagueSettings.DSM.POT;
    footballLeagueSettingsModel.DraftSettingsModel.SelectionTime =
      leagueSettings.DSM.ST;
    footballLeagueSettingsModel.GeneralSettingsModel =
      new GeneralSettingsModel();
    footballLeagueSettingsModel.GeneralSettingsModel.LeagueManager.ID =
      leagueSettings.GSM.LMID;
    footballLeagueSettingsModel.GeneralSettingsModel.Name =
      leagueSettings.GSM.N;
    footballLeagueSettingsModel.GeneralSettingsModel.NumberOfTeams =
      leagueSettings.GSM.NOT;
    footballLeagueSettingsModel.GeneralSettingsModel.Passcode =
      leagueSettings.GSM.P;
    footballLeagueSettingsModel.GeneralSettingsModel.PrimaryColor =
      leagueSettings.GSM.PC;
    footballLeagueSettingsModel.GeneralSettingsModel.PublicLeague =
      leagueSettings.GSM.PL;
    footballLeagueSettingsModel.GeneralSettingsModel.SecondaryColor =
      leagueSettings.GSM.SC;
    footballLeagueSettingsModel.LeagueSettingsModel = new LeagueSettingsModel();
    footballLeagueSettingsModel.LeagueSettingsModel.Conferences =
      leagueSettings.LSM.C.map((x) => {
        const c = new LeagueConferenceModel();
        c.ConferenceName = x.CN;
        c.ID = x.ID;
        c.LeagueID = x.LID;
        return c;
      });
    footballLeagueSettingsModel.LeagueSettingsModel.NumberOfConferences =
      leagueSettings.LSM.NOC;
    footballLeagueSettingsModel.LeagueSettingsModel.TransferPortalDeadline =
      leagueSettings.LSM.TPD;
    footballLeagueSettingsModel.PositionModel = new PositionModel();
    footballLeagueSettingsModel.PositionModel.DSTMax = leagueSettings.PM.DSTM;
    footballLeagueSettingsModel.PositionModel.KMax = leagueSettings.PM.KM;
    footballLeagueSettingsModel.PositionModel.QBMax = leagueSettings.PM.QBM;
    footballLeagueSettingsModel.PositionModel.RBMax = leagueSettings.PM.RBM;
    footballLeagueSettingsModel.PositionModel.TEMax = leagueSettings.PM.TEM;
    footballLeagueSettingsModel.PositionModel.WRMax = leagueSettings.PM.WRM;
    footballLeagueSettingsModel.SeasonModel = new SeasonModel();
    footballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings =
      new SeasonSettingsPlayoffSeasonModel();
    footballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.PlayoffTeams =
      leagueSettings.SM.PSS.PT;
    footballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.SeedingType =
      leagueSettings.SM.PSS.ST;
    footballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.TieBreakerType =
      leagueSettings.SM.PSS.TBT;
    footballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.WeeksInChampionshipGame =
      leagueSettings.SM.PSS.WICG;
    footballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.WeeksInSemifinalGame =
      leagueSettings.SM.PSS.WISG;
    footballLeagueSettingsModel.SeasonModel.RegularSeasonSettings =
      new SeasonSettingsRegularSeasonModel();
    footballLeagueSettingsModel.SeasonModel.RegularSeasonSettings.HomeFieldAdvantage =
      leagueSettings.SM.RSS.HFA;
    footballLeagueSettingsModel.SeasonModel.RegularSeasonSettings.PointBenefit =
      leagueSettings.SM.RSS.PB;
    footballLeagueSettingsModel.SeasonModel.RegularSeasonSettings.RegularSeasonGames =
      leagueSettings.SM.RSS.RSG;
    footballLeagueSettingsModel.SeasonModel.RegularSeasonSettings.RegularSeasonStart =
      leagueSettings.SM.RSS.RSS;
    footballLeagueSettingsModel.SeasonModel.RegularSeasonSettings.WeeksPerGame =
      leagueSettings.SM.RSS.WPG;
    return footballLeagueSettingsModel;
  }

  FootballSettingsBLtoDL(
    leagueSettings: FootballLeagueSettingsModel
  ): FootballLeagueSettingsDLModel {
    const footballLeagueSettingsDLModel: FootballLeagueSettingsDLModel =
      new FootballLeagueSettingsDLModel();
    footballLeagueSettingsDLModel.ID = leagueSettings.ID;
    footballLeagueSettingsDLModel.LID = leagueSettings.LeagueID;
    footballLeagueSettingsDLModel.DSM = new DraftSettingsDLModel();
    footballLeagueSettingsDLModel.DSM.D =
      leagueSettings.DraftSettingsModel.Date;
    footballLeagueSettingsDLModel.DSM.IBID =
      leagueSettings.DraftSettingsModel.IncludeBenchInDraft;
    footballLeagueSettingsDLModel.DSM.POT =
      leagueSettings.DraftSettingsModel.PickOrderType;
    footballLeagueSettingsDLModel.DSM.ST =
      leagueSettings.DraftSettingsModel.SelectionTime;
    footballLeagueSettingsDLModel.GSM = new GeneralSettingsDLModel();
    footballLeagueSettingsDLModel.GSM.LMID =
      leagueSettings.GeneralSettingsModel.LeagueManager.ID;
    footballLeagueSettingsDLModel.GSM.N =
      leagueSettings.GeneralSettingsModel.Name;
    footballLeagueSettingsDLModel.GSM.NOT =
      leagueSettings.GeneralSettingsModel.NumberOfTeams;
    footballLeagueSettingsDLModel.GSM.P =
      leagueSettings.GeneralSettingsModel.Passcode;
    footballLeagueSettingsDLModel.GSM.PC =
      leagueSettings.GeneralSettingsModel.PrimaryColor;
    footballLeagueSettingsDLModel.GSM.PL =
      leagueSettings.GeneralSettingsModel.PublicLeague;
    footballLeagueSettingsDLModel.GSM.SC =
      leagueSettings.GeneralSettingsModel.SecondaryColor;
    footballLeagueSettingsDLModel.LSM = new LeagueSettingsDLModel();
    footballLeagueSettingsDLModel.LSM.C =
      leagueSettings.LeagueSettingsModel.Conferences.map((x) => {
        const c = new LeagueConferenceDLModel();
        c.CN = x.ConferenceName;
        c.ID = x.ID;
        c.LID = x.LeagueID;
        return c;
      });
    footballLeagueSettingsDLModel.LSM.NOC =
      leagueSettings.LeagueSettingsModel.NumberOfConferences;
    footballLeagueSettingsDLModel.LSM.TPD =
      leagueSettings.LeagueSettingsModel.TransferPortalDeadline;
    footballLeagueSettingsDLModel.PM = new PositionDLModel();
    footballLeagueSettingsDLModel.PM.DSTM = leagueSettings.PositionModel.DSTMax;
    footballLeagueSettingsDLModel.PM.KM = leagueSettings.PositionModel.KMax;
    footballLeagueSettingsDLModel.PM.QBM = leagueSettings.PositionModel.QBMax;
    footballLeagueSettingsDLModel.PM.RBM = leagueSettings.PositionModel.RBMax;
    footballLeagueSettingsDLModel.PM.TEM = leagueSettings.PositionModel.TEMax;
    footballLeagueSettingsDLModel.PM.WRM = leagueSettings.PositionModel.WRMax;
    footballLeagueSettingsDLModel.SM = new SeasonDLModel();
    footballLeagueSettingsDLModel.SM.PSS =
      new SeasonSettingsPlayoffSeasonDLModel();
    footballLeagueSettingsDLModel.SM.PSS.PT =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.PlayoffTeams;
    footballLeagueSettingsDLModel.SM.PSS.ST =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.SeedingType;
    footballLeagueSettingsDLModel.SM.PSS.TBT =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.TieBreakerType;
    footballLeagueSettingsDLModel.SM.PSS.WICG =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.WeeksInChampionshipGame;
    footballLeagueSettingsDLModel.SM.PSS.WISG =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.WeeksInSemifinalGame;
    footballLeagueSettingsDLModel.SM.RSS =
      new SeasonSettingsRegularSeasonDLModel();
    footballLeagueSettingsDLModel.SM.RSS.HFA =
      leagueSettings.SeasonModel.RegularSeasonSettings.HomeFieldAdvantage;
    footballLeagueSettingsDLModel.SM.RSS.PB =
      leagueSettings.SeasonModel.RegularSeasonSettings.PointBenefit;
    footballLeagueSettingsDLModel.SM.RSS.RSG =
      leagueSettings.SeasonModel.RegularSeasonSettings.RegularSeasonGames;
    footballLeagueSettingsDLModel.SM.RSS.RSS =
      leagueSettings.SeasonModel.RegularSeasonSettings.RegularSeasonStart;
    footballLeagueSettingsDLModel.SM.RSS.WPG =
      leagueSettings.SeasonModel.RegularSeasonSettings.WeeksPerGame;
    return footballLeagueSettingsDLModel;
  }

  BaseballSettingsBLtoDL(
    leagueSettings: BaseballLeagueSettingsModel
  ): BaseballLeagueSettingsDLModel {
    const baseballLeagueSettingsDLModel: BaseballLeagueSettingsDLModel =
      new BaseballLeagueSettingsDLModel();
    return baseballLeagueSettingsDLModel;
  }

  BaseballSettingsDLtoBL(
    leagueSettings: BaseballLeagueSettingsDLModel
  ): BaseballLeagueSettingsModel {
    const baseballLeagueSettingsModel: BaseballLeagueSettingsModel =
      new BaseballLeagueSettingsModel();
    return baseballLeagueSettingsModel;
  }

  BasketballSettingsBLtoDL(
    leagueSettings: BasketballLeagueSettingsModel
  ): BasketballLeagueSettingsDLModel {
    const basketballLeagueSettingsDLModel: BasketballLeagueSettingsDLModel =
      new BasketballLeagueSettingsDLModel();
    return basketballLeagueSettingsDLModel;
  }

  BasketballSettingsDLtoBL(
    leagueSettings: BasketballLeagueSettingsDLModel
  ): BasketballLeagueSettingsModel {
    const basketballLeagueSettingsModel: BasketballLeagueSettingsModel =
      new BasketballLeagueSettingsModel();
    return basketballLeagueSettingsModel;
  }

  SoccerSettingsBLtoDL(
    leagueSettings: SoccerLeagueSettingsModel
  ): SoccerLeagueSettingsDLModel {
    const soccerLeagueSettingsDLModel: SoccerLeagueSettingsDLModel =
      new SoccerLeagueSettingsDLModel();
    return soccerLeagueSettingsDLModel;
  }

  SoccerSettingsDLtoBL(
    leagueSettings: SoccerLeagueSettingsDLModel
  ): SoccerLeagueSettingsModel {
    const soccerLeagueSettingsModel: SoccerLeagueSettingsModel =
      new SoccerLeagueSettingsModel();
    return soccerLeagueSettingsModel;
  }
}
