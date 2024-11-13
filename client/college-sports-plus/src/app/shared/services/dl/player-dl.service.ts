import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SchoolNameEnum } from '../../enums/school-name.enum';
import { LeaguePlayerModel } from '../../models/league-player.model';
import { SchoolService } from '../bl/school.service';
import { PlayerDLModel } from './models/player-dl.model';

@Injectable({ providedIn: 'root' })
export class PlayerDLService {
  players: Observable<Array<LeaguePlayerModel>>;

  playersDL: Observable<Array<PlayerDLModel>>;

  private _playersDL = new BehaviorSubject<Array<PlayerDLModel>>([]);

  private _players = new BehaviorSubject<Array<LeaguePlayerModel>>([]);

  constructor(private schoolService: SchoolService) {
    this.players = this._players.asObservable();
    this.playersDL = this._playersDL.asObservable();
    this.initializePlayers();
    this.convertPlayers();
  }

  initializePlayers(): void {}

  getPlayer(id: string): LeaguePlayerModel | undefined {
    const player = this._players.value.find((x) => x.ID === id);
    if (player) {
      return player;
    }
    return undefined;
  }

  getLeague(players: Array<string>): Array<LeaguePlayerModel> {
    const leaguePlayers: Array<LeaguePlayerModel> = [];
    const player: LeaguePlayerModel = new LeaguePlayerModel();
    player.ID = '0';
    player.Name = 'Jordan Herman';
    player.DraftPickSortOrder = -1;
    player.TeamName = "Jordan's Allstars";
    player.TeamPlayerIDs = ['0'];
    player.School = this.schoolService.getSchool(
      SchoolNameEnum.UniversityOfCincinnati
    );
    leaguePlayers.push(player);

    const player2: LeaguePlayerModel = new LeaguePlayerModel();
    player2.ID = '1';
    player2.Name = 'Zach Herman';
    player2.DraftPickSortOrder = -1;
    player2.TeamName = "Zach's Rockstars";
    player2.TeamPlayerIDs = ['0', '1'];
    player2.School = this.schoolService.getSchool(
      SchoolNameEnum.OhioStateUniversity
    );
    leaguePlayers.push(player2);

    const player3: LeaguePlayerModel = new LeaguePlayerModel();
    player3.ID = '2';
    player3.Name = 'Adam Herman';
    player3.DraftPickSortOrder = -1;
    player3.TeamName = "Adam's Rockstars";
    player3.TeamPlayerIDs = ['1'];
    player3.School = this.schoolService.getSchool(
      SchoolNameEnum.OhioStateUniversity
    );
    leaguePlayers.push(player3);

    const playersForLeague: Array<LeaguePlayerModel> = [];
    players.forEach((player) => {
      const p = leaguePlayers.find((x) => x.ID == player);
      if (p && !playersForLeague.includes(p)) {
        playersForLeague.push(p);
      }
    });
    return playersForLeague;
  }

  convertPlayers(): void {}

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
