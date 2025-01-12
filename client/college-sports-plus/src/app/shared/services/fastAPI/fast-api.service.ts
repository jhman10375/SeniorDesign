import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { DraftCreatePickOrderDataWSModel } from '../../../pages/league/draft/models/draft-create-pick-order-data.model';
import { PlayerFAPIModel } from './models/player-fapi.model';

@Injectable({ providedIn: 'root' })
export class FastAPIService {
  private readonly url = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}

  getStatus(): any {
    this.httpClient.get<{ status: string }>(this.url + 'status').subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  getTeams(team: string): any {
    this.httpClient.get<any>(this.url + 'teams/' + team).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  getPlayers(): Observable<Array<PlayerFAPIModel>> {
    return this.httpClient.get<Array<PlayerFAPIModel>>(
      this.url + 'players/get_first_string?page=1&page_size=999999'
    );
  }

  getPlayerByID(id: string): Observable<PlayerFAPIModel> {
    return this.httpClient.get<PlayerFAPIModel>(
      this.url + 'players/search/by_id/' + id + '?player_id=' + id
    );
  }

  getPlayersByIDs(
    playerIDs: Array<string>
  ): Observable<Array<PlayerFAPIModel>> {
    return this.httpClient.get<Array<PlayerFAPIModel>>(
      this.url +
        'players/search/by_ids?player_ids=' +
        `%5B${playerIDs.join(',')}%5D`
    );
  }

  createDraft(data: DraftCreatePickOrderDataWSModel): Observable<any> {
    return this.httpClient.post<string>(this.url + 'create-draft', data);
  }
}
