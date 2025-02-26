import { Routes } from '@angular/router';

import { AuthGuard } from './auth-guard.guard';
import { LoginGuard } from './login-guard.guard';
import { AccountPageComponent } from './pages/account/account.component';
import { HomeComponent } from './pages/home/home.component';
import { LeagueAddComponent } from './pages/league-add/league-add.component';
import { LeagueSearchComponent } from './pages/league-search/league-search.component';
import { DraftResultsComponent } from './pages/league/draft-results/draft-results.component';
import { DraftComponent } from './pages/league/draft/draft.component';
import { GameHistoryComponent } from './pages/league/game-history/game-history.component';
import { GameComponent } from './pages/league/game/game.component';
import { LeagueComponent } from './pages/league/league.component';
import { TeamComponent } from './pages/league/my-team/team.component';
import { PlayerSearchComponent } from './pages/league/player-search/player-search.component';
import { SettingsComponent } from './pages/league/settings/settings.component';
import { StandingsComponent } from './pages/league/standings/standings.component';
import { ForgotPasswordComponent } from './pages/login/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/login/login/login.component';
import { RegisterComponent } from './pages/login/register/register.component';
import { ResetPasswordComponent } from './pages/login/reset-password/reset-password.component';
import { PlayerComponent } from './pages/player/player.component';
import { PageNotFoundComponent } from './shared/exceptions/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-league',
    component: LeagueAddComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'league-search',
    component: LeagueSearchComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'account',
    component: AccountPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'league/:leagueID',
    component: LeagueComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'team/:teamID',
        component: TeamComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'player/:playerID',
            component: PlayerComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'standings',
        component: StandingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'player-search',
        component: PlayerSearchComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'player/:playerID',
            component: PlayerComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'draft',
        component: DraftComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'history/:teamID',
        component: GameHistoryComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'past-game/:weekID',
            component: GameComponent,
            canActivate: [AuthGuard],
            children: [
              {
                path: 'player/:playerID',
                component: PlayerComponent,
                canActivate: [AuthGuard],
              },
            ],
          },
        ],
      },
      {
        path: 'draft-results',
        component: DraftResultsComponent,
        children: [
          {
            path: 'player/:playerID',
            component: PlayerComponent,
          },
        ],
      },
      {
        path: 'current-games/:teamID',
        component: GameComponent,
        canActivate: [AuthGuard],
        // children: [
        //   {
        //     path: 'game/:gameID',
        //     component: PageComingComponent,
        //     canActivate: [AuthGuard],
        children: [
          {
            path: 'player/:playerID',
            component: PlayerComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'league-settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'player/:playerID',
        component: PlayerComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [LoginGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    canActivate: [AuthGuard],
  },
];
