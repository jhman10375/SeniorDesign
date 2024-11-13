import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GeneralService } from '../../../services/bl/general-service.service';

@Component({
  standalone: true,
  imports: [RouterLink],
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
