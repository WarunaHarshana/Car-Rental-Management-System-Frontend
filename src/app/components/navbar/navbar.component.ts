import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html', 
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() isTransparent = false;

  constructor(
    public authService: AuthService, 
    private router: Router
  ) {}

  get currentUser(): any {
    return this.authService.getCurrentUser();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getUserInitials(): string {
    const user = this.currentUser;
    if (!user) return '?';
    
    const name = user.name || user.email || '';
    if (!name) return '?';
    
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  onLogout(): void {
    this.authService.logout();
    console.log('User logged out successfully.');
    this.router.navigate(['/login']);
  }
}