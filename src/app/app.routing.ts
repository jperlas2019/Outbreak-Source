import { ModuleWithProviders }   from '@angular/core';
import { Routes, RouterModule }  from '@angular/router';
import { AppComponent }          from './app.component';
import { PageMainComponent }        from './app.page-main';
import { PageRegisterComponent } from './app.page-register';
import { PageLoginComponent } from './app.page-login';
import { PageShopComponent } from './app.page-shop';
import { PagePrestigeComponent } from './app.page-prestige'


// This is so that the program knows where to redirect to what page.
const appRoutes: Routes = [
  { path: 'page-main', component: PageMainComponent },
  { path: '', redirectTo: '/page-login', pathMatch: 'full' },
  { path: 'page-register', component: PageRegisterComponent },
  { path: 'page-login', component: PageLoginComponent },
  { path: 'page-shop', component: PageShopComponent },
  { path: 'page-prestige', component: PagePrestigeComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
