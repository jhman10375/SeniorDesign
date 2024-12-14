import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GeneralService {
  static isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
}
