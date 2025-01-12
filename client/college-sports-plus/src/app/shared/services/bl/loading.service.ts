import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  isLoading: Observable<boolean>;

  private _isLoading = new BehaviorSubject<boolean>(false);

  constructor() {
    this.isLoading = this._isLoading.asObservable();
  }

  setIsLoading(isLoading: boolean): void {
    this._isLoading.next(isLoading);
  }
}
