import { Component, OnInit, signal, WritableSignal } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'sub-loading',
  styleUrls: ['sub-loading.component.scss'],
  templateUrl: 'sub-loading.component.html',
})
export class SubLoadingComponent implements OnInit {
  currentIconIndex: WritableSignal<number> = signal(0);

  intervalId: any;

  constructor() {}

  ngOnInit(): void {
    if (true) {
      this.intervalId = setInterval(() => {
        this.currentIconIndex.set((this.currentIconIndex() + 1) % 4);
      }, 2000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
