import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DraftPlayerModel } from '../models/draft-player.model';

@Component({
  standalone: true,
  imports: [],
  selector: 'draft-main',
  styleUrls: ['draft-main.component.scss'],
  templateUrl: 'draft-main.component.html',
})
export class DraftMainComponent implements OnInit {
  @Input() athletes: Array<DraftPlayerModel> = [];

  @Input() queue: Array<DraftPlayerModel> = [];

  @Input() currentlyPicking: boolean = false;

  @Input() endDraft: boolean = false;

  @Output() addToQueueEmitter = new EventEmitter<DraftPlayerModel>();

  @Output() addToRosterEmitter = new EventEmitter<DraftPlayerModel>();

  constructor() {}

  ngOnInit() {}

  addToQueue(athlete: DraftPlayerModel): void {
    this.addToQueueEmitter.emit(athlete);
  }

  addToRoster(athlete: DraftPlayerModel): void {
    this.addToRosterEmitter.emit(athlete);
  }

  inQueue(athlete: DraftPlayerModel): boolean {
    if (
      this.queue.find((x) => x.Athlete.AthleteID === athlete.Athlete.AthleteID)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
