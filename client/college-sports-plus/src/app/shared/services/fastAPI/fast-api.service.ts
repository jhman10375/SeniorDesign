import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { DraftCreatePickOrderDataWSModel } from '../../../pages/league/draft/models/draft-create-pick-order-data.model';

@Injectable({ providedIn: 'root' })
export class FastAPIService {
  private readonly url = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}

  getData(): any {
    this.httpClient.get<{ status: string }>(this.url + 'status').subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  createDraft(data: DraftCreatePickOrderDataWSModel): Observable<any> {
    return this.httpClient.post<string>(this.url + 'create-draft', data);
  }
}
