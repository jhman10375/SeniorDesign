import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  selector: 'account',
  styleUrls: ['account.component.scss'],
  templateUrl: 'account.component.html',
})
export class AccountPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
