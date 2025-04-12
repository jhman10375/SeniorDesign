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
  selector: 'login',
  templateUrl: 'login.component.html',
})
export class LoginComponent implements OnInit {
  username: string = '';

  password: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  login(): void {
    this.authService.login(this.username, this.password);
  }

  getExpoUser(id: number): void {
    this.authService.login(`expouser${id}@csplus.com`, `EXPO-user${id}!`);
  }
}
