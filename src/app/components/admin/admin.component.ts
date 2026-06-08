import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService, Car } from '../../services/car.service';
import { BookingService, Booking } from '../../services/booking.service';
import { PaymentService, Payment, PaymentApiResponse } from '../../services/payment.service';

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
  payments: Payment[] = [];

  editingId: number | null = null;
  car: Car = this.emptyCar();

  selectedPhotoFile: File | null = null;
  photoPreviewUrl: string | null = null;
  uploadingPhoto = false;

  loadingCars = true;
  loadingBookings = true;
  loadingPayments = true;

  successMessage = '';
  errorMessage = '';

  readonly carStatuses = ['AVAILABLE', 'BOOKED', 'MAINTENANCE'];
  readonly bookingStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
  readonly fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG', 'Plug-in Hybrid'];

  constructor(
    private carService: CarService,
    private bookingService: BookingService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadCars();
    this.loadBookings();
    this.loadPayments();
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
    this.selectedPhotoFile = null;
    this.photoPreviewUrl = null;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedPhotoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedPhotoFile);
    }
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

  loadPayments(): void {
    this.loadingPayments = true;
    this.paymentService.getAllPayments().subscribe({
      next: (payments: PaymentApiResponse[]) => {
        this.payments = payments.map((payment) => ({
          ...payment,
          createdAt: this.normalizePaymentDate(payment.createdAt)
        }));
        this.loadingPayments = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load transactions.';
        console.error('Load payments failed:', err);
        this.loadingPayments = false;
      }
    });
  }

  get totalRevenue(): number {
    return this.payments
      .filter((payment) => payment.status === 'SUCCESS')
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
  }

  private normalizePaymentDate(createdAt: string | number[]): string {
    if (Array.isArray(createdAt)) {
      const [year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0] = createdAt;
      return new Date(year, month - 1, day, hour, minute, second, millisecond).toISOString();
    }

    return createdAt;
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
      status: car.status,
      imageUrl: car.imageUrl
    };
    this.selectedPhotoFile = null;
    this.photoPreviewUrl = car.imageUrl
      ? this.resolveImageUrl(car.imageUrl)
      : null;
    this.successMessage = '';
    this.errorMessage = '';
  }

  resolveImageUrl(imageUrl?: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return 'http://localhost:8080' + imageUrl;
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
        next: (updatedCar) => {
          if (this.selectedPhotoFile && updatedCar.id) {
            this.uploadingPhoto = true;
            this.carService.uploadCarPhoto(updatedCar.id, this.selectedPhotoFile).subscribe({
              next: () => {
                this.uploadingPhoto = false;
                this.successMessage = 'Car updated with new photo.';
                this.resetForm();
                this.loadCars();
              },
              error: (err) => {
                this.uploadingPhoto = false;
                this.errorMessage = 'Car updated but photo upload failed.';
                console.error('Photo upload failed:', err);
                this.loadCars();
              }
            });
          } else {
            this.successMessage = 'Car updated successfully.';
            this.resetForm();
            this.loadCars();
          }
        },
        error: (err) => {
          this.errorMessage = 'Failed to update car.';
          console.error('Update car failed:', err);
        }
      });
      return;
    }

    this.carService.createCar(this.car).subscribe({
      next: (createdCar) => {
        if (this.selectedPhotoFile && createdCar.id) {
          this.uploadingPhoto = true;
          this.carService.uploadCarPhoto(createdCar.id, this.selectedPhotoFile).subscribe({
            next: () => {
              this.uploadingPhoto = false;
              this.successMessage = 'Car added with photo.';
              this.resetForm();
              this.loadCars();
            },
            error: (err) => {
              this.uploadingPhoto = false;
              this.errorMessage = 'Car added but photo upload failed.';
              console.error('Photo upload failed:', err);
              this.loadCars();
            }
          });
        } else {
          this.successMessage = 'Car added successfully.';
          this.resetForm();
          this.loadCars();
        }
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