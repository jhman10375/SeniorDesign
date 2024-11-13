import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LeagueSearchComponent } from './pages/league-search/league-search.component';
import { DraftComponent } from './pages/league/draft/draft.component';
import { LeagueComponent } from './pages/league/league.component';
import { TeamComponent } from './pages/league/my-team/team.component';
import { StandingsComponent } from './pages/league/standings/standings.component';
import { PlayerComponent } from './pages/player/player.component';
import { PageComingComponent } from './shared/exceptions/page-coming/page-coming.component';
import { PageNotFoundComponent } from './shared/exceptions/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: 'login',
    component: PageComingComponent,
  },
  {
    path: 'register',
    component: PageComingComponent,
  },
  {
    path: 'reset-password',
    component: PageComingComponent,
  },
  {
    path: 'forgot-password',
    component: PageComingComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'create-league',
    component: PageComingComponent,
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
        path: 'draft',
        component: DraftComponent,
      },
      {
        path: 'history',
        component: PageComingComponent,
        children: [
          {
            path: 'game/:gameID',
            component: PageComingComponent,
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
        path: 'current-games',
        component: PageComingComponent,
        children: [
          {
            path: 'game/:gameID',
            component: PageComingComponent,
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
        path: 'league-settings',
        component: PageComingComponent,
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
