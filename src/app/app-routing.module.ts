import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';

import { AuthGuardService } from './auth-guard.service';
import { EventsComponent } from './events/events.component';
import { MyeventsComponent } from './myevents/myevents.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  {path: 'events', component: EventsComponent, canActivate: [AuthGuardService]},
  {path: 'myevents', component: MyeventsComponent, canActivate: [AuthGuardService]},
  {path:'signin', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path:'', redirectTo:'home', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
