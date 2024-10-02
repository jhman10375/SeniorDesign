import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  standalone: true,
  imports: [RouterLink, Button],
  selector: 'page-not-found',
  templateUrl: 'page-not-found.component.html',
})
export class PageNotFoundComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
