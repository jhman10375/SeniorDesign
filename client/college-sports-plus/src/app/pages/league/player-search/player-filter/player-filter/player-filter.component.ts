import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  standalone: true,
  imports: [OverlayPanelModule],
  selector: 'player-filter',
  templateUrl: 'player-filter.component.html',
})
export class PlayerFilterComponent implements OnInit {
  @Input() filterName: string = '';

  @Input() filters: Array<string> = [];

  @Input() currentFilter: string | null = '';

  @Output() setFilterEmitter = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  setFilter(filter: string): void {
    this.setFilterEmitter.emit(filter);
  }
}
