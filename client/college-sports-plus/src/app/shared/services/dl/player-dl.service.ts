import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { LeaguePlayerModel } from '../../models/league-player.model';
import { LeagueRosterAthleteModel } from '../../models/league-roster-athlete.model';
import { SchoolModel } from '../../models/school.model';
import { CollectionsEnum } from '../firebase/enums/collections.enum';
import { FirebaseService } from '../firebase/firebase-base.service';
import { FirebaseCrud } from '../firebase/interfaces/firebase-crud.interface';
import { PlayerDLModel } from './models/player-dl.model';

@Injectable({ providedIn: 'root' })
export class PlayerDLService
  extends FirebaseService<PlayerDLModel>
  implements FirebaseCrud<PlayerDLModel>
{
  players: Observable<Array<LeaguePlayerModel>>;

  playersDL: Observable<Array<PlayerDLModel>>;

  private _playersDL = new BehaviorSubject<Array<PlayerDLModel>>([]);

  private _players = new BehaviorSubject<Array<LeaguePlayerModel>>([]);

  constructor(angularFirestore: AngularFirestore) {
    super(angularFirestore);
    this.players = this._players.asObservable();
    this.playersDL = this._playersDL.asObservable();
  }

  initialize(): void {
    throw new Error('Method not implemented.');
  }

  addEntity(model: PlayerDLModel): void {
    this.add(model, CollectionsEnum.Player, false);
  }

  addEntityNeedsID(model: PlayerDLModel): void {
    this.add(model, CollectionsEnum.Player, true);
  }

  deleteEntity(model: PlayerDLModel): void {
    this.delete(model, CollectionsEnum.Player);
  }

  updateEntity(model: PlayerDLModel): void {
    this.update(model, CollectionsEnum.Player);
  }

  getPlayer(playerID: string): Observable<LeaguePlayerModel> {
    return this.getDoc(`Player/${playerID}`).pipe(
      map((x) => this.convertFromDLPlayer(x))
    );
  }

  getPlayers(playerIDs: Array<string>): Observable<Array<LeaguePlayerModel>> {
    const obs = playerIDs.map((x) => {
      return this.getPlayer(x);
    });
    return combineLatest(obs);
  }

  convertFromDLPlayer(player: PlayerDLModel): LeaguePlayerModel {
    const playerBL: LeaguePlayerModel = new LeaguePlayerModel();
    if (player) {
      playerBL.ID = player.ID;
      playerBL.PlayerID = player.UserID;
      playerBL.Name = player.Name;
      playerBL.TeamName = player.TeamName;
      playerBL.School.School = player.School;
      playerBL.DraftPickSortOrder = player.DraftPickSortOrder;
      playerBL.DraftTeamPlayerIDs = player.TeamPlayerIDs;
      playerBL.DraftRoster = player.TeamPlayerIDs.map((x) => {
        const rosterAthlete: LeagueRosterAthleteModel =
          new LeagueRosterAthleteModel();
        rosterAthlete.Athlete.AthleteID = x;
        return rosterAthlete;
      });
    }
    return playerBL;
  }

  addPlayer(player: LeaguePlayerModel): void {
    const playerDL: PlayerDLModel = new PlayerDLModel();
    playerDL.ID = player.ID;
    playerDL.UserID = player.PlayerID;
    playerDL.TeamPlayerIDs = player.DraftRoster.map((x) => x.Athlete.AthleteID);
    playerDL.DraftPickSortOrder = player.DraftPickSortOrder ?? -1;
    playerDL.Name = player.Name;
    playerDL.TeamName = player.TeamName;
    playerDL.School = player.School.School;
    this.addEntity(playerDL);
  }

  updatePlayer(player: LeaguePlayerModel): void {
    const playerDL: PlayerDLModel = new PlayerDLModel();
    playerDL.DraftPickSortOrder = player.DraftPickSortOrder ?? -1;
    playerDL.ID = player.ID;
    playerDL.Name = player.Name;
    playerDL.School = player.School.School;
    playerDL.TeamName = player.TeamName;
    playerDL.TeamPlayerIDs = player.DraftTeamPlayerIDs;
    playerDL.UserID = player.PlayerID;
    this.updateEntity(playerDL);
  }

  getLeague(
    players: Array<string>,
    schools: Array<SchoolModel>
  ): Array<LeaguePlayerModel> {
    const playersForLeague: Array<LeaguePlayerModel> = [];
    players.forEach((player) => {
      const p = this._players.value.find((x) => x.ID == player);
      if (p && !playersForLeague.includes(p)) {
        playersForLeague.push(p);
      }
    });
    return playersForLeague;
  }
}
