import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  standalone: true,
  imports: [RouterLink, Button],
  selector: 'page-coming',
  templateUrl: 'page-coming.component.html',
})
export class PageComingComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
