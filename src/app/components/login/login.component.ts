import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginData = {
    username: '',
    password: ''
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService) {}

  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (res: any) => { // Added strict explicit typing
        this.successMessage = 'Login successful! Welcome back.';
        console.log('User logged in:', res);
      },
      error: (err: any) => { // Added strict explicit typing
        this.errorMessage = 'Invalid username or password. Please try again.';
        console.error('Login error:', err);
      }
    });
  }
}