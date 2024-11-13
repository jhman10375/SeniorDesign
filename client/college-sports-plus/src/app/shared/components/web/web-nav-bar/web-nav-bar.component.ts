import { Component, OnInit } from '@angular/core';

import { GeneralService } from '../../../services/bl/general-service.service';

@Component({
  standalone: true,
  imports: [],
  selector: 'web-nav-bar',
  templateUrl: 'web-nav-bar.component.html',
})
export class WebNavBarComponent implements OnInit {
  isMobile: boolean = false;

  constructor() {
    this.isMobile = GeneralService.isMobile();
  }
  ngOnInit() {}
}
