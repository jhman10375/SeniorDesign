import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

import { TeamLogoModel } from '../../models/team-logo.model';
import { FastAPIService } from '../fastAPI/fast-api.service';

@Injectable({ providedIn: 'root' })
export class logoService implements OnDestroy {
  logos: Observable<Array<TeamLogoModel>>;

  private _logos = new BehaviorSubject<Array<TeamLogoModel>>([]);

  private unsubscribe = new Subject<void>();

  constructor(private fastAPIService: FastAPIService) {
    this.logos = this._logos.asObservable();
    this.fastAPIService
      .getLogos()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (logos) => this._logos.next(logos),
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }
}
