import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CarService, Car } from '../../services/car.service';
import { BookingService, BookingRequest } from '../../services/booking.service';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.css'
})
export class CarListComponent implements OnInit {
  
  cars: Car[] = [];
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

  constructor(
    private carService: CarService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getAllCars().subscribe({
      next: (data) => this.cars = data,
      error: (err) => console.error('Failed to load fleet:', err)
    });
  }


  openBookingModal(car: Car): void {
    this.selectedCar = car;
    this.bookingForm.carId = car.id ?? 0;
    this.successMessage = '';
    this.errorMessage = '';
  }

  onSubmitBooking(): void {
    this.bookingService.createBooking(this.bookingForm).subscribe({
      next: (res) => {
        this.successMessage = `Reservation confirmed successfully for the ${this.selectedCar?.brand}!`;
        this.bookingForm = { carId: 0, customerName: '', contactNumber: '', startDate: '', endDate: '' };
        this.loadCars();
      },
      error: (err) => {
        this.errorMessage = 'Failed to process booking request. Please check your backend connection.';
        console.error('Booking submission error:', err);
      }
    });
  }
}