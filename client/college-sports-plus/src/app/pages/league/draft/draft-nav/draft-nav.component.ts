import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { DraftNavEnum } from '../enums/draft-nav.enum';

@Component({
  standalone: true,
  imports: [],
  selector: 'draft-nav',
  templateUrl: 'draft-nav.component.html',
})
export class DraftNavComponent implements OnInit {
  readonly DraftNavEnum = DraftNavEnum;

  @Output() navigate = new EventEmitter<DraftNavEnum>();

  constructor() {}

  ngOnInit() {}

  navigateTo(route: DraftNavEnum): void {
    this.navigate.emit(route);
  }
}
