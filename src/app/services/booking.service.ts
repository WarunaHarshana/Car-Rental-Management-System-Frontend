import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookingRequest {
  carId: number;
  customerName: string;
  contactNumber: string;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = 'http://localhost:8080/api/bookings'; 

  constructor(private http: HttpClient) { }

  createBooking(bookingData: BookingRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, bookingData);
  }
}