import { Routes } from '@angular/router';

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
import { PageComingComponent } from './shared/exceptions/page-coming/page-coming.component';
import { PageNotFoundComponent } from './shared/exceptions/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'create-league',
    component: LeagueAddComponent,
  },
  {
    path: 'league-search',
    component: LeagueSearchComponent,
  },
  {
    path: 'account',
    component: PageComingComponent,
  },
  {
    path: 'league/:leagueID',
    component: LeagueComponent,
    children: [
      {
        path: 'team/:teamID',
        component: TeamComponent,
        children: [
          {
            path: 'player/:playerID',
            component: PlayerComponent,
          },
        ],
      },
      {
        path: 'standings',
        component: StandingsComponent,
      },
      {
        path: 'player-search',
        component: PlayerSearchComponent,
        children: [
          {
            path: 'player/:playerID',
            component: PlayerComponent,
          },
        ],
      },
      {
        path: 'draft',
        component: DraftComponent,
      },
      {
        path: 'history/:teamID',
        component: GameHistoryComponent,
        children: [
          {
            path: 'past-game/:weekID',
            component: GameComponent,
            children: [
              {
                path: 'player/:playerID',
                component: PlayerComponent,
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
        children: [
          {
            path: 'player/:playerID',
            component: PlayerComponent,
          },
        ],
      },
      {
        path: 'league-settings',
        component: SettingsComponent,
      },
      {
        path: 'player/:playerID',
        component: PlayerComponent,
      },
    ],
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
