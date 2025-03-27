import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';

import { environment } from '../../../../../../environments/environment';

@Injectable()
export class DraftWebSocketService {
  private socket$: WebSocketSubject<any>;

  connect(draftKey: string, userName: string): Observable<any> {
    this.socket$ = new WebSocketSubject(
      `${environment.webSocketUrl}bsb/draft/${draftKey}?username=${userName}`
    );
    return this.socket$;
  }

  sendMessage(action: string, data: any) {
    this.socket$.next({ action, ...data });
  }
}
