import { Routes } from '@angular/router';
import { CarListComponent } from './components/car-list/car-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CarDetailComponent } from './components/car-detail/car-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'cars', pathMatch: 'full' },
  { path: 'cars', component: CarListComponent },
  { path: 'cars/:id', component: CarDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'cars' }
];
