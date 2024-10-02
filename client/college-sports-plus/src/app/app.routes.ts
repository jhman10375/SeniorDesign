import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LeagueComponent } from './pages/league/league.component';
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
    path: 'account',
    component: PageComingComponent,
  },
  {
    path: 'league/:id',
    component: LeagueComponent,
    children: [
      {
        path: 'team',
        component: PageComingComponent,
        children: [
          {
            path: 'player:id',
            component: PageComingComponent,
          },
        ],
      },
      {
        path: 'standings',
        component: PageComingComponent,
      },

      {
        path: 'games',
        component: PageComingComponent,
      },
    ],
  },
  {
    path: 'draft',
    component: PageComingComponent,
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
