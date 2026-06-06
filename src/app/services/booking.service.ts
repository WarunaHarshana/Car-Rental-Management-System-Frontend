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

export interface Booking {
  id: number;
  customerName: string;
  contactNumber: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  car?: { id: number; brand?: string; model?: string };
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) {}

  createBooking(bookingData: BookingRequest): Observable<any> {
    const nestedPayload = {
      customerName: bookingData.customerName,
      contactNumber: bookingData.contactNumber,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      car: {
        id: bookingData.carId,
      },
    };

    return this.http.post(this.apiUrl, nestedPayload);
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  cancelBooking(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status?status=CANCELLED`, {});
  }
}
