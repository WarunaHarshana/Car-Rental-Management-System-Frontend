import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarService, Car } from '../../services/car.service';
import { BookingService, Booking } from '../../services/booking.service';
import { PaymentService, Payment, PaymentApiResponse } from '../../services/payment.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  cars: Car[] = [];
  bookings: Booking[] = [];
  payments: Payment[] = [];

  carSearch = '';
  selectedCarStatus = 'ALL';
  selectedFuelType = 'ALL';
  selectedBookingStatus = 'ALL';
  selectedPaymentStatus = 'ALL';
  selectedPaymentMethod = 'ALL';

  carStatusFilters = ['ALL', 'AVAILABLE', 'BOOKED', 'RENTED', 'MAINTENANCE'];
  paymentStatusFilters = ['ALL', 'SUCCESS', 'FAILED', 'PENDING'];
  paymentMethodFilters = ['ALL', 'Cash', 'Card', 'Bank Transfer', 'Online Payment'];

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

  get totalCars(): number {
    return this.cars.length;
  }

  get availableCars(): number {
    return this.cars.filter(c => c.status === 'AVAILABLE').length;
  }

  get totalBookings(): number {
    return this.bookings.length;
  }

  get totalRevenue(): number {
    return this.payments
      .filter(p => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }

  get filteredCars() {
    return this.cars.filter(car => {
      const search = this.carSearch.toLowerCase();

      const matchesSearch =
        !search ||
        car.brand?.toLowerCase().includes(search) ||
        car.model?.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedCarStatus === 'ALL' || car.status === this.selectedCarStatus;

      const matchesFuel =
        this.selectedFuelType === 'ALL' || car.fuelType === this.selectedFuelType;

      return matchesSearch && matchesStatus && matchesFuel;
    });
  }

  get filteredBookings() {
    if (this.selectedBookingStatus === 'ALL') {
      return this.bookings;
    }

    return this.bookings.filter(b => b.status === this.selectedBookingStatus);
  }

  get filteredPayments() {
    return this.payments.filter(p => {
      const matchesStatus =
        this.selectedPaymentStatus === 'ALL' || p.status === this.selectedPaymentStatus;

      const matchesMethod =
        this.selectedPaymentMethod === 'ALL' || p.method === this.selectedPaymentMethod;

      return matchesStatus && matchesMethod;
    });
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