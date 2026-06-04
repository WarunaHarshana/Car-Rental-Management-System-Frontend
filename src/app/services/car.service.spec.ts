import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { CarService } from './car.service'; 

describe('CarService', () => {
  let service: CarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CarService,
        provideHttpClient() 
      ]
    });
    service = TestBed.inject(CarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});