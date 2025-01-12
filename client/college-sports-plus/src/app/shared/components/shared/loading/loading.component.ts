import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

import { LoadingService } from '../../../services/bl/loading.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['loading.component.scss'],
  selector: 'loading',
  templateUrl: 'loading.component.html',
})
export class LoadingComponent implements OnInit {
  isLoading: Observable<boolean>;

  currentIconIndex: WritableSignal<number> = signal(0);

  intervalId: any;

  private unsubscribe = new Subject<void>();

  constructor(private loadingService: LoadingService) {
    this.isLoading = this.loadingService.isLoading;
  }

  ngOnInit(): void {
    this.isLoading.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (loading) => {
        if (loading) {
          this.intervalId = setInterval(() => {
            this.currentIconIndex.set((this.currentIconIndex() + 1) % 4);
          }, 2000);
        } else {
          if (this.intervalId) {
            clearInterval(this.intervalId);
          }
        }
      },
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.unsubscribe.next();
  }
}
