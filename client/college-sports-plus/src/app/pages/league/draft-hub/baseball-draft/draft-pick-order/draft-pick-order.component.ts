import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { MobileScoreBoardComponent } from '../../../../../shared/components/mobile/mobile-scoreboard/mobile-scoreboard.component';
import { DraftOrderModel } from '../../../../../shared/models/draft-order.model';
import { LeagueAthleteModel } from '../../../../../shared/models/league-athlete.model';

@Component({
  standalone: true,
  imports: [CommonModule, MobileScoreBoardComponent, OverlayPanelModule],
  selector: 'draft-pick-order',
  styleUrls: ['draft-pick-order.component.scss'],
  templateUrl: 'draft-pick-order.component.html',
})
export class DraftPickOrderComponent implements OnInit, OnDestroy {
  @Input() set selectionTime(v: number | undefined) {
    this._selectionTime = v;
  }

  get selectionTime() {
    return this._selectionTime;
  }

  @Input() endDraft: boolean = false;

  @Input() draftOrder: Array<DraftOrderModel> = [];

  @Input() pickOrder: Array<DraftOrderModel>;

  @Input() set pickMade(v: LeagueAthleteModel | null) {
    if (v != null && v.AthleteID) {
      clearInterval(this.intervalID);
      this.updateDisplayTime(this.selectionTime ?? 0);
      this.startSelectionTime();
    }
  }

  @Input() set currentPick(v: DraftOrderModel | null) {
    if (v != null && v.Player && v.Player.PlayerID) {
      if (this.currentRound() != v.SortOrder.Round) {
        this.currentRound.update(() => v.SortOrder.Round);
      }
      this.startSelectionTime();
      this._currentPick = v;
    }
  }

  get currentPick() {
    return this._currentPick;
  }

  @Input() set pickUpdated(v: boolean) {
    if (v && v == true && !this.timerRunning) {
    }
  }

  get pickUpdated() {
    return this._pickUpdated;
  }

  @Output() timerEnd = new EventEmitter<boolean>();

  currentRound = signal<number>(1);

  selectionTimeDisplay: string = '';

  timerRunning: boolean = false;

  private intervalID: any;

  private _currentPick: DraftOrderModel | null;

  private _selectionTime: number | undefined;

  private _pickUpdated: boolean;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    clearInterval(this.intervalID);
  }

  startSelectionTime() {
    if (this.selectionTime != undefined && !this.endDraft) {
      clearInterval(this.intervalID);
      let time = this.selectionTime;
      this.updateDisplayTime(time);
      this.timerRunning = true;
      this.intervalID = setInterval(() => {
        if (time > 0) {
          time--;
          this.updateDisplayTime(time);
        } else {
          this.updateDisplayTime(this.selectionTime ?? 0);
          clearInterval(this.intervalID);
          this.timerEnd.emit(true);
          this.timerRunning = false;
        }
      }, 1000);
    }
  }

  private updateDisplayTime(time: number): void {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.selectionTimeDisplay = `${this.addZero(minutes)}:${this.addZero(seconds)}`;
  }

  private addZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
}
