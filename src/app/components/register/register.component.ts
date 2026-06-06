import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerData = {
    name: '',
    password: '',
    email: '',
    role: 'CUSTOMER' 
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService) {}

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: (res: any) => {
        this.successMessage = 'Registration successful! You can now sign in.';
        console.log('User registered:', res);
        this.registerData = { name: '', password: '', email: '', role: 'CUSTOMER' };
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Registration failed. Username or email might already exist.';
        console.error('Registration error:', err);
      }
    });
  }
}