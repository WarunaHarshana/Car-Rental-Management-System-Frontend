import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarService, Car } from '../../services/car.service';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.css'
})
export class CarListComponent implements OnInit {
  
  // Array to hold our car records from the database
  cars: Car[] = [];

  // Inject the CarService into the component
  constructor(private carService: CarService) {}

  // This lifecycle hook runs automatically when the component hits the screen
  ngOnInit(): void {
    this.loadCars();
  }

  // Subscribe to our service stream to fetch the data
  loadCars(): void {
    this.carService.getAllCars().subscribe({
      next: (data) => {
        this.cars = data;
        console.log('Cars fetched successfully:', this.cars);
      },
      error: (err) => {
        console.error('Failed to load cars from backend:', err);
      }
    });
  }
}