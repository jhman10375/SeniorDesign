import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DraftNavEnum } from '../enums/draft-nav.enum';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'draft-nav',
  templateUrl: 'draft-nav.component.html',
})
export class DraftNavComponent implements OnInit {
  readonly DraftNavEnum = DraftNavEnum;

  @Input() currentNav: DraftNavEnum = DraftNavEnum.None;

  @Output() navigate = new EventEmitter<DraftNavEnum>();

  constructor() {}

  ngOnInit() {}

  navigateTo(route: DraftNavEnum): void {
    this.navigate.emit(route);
  }

  isCurrentNav(nav: DraftNavEnum): boolean {
    if (nav == this.currentNav) {
      return true;
    } else {
      return false;
    }
  }
}
