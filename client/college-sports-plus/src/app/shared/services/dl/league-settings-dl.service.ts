import { Injectable } from '@angular/core';

import { BaseballLeagueSettingsModel } from '../../models/baseball-league-settings/baseball-league-settings.model';
import * as BaseballDraftSettingsModel from '../../models/baseball-league-settings/league-settings-draft-settings.model';
import * as BaseballGeneralSettingsModel from '../../models/baseball-league-settings/league-settings-general-settings.model';
import * as BaseballSettingsLeagueSettingsModel from '../../models/baseball-league-settings/league-settings-league-settings.model';
import * as BaseballPositionModel from '../../models/baseball-league-settings/league-settings-position.model';
import * as BaseballSeasonModel from '../../models/baseball-league-settings/league-settings-season.model';
import * as BaseballSeasonSettingsPlayoffSeasonModel from '../../models/baseball-league-settings/season-settings-playoff-season.model';
import * as BaseballSeasonSettingsRegularSeasonModel from '../../models/baseball-league-settings/season-settings-regular-season.model';
import { BasketballLeagueSettingsModel } from '../../models/basketball-league-settings/basketball-league-settings.model';
import * as BasketballDraftSettingsModel from '../../models/basketball-league-settings/league-settings-draft-settings.model';
import * as BasketballGeneralSettingsModel from '../../models/basketball-league-settings/league-settings-general-settings.model';
import * as BasketballSettingsLeagueSettingsModel from '../../models/basketball-league-settings/league-settings-league-settings.model';
import * as BasketballPositionModel from '../../models/basketball-league-settings/league-settings-position.model';
import * as BasketballSeasonModel from '../../models/basketball-league-settings/league-settings-season.model';
import * as BasketballSeasonSettingsPlayoffSeasonModel from '../../models/basketball-league-settings/season-settings-playoff-season.model';
import * as BasketballSeasonSettingsRegularSeasonModel from '../../models/basketball-league-settings/season-settings-regular-season.model';
import { FootballLeagueSettingsModel } from '../../models/football-league-settings/football-league-settings.model';
import * as FootballDraftSettingsModel from '../../models/football-league-settings/league-settings-draft-settings.model';
import * as FootballGeneralSettingsModel from '../../models/football-league-settings/league-settings-general-settings.model';
import * as FootballSettingsLeagueSettingsModel from '../../models/football-league-settings/league-settings-league-settings.model';
import * as FootballPositionModel from '../../models/football-league-settings/league-settings-position.model';
import * as FootballSeasonModel from '../../models/football-league-settings/league-settings-season.model';
import * as FootballSeasonSettingsPlayoffSeasonModel from '../../models/football-league-settings/season-settings-playoff-season.model';
import * as FootballSeasonSettingsRegularSeasonModel from '../../models/football-league-settings/season-settings-regular-season.model';
import { LeagueConferenceModel } from '../../models/league-conference.model';
import * as SoccerDraftSettingsModel from '../../models/soccer-league-settings/league-settings-draft-settings.model';
import * as SoccerGeneralSettingsModel from '../../models/soccer-league-settings/league-settings-general-settings.model';
import * as SoccerSettingsLeagueSettingsModel from '../../models/soccer-league-settings/league-settings-league-settings.model';
import * as SoccerPositionModel from '../../models/soccer-league-settings/league-settings-position.model';
import * as SoccerSeasonModel from '../../models/soccer-league-settings/league-settings-season.model';
import * as SoccerSeasonSettingsPlayoffSeasonModel from '../../models/soccer-league-settings/season-settings-playoff-season.model';
import * as SoccerSeasonSettingsRegularSeasonModel from '../../models/soccer-league-settings/season-settings-regular-season.model';
import { SoccerLeagueSettingsModel } from '../../models/soccer-league-settings/soccer-league-settings.model';
import { BaseballLeagueSettingsDLModel } from './models/settings/Baseball/baseball-league-settings-dl.model';
import * as BaseballDraftSettingsDLModel from './models/settings/Baseball/league-settings-draft-settings-dl.model';
import * as BaseballGeneralSettingsDLModel from './models/settings/Baseball/league-settings-general-settings-dl.model';
import * as BaseballSettingsLeagueSettingsDLModel from './models/settings/Baseball/league-settings-league-settings-dl.model';
import * as BaseballPositionDLModel from './models/settings/Baseball/league-settings-position-dl.model';
import * as BaseballSeasonDLModel from './models/settings/Baseball/league-settings-season-dl.model';
import * as BaseballSeasonSettingsPlayoffSeasonDLModel from './models/settings/Baseball/season-settings-playoff-season-dl.model';
import * as BaseballSeasonSettingsRegularSeasonDLModel from './models/settings/Baseball/season-settings-regular-season-dl.model';
import { BasketballLeagueSettingsDLModel } from './models/settings/Basketball/basketball-league-settings-dl.model';
import * as BasketballDraftSettingsDLModel from './models/settings/Basketball/league-settings-draft-settings-dl.model';
import * as BasketballGeneralSettingsDLModel from './models/settings/Basketball/league-settings-general-settings-dl.model';
import * as BasketballSettingsLeagueSettingsDLModel from './models/settings/Basketball/league-settings-league-settings-dl.model';
import * as BasketballPositionDLModel from './models/settings/Basketball/league-settings-position-dl.model';
import * as BasketballSeasonDLModel from './models/settings/Basketball/league-settings-season-dl.model';
import * as BasketballSeasonSettingsPlayoffSeasonDLModel from './models/settings/Basketball/season-settings-playoff-season-dl.model';
import * as BasketballSeasonSettingsRegularSeasonDLModel from './models/settings/Basketball/season-settings-regular-season-dl.model';
import { FootballLeagueSettingsDLModel } from './models/settings/Football/football-league-settings-dl.model';
import * as FootballDraftSettingsDLModel from './models/settings/Football/league-settings-draft-settings-dl.model';
import * as FootballGeneralSettingsDLModel from './models/settings/Football/league-settings-general-settings-dl.model';
import * as FootballSettingsLeagueSettingsDLModel from './models/settings/Football/league-settings-league-settings-dl.model';
import * as FootballPositionDLModel from './models/settings/Football/league-settings-position-dl.model';
import * as FootballSeasonDLModel from './models/settings/Football/league-settings-season-dl.model';
import * as FootballSeasonSettingsPlayoffSeasonDLModel from './models/settings/Football/season-settings-playoff-season-dl.model';
import * as FootballSeasonSettingsRegularSeasonDLModel from './models/settings/Football/season-settings-regular-season-dl.model';
import { LeagueConferenceDLModel } from './models/settings/league-conference-dl.model';
import * as SoccerDraftSettingsDLModel from './models/settings/Soccer/league-settings-draft-settings-dl.model';
import * as SoccerGeneralSettingsDLModel from './models/settings/Soccer/league-settings-general-settings-dl.model';
import * as SoccerSettingsLeagueSettingsDLModel from './models/settings/Soccer/league-settings-league-settings-dl.model';
import * as SoccerPositionDLModel from './models/settings/Soccer/league-settings-position-dl.model';
import * as SoccerSeasonDLModel from './models/settings/Soccer/league-settings-season-dl.model';
import * as SoccerSeasonSettingsPlayoffSeasonDLModel from './models/settings/Soccer/season-settings-playoff-season-dl.model';
import * as SoccerSeasonSettingsRegularSeasonDLModel from './models/settings/Soccer/season-settings-regular-season-dl.model';
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
    footballLeagueSettingsModel.DraftSettingsModel =
      new FootballDraftSettingsModel.DraftSettingsModel();
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
      new FootballGeneralSettingsModel.GeneralSettingsModel();
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
    footballLeagueSettingsModel.LeagueSettingsModel =
      new FootballSettingsLeagueSettingsModel.LeagueSettingsModel();
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
    footballLeagueSettingsModel.PositionModel =
      new FootballPositionModel.PositionModel();
    footballLeagueSettingsModel.PositionModel.DSTMax = leagueSettings.PM.DSTM;
    footballLeagueSettingsModel.PositionModel.KMax = leagueSettings.PM.KM;
    footballLeagueSettingsModel.PositionModel.QBMax = leagueSettings.PM.QBM;
    footballLeagueSettingsModel.PositionModel.RBMax = leagueSettings.PM.RBM;
    footballLeagueSettingsModel.PositionModel.TEMax = leagueSettings.PM.TEM;
    footballLeagueSettingsModel.PositionModel.WRMax = leagueSettings.PM.WRM;
    footballLeagueSettingsModel.SeasonModel =
      new FootballSeasonModel.SeasonModel();
    footballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings =
      new FootballSeasonSettingsPlayoffSeasonModel.SeasonSettingsPlayoffSeasonModel();
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
      new FootballSeasonSettingsRegularSeasonModel.SeasonSettingsRegularSeasonModel();
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
    footballLeagueSettingsDLModel.DSM =
      new FootballDraftSettingsDLModel.DraftSettingsDLModel();
    footballLeagueSettingsDLModel.DSM.D =
      leagueSettings.DraftSettingsModel.Date;
    footballLeagueSettingsDLModel.DSM.IBID =
      leagueSettings.DraftSettingsModel.IncludeBenchInDraft;
    footballLeagueSettingsDLModel.DSM.POT =
      leagueSettings.DraftSettingsModel.PickOrderType;
    footballLeagueSettingsDLModel.DSM.ST =
      leagueSettings.DraftSettingsModel.SelectionTime;
    footballLeagueSettingsDLModel.GSM =
      new FootballGeneralSettingsDLModel.GeneralSettingsDLModel();
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
    footballLeagueSettingsDLModel.LSM =
      new FootballSettingsLeagueSettingsDLModel.LeagueSettingsDLModel();
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
    footballLeagueSettingsDLModel.PM =
      new FootballPositionDLModel.PositionDLModel();
    footballLeagueSettingsDLModel.PM.DSTM = leagueSettings.PositionModel.DSTMax;
    footballLeagueSettingsDLModel.PM.KM = leagueSettings.PositionModel.KMax;
    footballLeagueSettingsDLModel.PM.QBM = leagueSettings.PositionModel.QBMax;
    footballLeagueSettingsDLModel.PM.RBM = leagueSettings.PositionModel.RBMax;
    footballLeagueSettingsDLModel.PM.TEM = leagueSettings.PositionModel.TEMax;
    footballLeagueSettingsDLModel.PM.WRM = leagueSettings.PositionModel.WRMax;
    footballLeagueSettingsDLModel.SM =
      new FootballSeasonDLModel.SeasonDLModel();
    footballLeagueSettingsDLModel.SM.PSS =
      new FootballSeasonSettingsPlayoffSeasonDLModel.SeasonSettingsPlayoffSeasonDLModel();
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
      new FootballSeasonSettingsRegularSeasonDLModel.SeasonSettingsRegularSeasonDLModel();
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

  BaseballSettingsDLtoBL(
    leagueSettings: BaseballLeagueSettingsDLModel
  ): BaseballLeagueSettingsModel {
    const baseballLeagueSettingsModel: BaseballLeagueSettingsModel =
      new BaseballLeagueSettingsModel();
    baseballLeagueSettingsModel.ID = leagueSettings.ID;
    baseballLeagueSettingsModel.LeagueID = leagueSettings.LID;
    baseballLeagueSettingsModel.DraftSettingsModel =
      new BaseballDraftSettingsModel.DraftSettingsModel();
    baseballLeagueSettingsModel.DraftSettingsModel.Date = new Date(
      leagueSettings.DSM.D
    );
    baseballLeagueSettingsModel.DraftSettingsModel.IncludeBenchInDraft =
      leagueSettings.DSM.IBID;
    baseballLeagueSettingsModel.DraftSettingsModel.PickOrderType =
      leagueSettings.DSM.POT;
    baseballLeagueSettingsModel.DraftSettingsModel.SelectionTime =
      leagueSettings.DSM.ST;
    baseballLeagueSettingsModel.GeneralSettingsModel =
      new BaseballGeneralSettingsModel.GeneralSettingsModel();
    baseballLeagueSettingsModel.GeneralSettingsModel.LeagueManager.ID =
      leagueSettings.GSM.LMID;
    baseballLeagueSettingsModel.GeneralSettingsModel.Name =
      leagueSettings.GSM.N;
    baseballLeagueSettingsModel.GeneralSettingsModel.NumberOfTeams =
      leagueSettings.GSM.NOT;
    baseballLeagueSettingsModel.GeneralSettingsModel.Passcode =
      leagueSettings.GSM.P;
    baseballLeagueSettingsModel.GeneralSettingsModel.PrimaryColor =
      leagueSettings.GSM.PC;
    baseballLeagueSettingsModel.GeneralSettingsModel.PublicLeague =
      leagueSettings.GSM.PL;
    baseballLeagueSettingsModel.GeneralSettingsModel.SecondaryColor =
      leagueSettings.GSM.SC;
    baseballLeagueSettingsModel.LeagueSettingsModel =
      new BaseballSettingsLeagueSettingsModel.LeagueSettingsModel();
    baseballLeagueSettingsModel.LeagueSettingsModel.Conferences =
      leagueSettings.LSM.C.map((x) => {
        const c = new LeagueConferenceModel();
        c.ConferenceName = x.CN;
        c.ID = x.ID;
        c.LeagueID = x.LID;
        return c;
      });
    baseballLeagueSettingsModel.LeagueSettingsModel.NumberOfConferences =
      leagueSettings.LSM.NOC;
    baseballLeagueSettingsModel.LeagueSettingsModel.TransferPortalDeadline =
      leagueSettings.LSM.TPD;
    baseballLeagueSettingsModel.PositionModel =
      new BaseballPositionModel.PositionModel();
    baseballLeagueSettingsModel.PositionModel.B1Max = leagueSettings.PM.B1M;
    baseballLeagueSettingsModel.PositionModel.B3Max = leagueSettings.PM.B3M;
    baseballLeagueSettingsModel.PositionModel.CMax = leagueSettings.PM.CM;
    baseballLeagueSettingsModel.PositionModel.INFMax = leagueSettings.PM.INFM;
    baseballLeagueSettingsModel.PositionModel.OFMax = leagueSettings.PM.OFM;
    baseballLeagueSettingsModel.PositionModel.PMax = leagueSettings.PM.PM;
    baseballLeagueSettingsModel.PositionModel.UTMax = leagueSettings.PM.UTM;
    baseballLeagueSettingsModel.SeasonModel =
      new BaseballSeasonModel.SeasonModel();
    baseballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings =
      new BaseballSeasonSettingsPlayoffSeasonModel.SeasonSettingsPlayoffSeasonModel();
    baseballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.PlayoffTeams =
      leagueSettings.SM.PSS.PT;
    baseballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.SeedingType =
      leagueSettings.SM.PSS.ST;
    baseballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.TieBreakerType =
      leagueSettings.SM.PSS.TBT;
    baseballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.WeeksInChampionshipGame =
      leagueSettings.SM.PSS.WICG;
    baseballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.WeeksInSemifinalGame =
      leagueSettings.SM.PSS.WISG;
    baseballLeagueSettingsModel.SeasonModel.RegularSeasonSettings =
      new BaseballSeasonSettingsRegularSeasonModel.SeasonSettingsRegularSeasonModel();
    baseballLeagueSettingsModel.SeasonModel.RegularSeasonSettings.HomeFieldAdvantage =
      leagueSettings.SM.RSS.HFA;
    baseballLeagueSettingsModel.SeasonModel.RegularSeasonSettings.PointBenefit =
      leagueSettings.SM.RSS.PB;
    baseballLeagueSettingsModel.SeasonModel.RegularSeasonSettings.RegularSeasonGames =
      leagueSettings.SM.RSS.RSG;
    baseballLeagueSettingsModel.SeasonModel.RegularSeasonSettings.RegularSeasonStart =
      leagueSettings.SM.RSS.RSS;
    baseballLeagueSettingsModel.SeasonModel.RegularSeasonSettings.WeeksPerGame =
      leagueSettings.SM.RSS.WPG;
    return baseballLeagueSettingsModel;
  }

  BaseballSettingsBLtoDL(
    leagueSettings: BaseballLeagueSettingsModel
  ): BaseballLeagueSettingsDLModel {
    const baseballLeagueSettingsDLModel: BaseballLeagueSettingsDLModel =
      new BaseballLeagueSettingsDLModel();
    baseballLeagueSettingsDLModel.ID = leagueSettings.ID;
    baseballLeagueSettingsDLModel.LID = leagueSettings.LeagueID;
    baseballLeagueSettingsDLModel.DSM =
      new BaseballDraftSettingsDLModel.DraftSettingsDLModel();
    baseballLeagueSettingsDLModel.DSM.D =
      leagueSettings.DraftSettingsModel.Date;
    baseballLeagueSettingsDLModel.DSM.IBID =
      leagueSettings.DraftSettingsModel.IncludeBenchInDraft;
    baseballLeagueSettingsDLModel.DSM.POT =
      leagueSettings.DraftSettingsModel.PickOrderType;
    baseballLeagueSettingsDLModel.DSM.ST =
      leagueSettings.DraftSettingsModel.SelectionTime;
    baseballLeagueSettingsDLModel.GSM =
      new BaseballGeneralSettingsDLModel.GeneralSettingsDLModel();
    baseballLeagueSettingsDLModel.GSM.LMID =
      leagueSettings.GeneralSettingsModel.LeagueManager.ID;
    baseballLeagueSettingsDLModel.GSM.N =
      leagueSettings.GeneralSettingsModel.Name;
    baseballLeagueSettingsDLModel.GSM.NOT =
      leagueSettings.GeneralSettingsModel.NumberOfTeams;
    baseballLeagueSettingsDLModel.GSM.P =
      leagueSettings.GeneralSettingsModel.Passcode;
    baseballLeagueSettingsDLModel.GSM.PC =
      leagueSettings.GeneralSettingsModel.PrimaryColor;
    baseballLeagueSettingsDLModel.GSM.PL =
      leagueSettings.GeneralSettingsModel.PublicLeague;
    baseballLeagueSettingsDLModel.GSM.SC =
      leagueSettings.GeneralSettingsModel.SecondaryColor;
    baseballLeagueSettingsDLModel.LSM =
      new BaseballSettingsLeagueSettingsDLModel.LeagueSettingsDLModel();
    baseballLeagueSettingsDLModel.LSM.C =
      leagueSettings.LeagueSettingsModel.Conferences.map((x) => {
        const c = new LeagueConferenceDLModel();
        c.CN = x.ConferenceName;
        c.ID = x.ID;
        c.LID = x.LeagueID;
        return c;
      });
    baseballLeagueSettingsDLModel.LSM.NOC =
      leagueSettings.LeagueSettingsModel.NumberOfConferences;
    baseballLeagueSettingsDLModel.LSM.TPD =
      leagueSettings.LeagueSettingsModel.TransferPortalDeadline;
    baseballLeagueSettingsDLModel.PM =
      new BaseballPositionDLModel.PositionDLModel();
    baseballLeagueSettingsDLModel.PM.B1M = leagueSettings.PositionModel.B1Max;
    baseballLeagueSettingsDLModel.PM.B3M = leagueSettings.PositionModel.B3Max;
    baseballLeagueSettingsDLModel.PM.CM = leagueSettings.PositionModel.CMax;
    baseballLeagueSettingsDLModel.PM.INFM = leagueSettings.PositionModel.INFMax;
    baseballLeagueSettingsDLModel.PM.OFM = leagueSettings.PositionModel.OFMax;
    baseballLeagueSettingsDLModel.PM.PM = leagueSettings.PositionModel.PMax;
    baseballLeagueSettingsDLModel.PM.UTM = leagueSettings.PositionModel.UTMax;
    baseballLeagueSettingsDLModel.SM =
      new BaseballSeasonDLModel.SeasonDLModel();
    baseballLeagueSettingsDLModel.SM.PSS =
      new BaseballSeasonSettingsPlayoffSeasonDLModel.SeasonSettingsPlayoffSeasonDLModel();
    baseballLeagueSettingsDLModel.SM.PSS.PT =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.PlayoffTeams;
    baseballLeagueSettingsDLModel.SM.PSS.ST =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.SeedingType;
    baseballLeagueSettingsDLModel.SM.PSS.TBT =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.TieBreakerType;
    baseballLeagueSettingsDLModel.SM.PSS.WICG =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.WeeksInChampionshipGame;
    baseballLeagueSettingsDLModel.SM.PSS.WISG =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.WeeksInSemifinalGame;
    baseballLeagueSettingsDLModel.SM.RSS =
      new BaseballSeasonSettingsRegularSeasonDLModel.SeasonSettingsRegularSeasonDLModel();
    baseballLeagueSettingsDLModel.SM.RSS.HFA =
      leagueSettings.SeasonModel.RegularSeasonSettings.HomeFieldAdvantage;
    baseballLeagueSettingsDLModel.SM.RSS.PB =
      leagueSettings.SeasonModel.RegularSeasonSettings.PointBenefit;
    baseballLeagueSettingsDLModel.SM.RSS.RSG =
      leagueSettings.SeasonModel.RegularSeasonSettings.RegularSeasonGames;
    baseballLeagueSettingsDLModel.SM.RSS.RSS =
      leagueSettings.SeasonModel.RegularSeasonSettings.RegularSeasonStart;
    baseballLeagueSettingsDLModel.SM.RSS.WPG =
      leagueSettings.SeasonModel.RegularSeasonSettings.WeeksPerGame;
    return baseballLeagueSettingsDLModel;
  }

  BasketballSettingsDLtoBL(
    leagueSettings: BasketballLeagueSettingsDLModel
  ): BasketballLeagueSettingsModel {
    const basketballLeagueSettingsModel: BasketballLeagueSettingsModel =
      new BasketballLeagueSettingsModel();
    basketballLeagueSettingsModel.ID = leagueSettings.ID;
    basketballLeagueSettingsModel.LeagueID = leagueSettings.LID;
    basketballLeagueSettingsModel.DraftSettingsModel =
      new BasketballDraftSettingsModel.DraftSettingsModel();
    basketballLeagueSettingsModel.DraftSettingsModel.Date = new Date(
      leagueSettings.DSM.D
    );
    basketballLeagueSettingsModel.DraftSettingsModel.IncludeBenchInDraft =
      leagueSettings.DSM.IBID;
    basketballLeagueSettingsModel.DraftSettingsModel.PickOrderType =
      leagueSettings.DSM.POT;
    basketballLeagueSettingsModel.DraftSettingsModel.SelectionTime =
      leagueSettings.DSM.ST;
    basketballLeagueSettingsModel.GeneralSettingsModel =
      new BasketballGeneralSettingsModel.GeneralSettingsModel();
    basketballLeagueSettingsModel.GeneralSettingsModel.LeagueManager.ID =
      leagueSettings.GSM.LMID;
    basketballLeagueSettingsModel.GeneralSettingsModel.Name =
      leagueSettings.GSM.N;
    basketballLeagueSettingsModel.GeneralSettingsModel.NumberOfTeams =
      leagueSettings.GSM.NOT;
    basketballLeagueSettingsModel.GeneralSettingsModel.Passcode =
      leagueSettings.GSM.P;
    basketballLeagueSettingsModel.GeneralSettingsModel.PrimaryColor =
      leagueSettings.GSM.PC;
    basketballLeagueSettingsModel.GeneralSettingsModel.PublicLeague =
      leagueSettings.GSM.PL;
    basketballLeagueSettingsModel.GeneralSettingsModel.SecondaryColor =
      leagueSettings.GSM.SC;
    basketballLeagueSettingsModel.LeagueSettingsModel =
      new BasketballSettingsLeagueSettingsModel.LeagueSettingsModel();
    basketballLeagueSettingsModel.LeagueSettingsModel.Conferences =
      leagueSettings.LSM.C.map((x) => {
        const c = new LeagueConferenceModel();
        c.ConferenceName = x.CN;
        c.ID = x.ID;
        c.LeagueID = x.LID;
        return c;
      });
    basketballLeagueSettingsModel.LeagueSettingsModel.NumberOfConferences =
      leagueSettings.LSM.NOC;
    basketballLeagueSettingsModel.LeagueSettingsModel.TransferPortalDeadline =
      leagueSettings.LSM.TPD;
    basketballLeagueSettingsModel.PositionModel =
      new BasketballPositionModel.PositionModel();
    basketballLeagueSettingsModel.PositionModel.CMax = leagueSettings.PM.CM;
    basketballLeagueSettingsModel.PositionModel.FMax = leagueSettings.PM.FM;
    basketballLeagueSettingsModel.PositionModel.GMax = leagueSettings.PM.GM;
    basketballLeagueSettingsModel.SeasonModel =
      new BasketballSeasonModel.SeasonModel();
    basketballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings =
      new BasketballSeasonSettingsPlayoffSeasonModel.SeasonSettingsPlayoffSeasonModel();
    basketballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.PlayoffTeams =
      leagueSettings.SM.PSS.PT;
    basketballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.SeedingType =
      leagueSettings.SM.PSS.ST;
    basketballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.TieBreakerType =
      leagueSettings.SM.PSS.TBT;
    basketballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.WeeksInChampionshipGame =
      leagueSettings.SM.PSS.WICG;
    basketballLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.WeeksInSemifinalGame =
      leagueSettings.SM.PSS.WISG;
    basketballLeagueSettingsModel.SeasonModel.RegularSeasonSettings =
      new BasketballSeasonSettingsRegularSeasonModel.SeasonSettingsRegularSeasonModel();
    basketballLeagueSettingsModel.SeasonModel.RegularSeasonSettings.HomeFieldAdvantage =
      leagueSettings.SM.RSS.HFA;
    basketballLeagueSettingsModel.SeasonModel.RegularSeasonSettings.PointBenefit =
      leagueSettings.SM.RSS.PB;
    basketballLeagueSettingsModel.SeasonModel.RegularSeasonSettings.RegularSeasonGames =
      leagueSettings.SM.RSS.RSG;
    basketballLeagueSettingsModel.SeasonModel.RegularSeasonSettings.RegularSeasonStart =
      leagueSettings.SM.RSS.RSS;
    basketballLeagueSettingsModel.SeasonModel.RegularSeasonSettings.WeeksPerGame =
      leagueSettings.SM.RSS.WPG;
    return basketballLeagueSettingsModel;
  }

  BasketballSettingsBLtoDL(
    leagueSettings: BasketballLeagueSettingsModel
  ): BasketballLeagueSettingsDLModel {
    const basketballLeagueSettingsDLModel: BasketballLeagueSettingsDLModel =
      new BasketballLeagueSettingsDLModel();
    basketballLeagueSettingsDLModel.ID = leagueSettings.ID;
    basketballLeagueSettingsDLModel.LID = leagueSettings.LeagueID;
    basketballLeagueSettingsDLModel.DSM =
      new BasketballDraftSettingsDLModel.DraftSettingsDLModel();
    basketballLeagueSettingsDLModel.DSM.D =
      leagueSettings.DraftSettingsModel.Date;
    basketballLeagueSettingsDLModel.DSM.IBID =
      leagueSettings.DraftSettingsModel.IncludeBenchInDraft;
    basketballLeagueSettingsDLModel.DSM.POT =
      leagueSettings.DraftSettingsModel.PickOrderType;
    basketballLeagueSettingsDLModel.DSM.ST =
      leagueSettings.DraftSettingsModel.SelectionTime;
    basketballLeagueSettingsDLModel.GSM =
      new BasketballGeneralSettingsDLModel.GeneralSettingsDLModel();
    basketballLeagueSettingsDLModel.GSM.LMID =
      leagueSettings.GeneralSettingsModel.LeagueManager.ID;
    basketballLeagueSettingsDLModel.GSM.N =
      leagueSettings.GeneralSettingsModel.Name;
    basketballLeagueSettingsDLModel.GSM.NOT =
      leagueSettings.GeneralSettingsModel.NumberOfTeams;
    basketballLeagueSettingsDLModel.GSM.P =
      leagueSettings.GeneralSettingsModel.Passcode;
    basketballLeagueSettingsDLModel.GSM.PC =
      leagueSettings.GeneralSettingsModel.PrimaryColor;
    basketballLeagueSettingsDLModel.GSM.PL =
      leagueSettings.GeneralSettingsModel.PublicLeague;
    basketballLeagueSettingsDLModel.GSM.SC =
      leagueSettings.GeneralSettingsModel.SecondaryColor;
    basketballLeagueSettingsDLModel.LSM =
      new BasketballSettingsLeagueSettingsDLModel.LeagueSettingsDLModel();
    basketballLeagueSettingsDLModel.LSM.C =
      leagueSettings.LeagueSettingsModel.Conferences.map((x) => {
        const c = new LeagueConferenceDLModel();
        c.CN = x.ConferenceName;
        c.ID = x.ID;
        c.LID = x.LeagueID;
        return c;
      });
    basketballLeagueSettingsDLModel.LSM.NOC =
      leagueSettings.LeagueSettingsModel.NumberOfConferences;
    basketballLeagueSettingsDLModel.LSM.TPD =
      leagueSettings.LeagueSettingsModel.TransferPortalDeadline;
    basketballLeagueSettingsDLModel.PM =
      new BasketballPositionDLModel.PositionDLModel();
    basketballLeagueSettingsDLModel.PM.CM = leagueSettings.PositionModel.CMax;
    basketballLeagueSettingsDLModel.PM.FM = leagueSettings.PositionModel.FMax;
    basketballLeagueSettingsDLModel.PM.GM = leagueSettings.PositionModel.GMax;
    basketballLeagueSettingsDLModel.SM =
      new BasketballSeasonDLModel.SeasonDLModel();
    basketballLeagueSettingsDLModel.SM.PSS =
      new BasketballSeasonSettingsPlayoffSeasonDLModel.SeasonSettingsPlayoffSeasonDLModel();
    basketballLeagueSettingsDLModel.SM.PSS.PT =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.PlayoffTeams;
    basketballLeagueSettingsDLModel.SM.PSS.ST =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.SeedingType;
    basketballLeagueSettingsDLModel.SM.PSS.TBT =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.TieBreakerType;
    basketballLeagueSettingsDLModel.SM.PSS.WICG =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.WeeksInChampionshipGame;
    basketballLeagueSettingsDLModel.SM.PSS.WISG =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.WeeksInSemifinalGame;
    basketballLeagueSettingsDLModel.SM.RSS =
      new BasketballSeasonSettingsRegularSeasonDLModel.SeasonSettingsRegularSeasonDLModel();
    basketballLeagueSettingsDLModel.SM.RSS.HFA =
      leagueSettings.SeasonModel.RegularSeasonSettings.HomeFieldAdvantage;
    basketballLeagueSettingsDLModel.SM.RSS.PB =
      leagueSettings.SeasonModel.RegularSeasonSettings.PointBenefit;
    basketballLeagueSettingsDLModel.SM.RSS.RSG =
      leagueSettings.SeasonModel.RegularSeasonSettings.RegularSeasonGames;
    basketballLeagueSettingsDLModel.SM.RSS.RSS =
      leagueSettings.SeasonModel.RegularSeasonSettings.RegularSeasonStart;
    basketballLeagueSettingsDLModel.SM.RSS.WPG =
      leagueSettings.SeasonModel.RegularSeasonSettings.WeeksPerGame;
    return basketballLeagueSettingsDLModel;
  }

  SoccerSettingsDLtoBL(
    leagueSettings: SoccerLeagueSettingsDLModel
  ): SoccerLeagueSettingsModel {
    const soccerLeagueSettingsModel: SoccerLeagueSettingsModel =
      new SoccerLeagueSettingsModel();
    soccerLeagueSettingsModel.ID = leagueSettings.ID;
    soccerLeagueSettingsModel.LeagueID = leagueSettings.LID;
    soccerLeagueSettingsModel.DraftSettingsModel =
      new SoccerDraftSettingsModel.DraftSettingsModel();
    soccerLeagueSettingsModel.DraftSettingsModel.Date = new Date(
      leagueSettings.DSM.D
    );
    soccerLeagueSettingsModel.DraftSettingsModel.IncludeBenchInDraft =
      leagueSettings.DSM.IBID;
    soccerLeagueSettingsModel.DraftSettingsModel.PickOrderType =
      leagueSettings.DSM.POT;
    soccerLeagueSettingsModel.DraftSettingsModel.SelectionTime =
      leagueSettings.DSM.ST;
    soccerLeagueSettingsModel.GeneralSettingsModel =
      new SoccerGeneralSettingsModel.GeneralSettingsModel();
    soccerLeagueSettingsModel.GeneralSettingsModel.LeagueManager.ID =
      leagueSettings.GSM.LMID;
    soccerLeagueSettingsModel.GeneralSettingsModel.Name = leagueSettings.GSM.N;
    soccerLeagueSettingsModel.GeneralSettingsModel.NumberOfTeams =
      leagueSettings.GSM.NOT;
    soccerLeagueSettingsModel.GeneralSettingsModel.Passcode =
      leagueSettings.GSM.P;
    soccerLeagueSettingsModel.GeneralSettingsModel.PrimaryColor =
      leagueSettings.GSM.PC;
    soccerLeagueSettingsModel.GeneralSettingsModel.PublicLeague =
      leagueSettings.GSM.PL;
    soccerLeagueSettingsModel.GeneralSettingsModel.SecondaryColor =
      leagueSettings.GSM.SC;
    soccerLeagueSettingsModel.LeagueSettingsModel =
      new SoccerSettingsLeagueSettingsModel.LeagueSettingsModel();
    soccerLeagueSettingsModel.LeagueSettingsModel.Conferences =
      leagueSettings.LSM.C.map((x) => {
        const c = new LeagueConferenceModel();
        c.ConferenceName = x.CN;
        c.ID = x.ID;
        c.LeagueID = x.LID;
        return c;
      });
    soccerLeagueSettingsModel.LeagueSettingsModel.NumberOfConferences =
      leagueSettings.LSM.NOC;
    soccerLeagueSettingsModel.LeagueSettingsModel.TransferPortalDeadline =
      leagueSettings.LSM.TPD;
    soccerLeagueSettingsModel.PositionModel =
      new SoccerPositionModel.PositionModel();
    soccerLeagueSettingsModel.PositionModel.DMax = leagueSettings.PM.DM;
    soccerLeagueSettingsModel.PositionModel.FMax = leagueSettings.PM.FM;
    soccerLeagueSettingsModel.PositionModel.FMMax = leagueSettings.PM.FMM;
    soccerLeagueSettingsModel.PositionModel.GKMax = leagueSettings.PM.GKM;
    soccerLeagueSettingsModel.PositionModel.MDMax = leagueSettings.PM.MDM;
    soccerLeagueSettingsModel.PositionModel.MMax = leagueSettings.PM.MM;
    soccerLeagueSettingsModel.SeasonModel = new SoccerSeasonModel.SeasonModel();
    soccerLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings =
      new SoccerSeasonSettingsPlayoffSeasonModel.SeasonSettingsPlayoffSeasonModel();
    soccerLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.PlayoffTeams =
      leagueSettings.SM.PSS.PT;
    soccerLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.SeedingType =
      leagueSettings.SM.PSS.ST;
    soccerLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.TieBreakerType =
      leagueSettings.SM.PSS.TBT;
    soccerLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.WeeksInChampionshipGame =
      leagueSettings.SM.PSS.WICG;
    soccerLeagueSettingsModel.SeasonModel.PlayoffSeasonSettings.WeeksInSemifinalGame =
      leagueSettings.SM.PSS.WISG;
    soccerLeagueSettingsModel.SeasonModel.RegularSeasonSettings =
      new SoccerSeasonSettingsRegularSeasonModel.SeasonSettingsRegularSeasonModel();
    soccerLeagueSettingsModel.SeasonModel.RegularSeasonSettings.HomeFieldAdvantage =
      leagueSettings.SM.RSS.HFA;
    soccerLeagueSettingsModel.SeasonModel.RegularSeasonSettings.PointBenefit =
      leagueSettings.SM.RSS.PB;
    soccerLeagueSettingsModel.SeasonModel.RegularSeasonSettings.RegularSeasonGames =
      leagueSettings.SM.RSS.RSG;
    soccerLeagueSettingsModel.SeasonModel.RegularSeasonSettings.RegularSeasonStart =
      leagueSettings.SM.RSS.RSS;
    soccerLeagueSettingsModel.SeasonModel.RegularSeasonSettings.WeeksPerGame =
      leagueSettings.SM.RSS.WPG;
    return soccerLeagueSettingsModel;
  }

  SoccerSettingsBLtoDL(
    leagueSettings: SoccerLeagueSettingsModel
  ): SoccerLeagueSettingsDLModel {
    const soccerLeagueSettingsDLModel: SoccerLeagueSettingsDLModel =
      new SoccerLeagueSettingsDLModel();
    soccerLeagueSettingsDLModel.ID = leagueSettings.ID;
    soccerLeagueSettingsDLModel.LID = leagueSettings.LeagueID;
    soccerLeagueSettingsDLModel.DSM =
      new SoccerDraftSettingsDLModel.DraftSettingsDLModel();
    soccerLeagueSettingsDLModel.DSM.D = leagueSettings.DraftSettingsModel.Date;
    soccerLeagueSettingsDLModel.DSM.IBID =
      leagueSettings.DraftSettingsModel.IncludeBenchInDraft;
    soccerLeagueSettingsDLModel.DSM.POT =
      leagueSettings.DraftSettingsModel.PickOrderType;
    soccerLeagueSettingsDLModel.DSM.ST =
      leagueSettings.DraftSettingsModel.SelectionTime;
    soccerLeagueSettingsDLModel.GSM =
      new SoccerGeneralSettingsDLModel.GeneralSettingsDLModel();
    soccerLeagueSettingsDLModel.GSM.LMID =
      leagueSettings.GeneralSettingsModel.LeagueManager.ID;
    soccerLeagueSettingsDLModel.GSM.N =
      leagueSettings.GeneralSettingsModel.Name;
    soccerLeagueSettingsDLModel.GSM.NOT =
      leagueSettings.GeneralSettingsModel.NumberOfTeams;
    soccerLeagueSettingsDLModel.GSM.P =
      leagueSettings.GeneralSettingsModel.Passcode;
    soccerLeagueSettingsDLModel.GSM.PC =
      leagueSettings.GeneralSettingsModel.PrimaryColor;
    soccerLeagueSettingsDLModel.GSM.PL =
      leagueSettings.GeneralSettingsModel.PublicLeague;
    soccerLeagueSettingsDLModel.GSM.SC =
      leagueSettings.GeneralSettingsModel.SecondaryColor;
    soccerLeagueSettingsDLModel.LSM =
      new SoccerSettingsLeagueSettingsDLModel.LeagueSettingsDLModel();
    soccerLeagueSettingsDLModel.LSM.C =
      leagueSettings.LeagueSettingsModel.Conferences.map((x) => {
        const c = new LeagueConferenceDLModel();
        c.CN = x.ConferenceName;
        c.ID = x.ID;
        c.LID = x.LeagueID;
        return c;
      });
    soccerLeagueSettingsDLModel.LSM.NOC =
      leagueSettings.LeagueSettingsModel.NumberOfConferences;
    soccerLeagueSettingsDLModel.LSM.TPD =
      leagueSettings.LeagueSettingsModel.TransferPortalDeadline;
    soccerLeagueSettingsDLModel.PM =
      new SoccerPositionDLModel.PositionDLModel();
    soccerLeagueSettingsDLModel.PM.DM = leagueSettings.PositionModel.DMax;
    soccerLeagueSettingsDLModel.PM.FM = leagueSettings.PositionModel.FMax;
    soccerLeagueSettingsDLModel.PM.FMM = leagueSettings.PositionModel.FMMax;
    soccerLeagueSettingsDLModel.PM.GKM = leagueSettings.PositionModel.GKMax;
    soccerLeagueSettingsDLModel.PM.MDM = leagueSettings.PositionModel.MDMax;
    soccerLeagueSettingsDLModel.PM.MM = leagueSettings.PositionModel.MMax;
    soccerLeagueSettingsDLModel.SM = new SoccerSeasonDLModel.SeasonDLModel();
    soccerLeagueSettingsDLModel.SM.PSS =
      new SoccerSeasonSettingsPlayoffSeasonDLModel.SeasonSettingsPlayoffSeasonDLModel();
    soccerLeagueSettingsDLModel.SM.PSS.PT =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.PlayoffTeams;
    soccerLeagueSettingsDLModel.SM.PSS.ST =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.SeedingType;
    soccerLeagueSettingsDLModel.SM.PSS.TBT =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.TieBreakerType;
    soccerLeagueSettingsDLModel.SM.PSS.WICG =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.WeeksInChampionshipGame;
    soccerLeagueSettingsDLModel.SM.PSS.WISG =
      leagueSettings.SeasonModel.PlayoffSeasonSettings.WeeksInSemifinalGame;
    soccerLeagueSettingsDLModel.SM.RSS =
      new SoccerSeasonSettingsRegularSeasonDLModel.SeasonSettingsRegularSeasonDLModel();
    soccerLeagueSettingsDLModel.SM.RSS.HFA =
      leagueSettings.SeasonModel.RegularSeasonSettings.HomeFieldAdvantage;
    soccerLeagueSettingsDLModel.SM.RSS.PB =
      leagueSettings.SeasonModel.RegularSeasonSettings.PointBenefit;
    soccerLeagueSettingsDLModel.SM.RSS.RSG =
      leagueSettings.SeasonModel.RegularSeasonSettings.RegularSeasonGames;
    soccerLeagueSettingsDLModel.SM.RSS.RSS =
      leagueSettings.SeasonModel.RegularSeasonSettings.RegularSeasonStart;
    soccerLeagueSettingsDLModel.SM.RSS.WPG =
      leagueSettings.SeasonModel.RegularSeasonSettings.WeeksPerGame;
    return soccerLeagueSettingsDLModel;
  }
}
