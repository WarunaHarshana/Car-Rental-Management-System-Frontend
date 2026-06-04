import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { CarService } from './car.service'; // Fixed: Imported the service class!

describe('CarService', () => {
  let service: CarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CarService,
        provideHttpClient() // Plugs in HTTP capabilities so the test module doesn't crash
      ]
    });
    service = TestBed.inject(CarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});