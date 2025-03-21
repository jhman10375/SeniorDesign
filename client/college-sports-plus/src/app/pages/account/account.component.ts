import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';

import { CurrentUserModel } from '../../shared/models/current-user.model';
import { UserService } from '../../shared/services/bl/user.service';
import { AuthService } from '../login/services/auth.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    RouterLink,
    ButtonModule,
  ],
  selector: 'account',
  styleUrls: ['account.component.scss'],
  templateUrl: 'account.component.html',
})
export class AccountPageComponent implements OnInit, OnDestroy {
  displayName: string = '';

  readonlyDisplayName: string = '';

  currentUser: CurrentUserModel;

  showSaveButton: WritableSignal<boolean> = signal(false);

  private unsubscribe = new Subject<void>();

  constructor(
    private currentUserService: UserService,
    private authService: AuthService
  ) {
    this.currentUserService.CurrentUser.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe({
      next: (user) => {
        this.displayName = user.Name;
        this.readonlyDisplayName = user.Name;
        this.currentUser = user;
      },
    });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  onTextChanges(name: string): void {
    this.displayName = name;
    if (name !== this.readonlyDisplayName) {
      this.showSaveButton.set(true);
    } else {
      this.showSaveButton.set(false);
    }
  }

  saveChanges(): void {
    this.currentUser.Name = this.displayName;
    this.authService.updateUser(this.currentUser);
    this.readonlyDisplayName = this.displayName;
    this.showSaveButton.set(false);
  }
}
