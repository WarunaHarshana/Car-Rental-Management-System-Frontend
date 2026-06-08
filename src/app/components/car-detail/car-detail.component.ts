import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarService, Car } from '../../services/car.service';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './car-detail.component.html'
})
export class CarDetailComponent implements OnInit {
  car: Car | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private carService: CarService
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
  }

  getCarImageUrl(imageUrl?: string): string | null {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return 'http://localhost:8080' + imageUrl;
  }
}
