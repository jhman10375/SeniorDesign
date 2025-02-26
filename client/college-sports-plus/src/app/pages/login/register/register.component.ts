import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    PasswordModule,
    DividerModule,
    ButtonModule,
    RouterLink,
  ],
  selector: 'register',
  templateUrl: 'register.component.html',
})
export class RegisterComponent implements OnInit {
  fullName: string = '';

  username: string = '';

  password: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  register(): void {
    this.authService.register(this.fullName, this.username, this.password);
  }
}
