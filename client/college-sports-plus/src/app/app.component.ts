import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';

import { MobileNavBarComponent } from './shared/components/mobile/mobile-nav-bar/mobile-nav-bar.component';
import { WebNavBarComponent } from './shared/components/web/web-nav-bar/web-nav-bar.component';
import { GeneralService } from './shared/services/general-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Button, WebNavBarComponent, MobileNavBarComponent],
  providers: [GeneralService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isMobile: boolean = false;

  constructor() {
    this.isMobile = GeneralService.isMobile();
  }
}
