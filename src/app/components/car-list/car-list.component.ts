import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterLink } from '@angular/router';
import { CarService, Car } from '../../services/car.service';
import { BookingService, BookingRequest } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.css'
})
export class CarListComponent implements OnInit {
  
  cars: Car[] = [];

  // Search & filter 
  searchTerm = '';
  fuelFilter = '';
  maxPrice: number | null = null;

  // Unique fuel types pulled from the loaded cars 
  get fuelTypes(): string[] {
    return Array.from(new Set(this.cars.map(c => c.fuelType).filter(Boolean)));
  }

  // The list actually rendered in the template, after applying the filters
  get filteredCars(): Car[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.cars.filter(car => {
      const matchesSearch =
        !term || (car.brand + ' ' + car.model).toLowerCase().includes(term);
      const matchesFuel = !this.fuelFilter || car.fuelType === this.fuelFilter;
      const matchesPrice =
        this.maxPrice == null || car.dailyPrice <= Number(this.maxPrice);
      return matchesSearch && matchesFuel && matchesPrice;
    });
  }

  selectedCar: Car | null = null; // Tracks which car is currently being booked

  // Form model structure
  bookingForm: BookingRequest = {
    carId: 0,
    customerName: '',
    contactNumber: '',
    startDate: '',
    endDate: ''
  };

  successMessage: string = '';
  errorMessage: string = '';
  loading = false;

  constructor(
    private carService: CarService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.loading = true;
    this.errorMessage = '';
    this.carService.getAllCars().subscribe({
      next: (data) => {
        this.cars = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load cars. Please try again.';
        this.loading = false;
        console.error('Failed to load fleet:', err);
      }
    });
  }


  openBookingModal(car: Car): void {
    this.selectedCar = car;
    this.bookingForm.carId = car.id ?? 0;
    this.bookingForm.customerName = this.authService.getCurrentUser()?.name ?? this.authService.getCurrentUser()?.email ?? '';
    this.successMessage = '';
    this.errorMessage = '';
  }

  onSubmitBooking(): void {
  this.errorMessage = '';
  this.successMessage = '';

  console.log('Sending booking payload to backend:', this.bookingForm);

  this.bookingService.createBooking(this.bookingForm).subscribe({
    next: (res: any) => {
      //Display success message on the overlay
      this.successMessage = `Excellent! Reservation confirmed successfully for the ${this.selectedCar?.brand}!`;
      console.log('Backend response:', res);

      //Clear out the form inputs for the next submission
      this.bookingForm = {
        carId: 0,
        customerName: '',
        contactNumber: '',
        startDate: '',
        endDate: ''
      };

      this.loadCars();
    },
    error: (err: any) => {
      this.errorMessage = 'Failed to process booking request. Please verify your data or backend connection.';
      console.error('Booking submission error details:', err);
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