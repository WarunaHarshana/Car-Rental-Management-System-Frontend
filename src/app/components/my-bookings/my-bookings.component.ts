import { Component, OnInit } from '@angular/core';
import { BookingService, Booking } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [],
  templateUrl: './my-bookings.component.html'
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    const myName = this.authService.getCurrentUser()?.name;
    this.bookingService.getAllBookings().subscribe({
      next: (all) => {
        this.bookings = all.filter(b => b.customerName === myName);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  cancel(id: number): void {
    if (!confirm('Cancel this booking?')) return;
    this.bookingService.cancelBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: (err) => console.error('Cancel failed:', err)
    });
  }
}