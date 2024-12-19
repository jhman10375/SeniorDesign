import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DragDropModule } from 'primeng/dragdrop';
import { OrderListModule } from 'primeng/orderlist';

import { DraftPlayerModel } from '../models/draft-player.model';

@Component({
  standalone: true,
  imports: [OrderListModule, DragDropModule],
  selector: 'draft-queue',
  styleUrls: ['draft-queue.component.scss'],
  templateUrl: 'draft-queue.component.html',
})
export class DraftQueueComponent implements OnInit {
  @Input() athletes: Array<DraftPlayerModel> = [];

  @Input() currentlyPicking: boolean = false;

  @Input() endDraft: boolean = false;

  @Output() addToRosterEmitter = new EventEmitter<DraftPlayerModel>();

  @Output() removeFromRosterEmitter = new EventEmitter<DraftPlayerModel>();

  constructor() {}

  ngOnInit() {}

  addToRoster(athlete: DraftPlayerModel): void {
    this.addToRosterEmitter.emit(athlete);
  }

  removeFromQueue(athlete: DraftPlayerModel): void {
    this.removeFromRosterEmitter.emit(athlete);
  }
}
