import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, map, Observable, tap } from 'rxjs';

import { LeaguePlayerModel } from '../../models/league-player.model';
import { LeagueRosterAthleteModel } from '../../models/league-roster-athlete.model';
import { SchoolModel } from '../../models/school.model';
import { SchoolService } from '../bl/school.service';
import { FastAPIService } from '../fastAPI/fast-api.service';
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

  constructor(
    private schoolService: SchoolService,
    private fastAPIService: FastAPIService,
    angularFirestore: AngularFirestore
  ) {
    super(angularFirestore);
    this.players = this._players.asObservable();
    this.playersDL = this._playersDL.asObservable();
    // this.initializePlayers();
    // this.convertPlayers();
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
      // return this.getDoc(`Player/${x}`);
      return this.getPlayer(x);
    });
    return combineLatest(obs).pipe(
      tap((results) => console.log('forkJoin results:', results))
    );

    // .pipe(
    //   map((x) => x.map((y) => this.convertFromDLPlayer(y)))
    // );
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

  initializePlayers(schools: Array<SchoolModel>): void {
    const leaguePlayers: Array<LeaguePlayerModel> = [];
    const player: LeaguePlayerModel = new LeaguePlayerModel();

    player.ID = '0';
    player.PlayerID = '9vnblV3TFHb7XNisPvkX2tTTkhj2';
    player.Name = 'Jordan Herman';
    player.DraftPickSortOrder = -1;
    player.TeamName = "Jordan's Allstars";
    player.DraftTeamPlayerIDs = [
      '4433971',
      '4688380',
      '4431196',
      '4610131',
      '4899046',
      '4429955',
      '5092232',
      '4431506',
    ];
    // player.School = this.schoolService.getSchool(
    //   SchoolNameEnum.UniversityOfCincinnati
    // );
    player.School = schools.find((x) => x.ID == '2132') ?? new SchoolModel();
    player.Logos = [
      'http://a.espncdn.com/i/teamlogos/ncaa/500/2132.png',
      'http://a.espncdn.com/i/teamlogos/ncaa/500-dark/2132.png',
    ];
    // this._players.next([...this._players.value, player]);
    leaguePlayers.push(player);

    const player2: LeaguePlayerModel = new LeaguePlayerModel();
    player2.ID = 'pMRYKuzti6N1DdXTTPfs12SWXQ73';
    player2.PlayerID = 'pMRYKuzti6N1DdXTTPfs12SWXQ73';
    player2.Name = 'Zach Herman';
    player2.DraftPickSortOrder = -1;
    player2.TeamName = "Zach's Rockstars";
    player2.DraftTeamPlayerIDs = ['0', '1'];
    // player2.School = this.schoolService.getSchool(
    //   SchoolNameEnum.OhioStateUniversity
    // );
    player2.School = schools.find((x) => x.ID == '195') ?? new SchoolModel();
    player2.Logos = [
      'http://a.espncdn.com/i/teamlogos/ncaa/500/195.png',
      'http://a.espncdn.com/i/teamlogos/ncaa/500-dark/195.png',
    ];
    // this._players.next([...this._players.value, player2]);
    leaguePlayers.push(player2);

    const player3: LeaguePlayerModel = new LeaguePlayerModel();
    player3.ID = '2';
    player3.PlayerID = '2';
    player3.Name = 'Adam Herman';
    player3.DraftPickSortOrder = -1;
    player3.TeamName = "Adam's Rockstars";
    player3.DraftTeamPlayerIDs = ['1'];
    // player3.School = this.schoolService.getSchool(
    //   SchoolNameEnum.OhioStateUniversity
    // );
    player3.School = schools.find((x) => x.ID == '2649') ?? new SchoolModel();
    player3.Logos = [
      'http://a.espncdn.com/i/teamlogos/ncaa/500/2649.png',
      'http://a.espncdn.com/i/teamlogos/ncaa/500-dark/2649.png',
    ];
    // this._players.next([...this._players.value, player3]);
    leaguePlayers.push(player3);

    this._players.next(leaguePlayers);
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

  // PRE FIREBASE
  // addPlayer(player: LeaguePlayerModel): void {
  //   const players: Array<LeaguePlayerModel> = [];
  //   this._players.next([...players, player]);
  // }

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

  // PRE FIREBASE
  // updatePlayer(player: LeaguePlayerModel): void {
  //   const players: Array<LeaguePlayerModel> = this._players.value.filter(
  //     (x) => x.ID != player.ID
  //   );
  //   this._players.next([...players, player]);
  // }

  // getPlayer(id: string): LeaguePlayerModel | undefined {
  //   const player = this._players.value.find((x) => x.ID === id);
  //   if (player) {
  //     return player;
  //   }
  //   return undefined;
  // }

  getLeague(
    players: Array<string>,
    schools: Array<SchoolModel>
  ): Array<LeaguePlayerModel> {
    this.initializePlayers(schools);
    const playersForLeague: Array<LeaguePlayerModel> = [];
    players.forEach((player) => {
      const p = this._players.value.find((x) => x.ID == player);
      if (p && !playersForLeague.includes(p)) {
        playersForLeague.push(p);
      }
    });
    return playersForLeague;
  }

  // convertPlayers(): void {}

  //Goal after conversion of players:
  // league.Players = [
  //     {
  //       ID: '0',
  //       Name: 'Jordan Herman',
  //       TeamName: "Jordan's Allstars",
  //       Team: [],
  //       TeamPlayerIDs: ['0'],
  //       School: this.schoolService.getSchool(
  //         SchoolNameEnum.UniversityOfCincinnati
  //       ),
  //     },
  //   ];
}
