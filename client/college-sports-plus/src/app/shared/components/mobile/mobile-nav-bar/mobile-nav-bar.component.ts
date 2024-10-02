import { Component, OnInit } from '@angular/core';

import { GeneralService } from '../../../services/general-service.service';

@Component({
  standalone: true,
  imports: [],
  selector: 'mobile-nav-bar',
  templateUrl: 'mobile-nav-bar.component.html',
})
export class MobileNavBarComponent implements OnInit {
  isMobile: boolean = false;

  constructor() {
    this.isMobile = GeneralService.isMobile();
  }
  ngOnInit() {}
}
