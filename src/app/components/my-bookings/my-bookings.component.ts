import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BookingService, Booking } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-bookings.component.html'
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  actionInProgressId: number | null = null;
  successMessage = '';
  errorMessage = '';
  infoMessage = '';

  // Payment method selection
  selectedPaymentMethod = 'Card';
  processingPaymentId: number | null = null;
  paymentMethods: string[] = ['Cash', 'Card', 'Bank Transfer', 'Online Payment'];

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.errorMessage = '';
    this.infoMessage = '';
    this.bookingService.getAllBookings().subscribe({
      next: (all) => {
        const identityCandidates = this.getIdentityCandidates();
        if (identityCandidates.length === 0) {
          this.bookings = all;
          this.infoMessage = 'Your account name is not available locally, so all bookings are shown.';
        } else {
          this.bookings = all.filter((booking) => this.matchesCurrentUser(booking.customerName, identityCandidates));
          if (this.bookings.length === 0 && all.length > 0) {
            this.infoMessage = 'No bookings matched your signed-in name. Check that the booking was created with the same customer name.';
          }
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load bookings. Check the backend bookings endpoint.';
        console.error('Load bookings failed:', err);
        this.loading = false;
      }
    });
  }

  getIdentityCandidates(): string[] {
    const currentUser = this.authService.getCurrentUser();
    return [
      currentUser?.name,
      currentUser?.fullName,
      currentUser?.username,
      currentUser?.email,
      currentUser?.firstName,
      currentUser?.lastName
    ]
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.trim().toLowerCase());
  }

  matchesCurrentUser(customerName: string | undefined, identityCandidates: string[]): boolean {
    const normalizedCustomerName = (customerName ?? '').trim().toLowerCase();
    return identityCandidates.some((candidate) =>
      normalizedCustomerName === candidate || normalizedCustomerName.includes(candidate) || candidate.includes(normalizedCustomerName)
    );
  }

  // Upgraded checkout: sends selected payment method to backend
  checkout(bookingId: number, amount: number): void {
    if (this.processingPaymentId === bookingId) return;

    this.processingPaymentId = bookingId;
    this.successMessage = '';
    this.errorMessage = '';

    this.paymentService.checkout(bookingId, amount, this.selectedPaymentMethod).subscribe({
      next: () => {
        this.successMessage = `Payment completed successfully via ${this.selectedPaymentMethod}.`;
        this.processingPaymentId = null;
        this.loadBookings();
      },
      error: (err) => {
        this.errorMessage = 'Payment failed. Please try again.';
        console.error('Payment failed:', err);
        this.processingPaymentId = null;
      }
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