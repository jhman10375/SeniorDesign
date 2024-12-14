import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FastAPIService {
  constructor(private httpClient: HttpClient) {}

  getData(): any {
    this.httpClient
      .get<{ status: string }>(environment.apiUrl + 'status')
      .subscribe({
        next: (data) => {
          console.log(data.status);
          console.log(data);
        },
        error: (e) => {
          console.log(e);
        },
      });
  }
}
