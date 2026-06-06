import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService, Car } from '../../services/car.service';
import { BookingService, Booking } from '../../services/booking.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  cars: Car[] = [];
  bookings: Booking[] = [];

  editingId: number | null = null;
  car: Car = this.emptyCar();

  loadingCars = true;
  loadingBookings = true;

  successMessage = '';
  errorMessage = '';

  readonly carStatuses = ['AVAILABLE', 'BOOKED', 'MAINTENANCE'];
  readonly bookingStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

  constructor(
    private carService: CarService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadCars();
    this.loadBookings();
  }

  emptyCar(): Car {
    return {
      brand: '',
      model: '',
      fuelType: '',
      seatingCapacity: 4,
      dailyPrice: 0,
      status: 'AVAILABLE'
    };
  }

  resetForm(): void {
    this.car = this.emptyCar();
    this.editingId = null;
  }

  loadCars(): void {
    this.loadingCars = true;
    this.carService.getAllCars().subscribe({
      next: (cars) => {
        this.cars = cars;
        this.loadingCars = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load cars.';
        console.error('Load cars failed:', err);
        this.loadingCars = false;
      }
    });
  }

  loadBookings(): void {
    this.loadingBookings = true;
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loadingBookings = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load bookings.';
        console.error('Load bookings failed:', err);
        this.loadingBookings = false;
      }
    });
  }

  startEdit(car: Car): void {
    this.editingId = car.id ?? null;
    this.car = {
      id: car.id,
      brand: car.brand,
      model: car.model,
      fuelType: car.fuelType,
      seatingCapacity: car.seatingCapacity,
      dailyPrice: car.dailyPrice,
      status: car.status
    };
    this.successMessage = '';
    this.errorMessage = '';
  }

  saveCar(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.car.brand || !this.car.model || !this.car.fuelType || this.car.dailyPrice <= 0) {
      this.errorMessage = 'Please fill all required fields and provide a valid daily price.';
      return;
    }

    if (this.editingId != null) {
      this.carService.updateCar(this.editingId, this.car).subscribe({
        next: () => {
          this.successMessage = 'Car updated successfully.';
          this.resetForm();
          this.loadCars();
        },
        error: (err) => {
          this.errorMessage = 'Failed to update car.';
          console.error('Update car failed:', err);
        }
      });
      return;
    }

    this.carService.createCar(this.car).subscribe({
      next: () => {
        this.successMessage = 'Car added successfully.';
        this.resetForm();
        this.loadCars();
      },
      error: (err) => {
        this.errorMessage = 'Failed to add car.';
        console.error('Create car failed:', err);
      }
    });
  }

  removeCar(id?: number): void {
    if (!id) return;
    if (!confirm('Delete this car?')) return;

    this.carService.deleteCar(id).subscribe({
      next: () => {
        this.successMessage = 'Car deleted successfully.';
        this.errorMessage = '';
        if (this.editingId === id) {
          this.resetForm();
        }
        this.loadCars();
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete car.';
        console.error('Delete car failed:', err);
      }
    });
  }

  updateCarStatus(car: Car, status: string): void {
    if (!car.id || status === car.status) return;

    this.carService.updateCar(car.id, { ...car, status }).subscribe({
      next: () => {
        this.successMessage = 'Car status updated.';
        this.errorMessage = '';
        this.loadCars();
      },
      error: (err) => {
        this.errorMessage = 'Failed to update car status.';
        console.error('Update car status failed:', err);
      }
    });
  }

  updateBookingStatus(booking: Booking, status: string): void {
    if (status === booking.status) return;

    this.bookingService.updateBookingStatus(booking.id, status).subscribe({
      next: () => {
        this.successMessage = 'Booking status updated.';
        this.errorMessage = '';
        this.loadBookings();
      },
      error: (err) => {
        this.errorMessage = 'Failed to update booking status.';
        console.error('Update booking status failed:', err);
      }
    });
  }
}