import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CarListComponent } from './components/car-list/car-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CarListComponent, LoginComponent, RegisterComponent, NavbarComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CarRentalFrontend';
}