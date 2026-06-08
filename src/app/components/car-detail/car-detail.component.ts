import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService, Car } from '../../services/car.service';
import { BookingService, BookingRequest } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './car-detail.component.html'
})
export class CarDetailComponent implements OnInit {
  car: Car | null = null;
  loading = true;

  booking = {
    customerName: '',
    contactNumber: '',
    startDate: '',
    endDate: ''
  };

  bookingSuccess = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private carService: CarService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
  
    this.carService.getAllCars().subscribe({
      next: (cars) => {
        this.car = cars.find(c => c.id === id) ?? null;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.booking.customerName = currentUser.name || currentUser.email || '';
    }
  }

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  get isDateRangeInvalid(): boolean {
    if (!this.booking.startDate || !this.booking.endDate) {
      return true;
    }
    return this.booking.endDate < this.booking.startDate;
  }

  get rentalDays(): number {
    if (!this.booking.startDate || !this.booking.endDate) {
      return 0;
    }
    const start = new Date(this.booking.startDate);
    const end = new Date(this.booking.endDate);
    const diff = end.getTime() - start.getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1, 0);
  }

  get estimatedTotal(): number {
    if (!this.car || this.rentalDays <= 0) {
      return 0;
    }
    return this.rentalDays * Number(this.car.dailyPrice || 0);
  }

  placeBooking(): void {
    if (this.isDateRangeInvalid || !this.car) return;

    this.errorMessage = '';
    this.successMessage = '';

    const payload: BookingRequest = {
      carId: this.car.id ?? 0,
      customerName: this.booking.customerName,
      contactNumber: this.booking.contactNumber,
      startDate: this.booking.startDate,
      endDate: this.booking.endDate
    };

    this.bookingService.createBooking(payload).subscribe({
      next: () => {
        this.bookingSuccess = true;
        this.successMessage = `Excellent! Booking confirmed successfully for the ${this.car?.brand} ${this.car?.model}!`;
        this.errorMessage = '';
        this.booking.startDate = '';
        this.booking.endDate = '';
        this.booking.contactNumber = '';
      },
      error: (err) => {
        this.errorMessage = 'Failed to process reservation request. Please try again.';
        console.error('Booking submission failed:', err);
      }
    });
  }

  getCarImageUrl(imageUrl?: string): string | null {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return 'http://localhost:8080' + imageUrl;
  }
}
